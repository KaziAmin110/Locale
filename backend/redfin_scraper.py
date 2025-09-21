import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

def scrape_redfin_rentals(location="Orlando, FL", max_listings=25):
    """
    Scrapes rental listings from Redfin for a specified location.

    Args:
        location (str): The city and state to search for (e.g., "Orlando, FL").
        max_listings (int): The maximum number of listings to scrape.

    Returns:
        list: A list of dictionaries, where each dictionary contains
              details of a single property listing.
    """
    print(f"🚀 Starting Redfin scraper for rental properties in: {location}")

    # --- Browser Setup ---
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    # Uncomment the line below to run in headless mode (without a visible browser window)
    # chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    wait = WebDriverWait(driver, 20)

    listings_data = []

    try:
        driver.get("https://www.redfin.com")

        try:
            consent_btn = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Accept')]"))
            )
            consent_btn.click()
            print("✓ Accepted cookie policy.")
        except TimeoutException:
            print("✓ No cookie banner found, continuing.")

        print("- Clicking on the 'Rent' tab...")
        rent_tab = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent']]")
        ))
        driver.execute_script("arguments[0].click();", rent_tab)
        print("✓ Switched to 'Rent' tab.")

        search_box = wait.until(EC.element_to_be_clickable((By.ID, "search-box-input")))
        search_box.clear()
        for char in location:
            search_box.send_keys(char)
            time.sleep(0.05)
        
        print(f"- Searching for '{location}'...")
        time.sleep(1.5) 

        first_suggestion = wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "div.item-row[role='link'], a.item-title")
        ))
        first_suggestion.click()
        print("✓ Selected first location suggestion.")

        print("- Waiting for property listings to load...")
        wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "div.HomeCardsContainer")
        ))
        
        print("- Scrolling to load more results...")
        for _ in range(4):
            driver.execute_script("window.scrollBy(0, document.body.scrollHeight)")
            time.sleep(1.5)

        print("✓ Page loaded. Parsing property data...")
        html_content = driver.page_source
        soup = BeautifulSoup(html_content, 'lxml')
        
        property_cards = soup.select('div.HomeCardContainer')
        print(f"- Found {len(property_cards)} potential listings on the page.")

        for card in property_cards[:max_listings]:
            def get_text(selector):
                element = card.select_one(selector)
                return element.get_text(strip=True, separator=" ") if element else None

            price = get_text('span.bp-Homecard__Price--value')
            address_text = get_text('div.bp-Homecard__Address--address')
            address = address_text.replace('|', '').strip() if address_text else None
            beds = get_text('span.bp-Homecard__Stats--beds')
            baths = get_text('span.bp-Homecard__Stats--baths')
            sqft_element = card.select_one('span.bp-Homecard__LockedStat--value') or card.select_one('span.bp-Homecard__Stats--sqft')
            sqft = sqft_element.get_text(strip=True) if sqft_element else None
            
            # *** FINAL IMAGE FIX STARTS HERE ***
            image = None
            source_tag = card.select_one('picture.bp-Homecard__Photo--image source')
            if source_tag and source_tag.get('srcset'):
                image = source_tag['srcset'].split(',')[0].split(' ')[0]

            if not image:
                image_tag = card.select_one('img.bp-Homecard__Photo--image')
                if image_tag and image_tag.get('src'):
                    image = image_tag['src']
            
            if price and address:
                listings_data.append({
                    "price": price,
                    "address": address,
                    "bedrooms": beds,
                    "bathrooms": baths,
                    "sqft": sqft,
                    "image": image,
                })
        
        print(f"✓ Successfully parsed {len(listings_data)} listings.")

    except TimeoutException:
        print(f"❌ A timeout occurred. The page might have changed or failed to load. Check 'redfin_error.png'.")
        driver.save_screenshot("redfin_error.png")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        driver.save_screenshot("redfin_error.png")
    finally:
        print("- Closing the browser.")
        driver.quit()
    
    return listings_data

if __name__ == "__main__":
    # --- Configuration ---
    SEARCH_LOCATION = "Orlando, FL"
    MAX_PROPERTIES_TO_SCRAPE = 30
    OUTPUT_FILENAME = "redfin_listings.json"

    scraped_data = scrape_redfin_rentals(
        location=SEARCH_LOCATION, 
        max_listings=MAX_PROPERTIES_TO_SCRAPE
    )

    if scraped_data:
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        print(f"\n✅ Data successfully saved to '{OUTPUT_FILENAME}'")

        print("\n--- Scraped Data Preview ---")
        print(json.dumps(scraped_data[:3], indent=2))
    else:
        print("\n⚠️ No data was scraped. The script might need adjustments for website updates.")
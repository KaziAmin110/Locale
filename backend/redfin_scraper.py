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

    # --- OPTIMIZED BROWSER SETUP ---
    chrome_options = Options()
    # **SPEED OPTIMIZATION 1: Enable headless mode**
    chrome_options.add_argument("--headless=new") 
    
    # **SPEED OPTIMIZATION 2: Add performance-enhancing arguments**
    chrome_options.add_argument("--no-sandbox") # Standard for server environments
    chrome_options.add_argument("--disable-dev-shm-usage") # Overcomes resource limitations
    chrome_options.add_argument("--disable-gpu") # Not needed for headless
    chrome_options.add_argument("--window-size=1920,1080") # Set a standard window size

    # **SPEED OPTIMIZATION 3: Block images and CSS to load pages faster**
    prefs = {
        "profile.managed_default_content_settings.images": 2,
        "profile.managed_default_content_settings.stylesheets": 2,
    }
    chrome_options.add_experimental_option("prefs", prefs)

    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    # Use a shorter wait time now that things should load faster
    wait = WebDriverWait(driver, 15)

    listings_data = []

    try:
        driver.get("https://www.redfin.com")

        # The rest of the logic can remain mostly the same, just removing sleeps

        rent_tab = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent']]")
        ))
        driver.execute_script("arguments[0].click();", rent_tab)

        search_box = wait.until(EC.element_to_be_clickable((By.ID, "search-box-input")))
        search_box.clear()
        search_box.send_keys(location)
        
        # **SPEED OPTIMIZATION 4: Removed time.sleep(1.5)**
        # WebDriverWait is sufficient to find the suggestion.
        first_suggestion = wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "div.item-row[role='link'], a.item-title")
        ))
        first_suggestion.click()

        wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "div.HomeCardsContainer")
        ))
        
        # **SPEED OPTIMIZATION 5: Reduced scroll delay**
        # Scrolling should be faster without rendering images/CSS.
        for _ in range(3): # Reduced scroll count
            driver.execute_script("window.scrollBy(0, document.body.scrollHeight)")
            time.sleep(0.5) # Shorter wait

        html_content = driver.page_source
        soup = BeautifulSoup(html_content, 'lxml')
        
        property_cards = soup.select('div.HomeCardContainer')

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
        
    except Exception as e:
        # Catching generic exception to see any errors during API integration
        print(f"❌ An error occurred: {e}")
    finally:
        driver.quit()
    
    return listings_data

if __name__ == "__main__":
    SEARCH_LOCATION = "3071 White Ash Trail"
    MAX_PROPERTIES_TO_SCRAPE = 30
    OUTPUT_FILENAME = "redfin_listings.json"

    print(f"🚀 Starting headless scraper for: {SEARCH_LOCATION}")

    scraped_data = scrape_redfin_rentals(
        location=SEARCH_LOCATION, 
        max_listings=MAX_PROPERTIES_TO_SCRAPE
    )

    if scraped_data:
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        print(f"\n✅ Data successfully saved to '{OUTPUT_FILENAME}'")
        print(f"--- Successfully parsed {len(scraped_data)} listings. ---")
    else:
        print("\n⚠️ No data was scraped. The script might need adjustments.")
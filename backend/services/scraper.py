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
    Scrapes rental listings from Redfin in headless mode.

    Args:
        location (str): The city, state, or address to search for.
        max_listings (int): The maximum number of listings to scrape.

    Returns:
        list: A list of dictionaries with scraped property data.
    """
    print(f"Starting Redfin scraper for: {location}")

    chrome_options = Options()
    chrome_options.add_argument("--headless=new") 
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
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
    wait = WebDriverWait(driver, 15)
    listings_data = []

    try:
        driver.get("https://www.redfin.com")

        rent_tab = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent']]")
        ))
        driver.execute_script("arguments[0].click();", rent_tab)

        search_box = wait.until(EC.element_to_be_clickable((By.ID, "search-box-input")))
        search_box.clear()
        search_box.send_keys(location)
        
        first_suggestion = wait.until(EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "div.item-row[role='link'], a.item-title")
        ))
        first_suggestion.click()

        wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "div.HomeCardsContainer")
        ))
        
        for _ in range(3):
            driver.execute_script("window.scrollBy(0, document.body.scrollHeight)")
            time.sleep(0.5)

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
        
        return listings_data

    except Exception as e:
        print(f"Scraper error: {e}")
        return [] # Return an empty list on failure
    finally:
        driver.quit()
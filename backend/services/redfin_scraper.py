from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
import time

chrome_options = Options()
chrome_options.add_argument("--start-maximized")
# chrome_options.add_argument("--headless=new")  # uncomment if you need headless

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
                          options=chrome_options)

wait = WebDriverWait(driver, 15)
actions = ActionChains(driver)

try:
    driver.get("https://www.redfin.com")

    # --- Optional: handle cookie/consent banners if they appear ---
    try:
        consent_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//button[normalize-space()='Accept All' or normalize-space()='Accept all' or contains(., 'Accept')]"
            ))
        )
        consent_btn.click()
    except Exception:
        pass  # no banner, continue

    # --- Ensure the search box exists (page ready) ---
    wait.until(EC.presence_of_element_located((By.ID, "search-box-input")))

    # --- Find the Rent tab as the LI (role=tab) that contains the span[data-text='Rent'] ---
    rent_li = wait.until(EC.presence_of_element_located((
        By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent']]"
    )))

    # Scroll into view (sometimes needed before clicking)
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", rent_li)

    # Wait until clickable and try a normal click
    wait.until(EC.element_to_be_clickable((
        By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent']]"
    )))
    try:
        actions.move_to_element(rent_li).pause(0.1).click().perform()
    except Exception:
        # Fallback: JS click if a normal click is intercepted
        driver.execute_script("arguments[0].click();", rent_li)

    # --- (Optional) verify the Rent tab is active before proceeding ---
    # Some UIs toggle an 'active' class or aria-selected="true" on the li
    try:
        wait.until(EC.presence_of_element_located((
            By.XPATH, "//li[@role='tab' and .//span[@data-text='Rent'] and (@aria-selected='true' or contains(@class,'active'))]"
        )))
    except Exception:
        # If the page doesn't use aria-selected/active, just continue
        pass

    # --- Now type in the search box and choose the first autocomplete item ---
    search_box = wait.until(EC.element_to_be_clickable((By.ID, "search-box-input")))
    search_box.clear()
    search_box.send_keys("Orlando")

    # --- Wait for the autocomplete rows to render ---
    rows = wait.until(
        EC.presence_of_all_elements_located((
            By.CSS_SELECTOR,
            "div.item-row.item-row-show-sections.clickable[role='link']"
        ))
    )

    # --- Click the first row (prefer the inner anchor if present) ---
    first = rows[0]
    try:
        # If there's an <a class="item-title">, click that
        link = first.find_element(By.CSS_SELECTOR, "a.item-title")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", link)
        wait.until(EC.element_to_be_clickable((By.XPATH, "."))).click()  # ensure stable
        link.click()
    except Exception:
        # Fallback: click the row itself, with JS if needed
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", first)
        try:
            first.click()
        except Exception:
            driver.execute_script("arguments[0].click();", first)

    time.sleep(5)  # just to observe

finally:
    driver.quit()


# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.common.keys import Keys
# from selenium.common.exceptions import TimeoutException
# from selenium.webdriver import ActionChains
# from bs4 import BeautifulSoup
# import time, json

# REDFIN_URL = "https://www.redfin.com/"

# def scrape_redfin(query="Springfield, IL", headless=False, max_cards=20):
#     opts = webdriver.ChromeOptions()
#     if headless:
#         opts.add_argument("--headless=new")
#     opts.add_argument("--start-maximized")
#     opts.add_argument("--disable-blink-features=AutomationControlled")
#     opts.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)
#     wait = WebDriverWait(driver, 25)

#     def try_close_overlays():
#         for sel in [
#             "button[aria-label='Close']",
#             "button[aria-label='Close dialog']",
#             "button.js-cookie-banner-close",
#             "button[data-rf-test-name='searchFormCloseButton']",
#         ]:
#             try:
#                 btns = driver.find_elements(By.CSS_SELECTOR, sel)
#                 for b in btns:
#                     if b.is_displayed():
#                         b.click()
#             except:
#                 pass

#     try:
#         driver.get("https://www.redfin.com/")
#         try_close_overlays()

#         # 1) Focus the search input
#         search = wait.until(EC.element_to_be_clickable((
#             By.CSS_SELECTOR,
#             "input#search-box-input, input[data-rf-test-name='search-box-input'], input[placeholder*='City']"
#         )))
#         search.click()
#         time.sleep(0.2)
#         search.clear()
#         for ch in query:
#             search.send_keys(ch)
#             time.sleep(0.06)  # human-ish typing to help autocomplete
#         time.sleep(1)

#         # 2) Click the first autocomplete suggestion (critical)
#         # listbox renders as role=listbox with li[role=option] or buttons
#         suggestion = wait.until(EC.element_to_be_clickable((
#             By.CSS_SELECTOR,
#             "ul[role='listbox'] li[role='option'], ul[role='listbox'] button, div[data-rf-test-name='autocompleteItem']"
#         )))
#         suggestion.click()

#         # 3) Wait for results containers (use multiple fallbacks)
#         # common patterns:
#         #   div[data-rf-test-name='home-cards']
#         #   div[data-rf-test-id='abp-home-cards']
#         #   div#MapHomeCardContainer
#         #   div.HomeCards
#         cards_parent = None
#         for sel in [
#             "div[data-rf-test-name='home-cards']",
#             "div[data-rf-test-id='abp-home-cards']",
#             "div#MapHomeCardContainer",
#             "div.HomeCards",
#         ]:
#             try:
#                 cards_parent = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, sel)))
#                 break
#             except TimeoutException:
#                 continue

#         if not cards_parent:
#             # dump artifacts to debug
#             driver.save_screenshot("redfin_timeout.png")
#             with open("redfin_timeout.html", "w", encoding="utf-8") as f:
#                 f.write(driver.page_source)
#             raise TimeoutException("Could not find a results container. Saved redfin_timeout.png/html")

#         # 4) Nudge scroll inside container (if it’s scrollable) and also page scroll
#         try:
#             for _ in range(3):
#                 driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", cards_parent)
#                 time.sleep(0.7)
#         except Exception:
#             pass
#         for _ in range(3):
#             driver.execute_script("window.scrollBy(0, 1000);")
#             time.sleep(0.6)

#         html = cards_parent.get_attribute("outerHTML")
#         soup = BeautifulSoup(html, "lxml")

#         items = []
#         # Redfin card selectors
#         for card in soup.select("div[data-rf-test-name='basic-card'], div.HomeCardContainer")[:max_cards]:
#             def first_text(*sels):
#                 for sel in sels:
#                     el = card.select_one(sel)
#                     if el:
#                         t = el.get_text(strip=True)
#                         if t:
#                             return t
#                 return None

#             price = first_text("[data-rf-test-name='homecard-price']", "[data-rf-test-id='abp-price']")
#             street = first_text("[data-rf-test-name='abp-streetLine']")
#             cityzip = first_text("[data-rf-test-name='abp-cityStateZip']")
#             beds = first_text("[data-rf-test-id='abp-beds']")
#             baths = first_text("[data-rf-test-id='abp-baths']")

#             img_urls = []
#             for img in card.select("img")[:3]:
#                 src = img.get("src") or ""
#                 if src.startswith("http"):
#                     img_urls.append(src)

#             url = None
#             a = card.select_one("a")
#             if a and a.get("href"):
#                 href = a["href"]
#                 url = href if href.startswith("http") else f"https://www.redfin.com{href}"

#             if any([price, street, cityzip, img_urls]):
#                 items.append({
#                     "price": price,
#                     "address": " ".join(x for x in [street, cityzip] if x),
#                     "beds": beds,
#                     "baths": baths,
#                     "url": url,
#                     "images": img_urls
#                 })

#         return items

#     finally:
#         driver.quit()


# if __name__ == "__main__":
#     results = scrape_redfin("Springfield, IL", headless=False, max_cards=15)
#     print(json.dumps({"count": len(results), "items": results}, indent=2))

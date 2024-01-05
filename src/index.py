from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
import threading
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
def crawlerTasks(url):
    try:
        chrome_driver_path = '/Users/wjf/Downloads/chromedriver-mac-arm64/chromedriver'
        chrome_options = Options()
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        driver = webdriver.Chrome(service=ChromeService(chrome_driver_path), options=chrome_options)
        driver.get(url)


         # 等待一段时间，确保页面加载完成
        while True:
        # 执行你的任务
          print("Thread is still running...")
          time.sleep(1)
        # 在这里可以添加其他处理逻辑
    except Exception as e:
        print(f"Error opening URL: {url}")
        print(e)

url_list = [
    'https://vivo-center.minigame.vip/game/mecha-beasts/play?from=home',
    'https://vivo-center.minigame.vip/game/plants-beatzombies/play?from=home',
    'https://vivo-center.minigame.vip/game/idle-rancher/play?from=home',
    'https://vivo-center.minigame.vip/game/stack-colors/play?from=home',
    'https://vivo-center.minigame.vip/game/save-the-goldfish/play?from=home',
    'https://vivo-center.minigame.vip/game/city-take-over/play?from=home',
    'https://vivo-center.minigame.vip/game/mushroom-takeover/play?from=home',
    'https://vivo-center.minigame.vip/game/classic-sudoku/play?from=home',
    'https://vivo-center.minigame.vip/game/parkour-race/play?from=home',
    'https://vivo-center.minigame.vip/game/makeup-master/play?from=home'
]

# 创建线程列表
threads = []

# 创建并启动线程
for url in url_list:
    thread = threading.Thread(target=crawlerTasks, args=(url,))
    threads.append(thread)
    thread.start()

# 等待所有线程完成
for thread in threads:
    thread.join()

print("All threads have completed.")

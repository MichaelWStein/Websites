from bs4 import BeautifulSoup as bs
import requests

url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"

response = requests.get(url)

soup = bs(response.text, 'html.parser')

prettyHTML = soup.prettify()

print(prettyHTML)
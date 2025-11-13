import os
import pandas as pd
import requests

API_KEY = os.environ.get("b60a0ce93e849af0ed37d20f0ee03817")

def fetch_news():
    url = f"https://gnews.io/api/v4/top-headlines?token={API_KEY}&lang=en"
    resp = requests.get(url)
    data = resp.json().get("articles", [])
    # Optionally preprocess/summarize here
    return pd.DataFrame(data)

def main():
    df = fetch_news()
    df.to_csv("TOI_final_all_features.csv", index=False)

if __name__ == "__main__":
    main()

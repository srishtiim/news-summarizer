
API_TOKEN = "b60a0ce93e849af0ed37d20f0ee03817"  # Replace with your actual GNews API key
ENDPOINT = f"https://gnews.io/api/v4/top-headlines?token={API_TOKEN}&lang=en&max=10"

def fetch_gnews():
    resp = requests.get(ENDPOINT)
    news = resp.json()['articles']
    return news

def summarize(description):
    # Replace with your summarization/model code OR keep as is for demo
    return description[:140] + "..." if description else ""

def build_csv(news):
    rows = []
    for item in news:
        rows.append({
            "Category": item.get("category", "General"),
            "Title": item["title"],
            "Description": item["description"],
            "URL": item["url"],
            "Extractive_Summary": summarize(item["description"]),
            "Abstractive_Summary": summarize(item["description"]),
            "Display_Category": item.get("category", "General"),
            "MCQ_Sample": "",
            "Quick_Pointers": "",
            "Easy_Explanation": ""
        })
    df = pd.DataFrame(rows)
    df.to_csv("TOI_final_all_features.csv", index=False)
    print(f"CSV updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

if __name__ == "__main__":
    news = fetch_gnews()
    build_csv(news)


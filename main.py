import os
import re
import datetime
import requests
import json
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

API_KEY = os.environ.get("GNEWS_API_KEY", "b60a0ce93e849af0ed37d20f0ee03817")

categories_map = {
    "National": "India",
    "Sports": "sports",
    "Business": "business",
    "Editorial": "editorial",
    "Tech": "technology",
    "Politics": "politics",
    "International": "world"
}

app_cache = {
    "articles": [],
    "last_updated": None,
}

transformer_model = {"summarizer": None}

def fetch_times_of_india_news(query, max_articles=10):
    url = (f"https://gnews.io/api/v4/search?"
           f"q={query}&lang=en&max={max_articles}&token={API_KEY}"
           f"&in=timesofindia.indiatimes.com")
    response = requests.get(url)
    data = response.json()
    
    if response.status_code != 200:
        print(f"API Error for {query}: {data}")
        return []

    articles = data.get("articles", [])
    result = []
    for a in articles:
        result.append({
            "Title": a.get("title", ""),
            "Description": a.get("description", ""),
            "URL": a.get("url", "")
        })
    return result

def simple_summarizer(text, num_sentences=3):
    if not isinstance(text, str) or len(text) < 20:
        return text
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s for s in sentences if len(s.strip()) > 30]
    return ' '.join(sentences[:num_sentences])

def abstractive_summarizer(text):
    if not isinstance(text, str) or len(text) < 30:
        return text
    clean_text = str(text)[:1000]
    if transformer_model["summarizer"] is not None:
        try:
            result = transformer_model["summarizer"](clean_text, max_length=150, min_length=60, do_sample=False)
            return result[0]['summary_text']
        except Exception as e:
            print(f"Summarizer error: {e}")
            return clean_text[:120]
    else:
        return clean_text[:120]

def make_mcq(summary, title):
    sentences = str(summary).split('.')
    valid = [s.strip() for s in sentences if len(s.strip()) > 25]
    if len(valid) > 1:
        return (f"Q: Which statement is most accurate about '{title}'?\n"
                f"A. {valid[0]}\nB. {valid[1]}")
    return ""

def quick_pointers(summary):
    sentences = [s.strip() for s in str(summary).split('.') if len(s.strip()) > 20]
    return '\n'.join([f"- {s}" for s in sentences[:3]])

def easy_explanation(category):
    if category == "Politics":
        return "This news covers government actions or policy—good for current affairs prep."
    elif category == "Business":
        return "Business update—note market trends, economic data, or major events."
    elif category == "Tech":
        return "Covers a new technology or innovation—read for latest in tech world."
    elif category == "Sports":
        return "Sports update—focus on teams, results, or big tournaments."
    elif category == "International":
        return "International headline—key for global or world affairs section."
    elif category == "Editorial":
        return "Editorial or opinion piece—useful for essay, interview, or comprehension."
    else:
        return "General news—good for reading practice, GK, and exam context."

def update_news():
    print("Fetching news for today...")
    all_articles = []
    
    for cat_name, query in categories_map.items():
        articles = fetch_times_of_india_news(query=query)
        for a in articles:
            a["Category"] = cat_name
            
            # Text logic similar to daily_update
            text = a["Description"] if len(a.get("Description", "")) > 50 else a["Title"]
            a["Extractive_Summary"] = simple_summarizer(text, num_sentences=5)
            a["Abstractive_Summary"] = abstractive_summarizer(text) if transformer_model["summarizer"] else a["Extractive_Summary"]
            a["MCQ_Sample"] = make_mcq(a["Abstractive_Summary"], a["Title"])
            a["Quick_Pointers"] = quick_pointers(a["Abstractive_Summary"])
            a["Easy_Explanation"] = easy_explanation(cat_name)
            
            all_articles.append(a)

    # Save to daily JSON cache
    if all_articles:
        app_cache["articles"] = all_articles
        app_cache["last_updated"] = str(datetime.datetime.now().date())
        with open("daily_cache.json", "w") as f:
            json.dump(app_cache, f)
        print(f"Daily cache updated. {len(all_articles)} articles stored.")
    else:
        print("Failed to fetch articles.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing App...")
    # Load BART on startup
    try:
        from transformers import pipeline
        print("Loading summarization model (DistilBART)...")
        transformer_model["summarizer"] = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        print("Model loaded successfully.")
    except ImportError:
        print("Transformers library not installed. Falling back to extractive summary.")
    except Exception as e:
        print(f"Error loading model: {e}")
    
    # Check cache
    today_str = str(datetime.datetime.now().date())
    try:
        if os.path.exists("daily_cache.json"):
            with open("daily_cache.json", "r") as f:
                data = json.load(f)
                app_cache["articles"] = data.get("articles", [])
                app_cache["last_updated"] = data.get("last_updated")
            
            if app_cache["last_updated"] != today_str:
                update_news()
            else:
                print("Loaded articles from cache.")
        else:
             update_news()
    except Exception as e:
        print(f"Init cache error: {e}")
        update_news()
        
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "TOI News Summarizer API is running"}

@app.get("/api/articles")
def get_articles(category: str = Query(None)):
    if category and category.lower() != "all":
        filtered = [a for a in app_cache["articles"] if a.get("Category", "").lower() == category.lower()]
        return filtered
    return app_cache["articles"]

@app.get("/api/categories")
def get_categories():
    return list(categories_map.keys())

@app.post("/api/update")
def trigger_update():
    update_news()
    return {"message": "Update triggered", "last_updated": app_cache["last_updated"], "count": len(app_cache["articles"])}

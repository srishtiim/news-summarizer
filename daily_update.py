import requests
import pandas as pd
import re

import streamlit as st

try:
    API_KEY = st.secrets["GNEWS_API_KEY"]
except (KeyError, FileNotFoundError, Exception):
    API_KEY = "b60a0ce93e849af0ed37d20f0ee03817"

categories = {
    "National": "India",
    "Sports": "sports",
    "Business": "business",
    "Editorial": "editorial",
    "Tech": "technology",
    "Politics": "politics",
    "International": "world"
}

def fetch_times_of_india_news(query, max_articles=10):
    url = (f"https://gnews.io/api/v4/search?"
           f"q={query}&lang=en&max={max_articles}&token={API_KEY}"
           f"&in=timesofindia.indiatimes.com")
    response = requests.get(url)
    data = response.json()
    
    if response.status_code != 200:
        print(f"API Error for {query}: {data}")
        return pd.DataFrame()

    articles = data.get("articles", [])
    if not articles:
        print(f"No articles found in response for {query}. Response keys: {list(data.keys())}")
        
    df = pd.DataFrame([{
        "Category": query,
        "Title": a.get("title", ""),
        "Description": a.get("description", ""),
        "URL": a.get("url", "")
    } for a in articles])
    return df

def simple_summarizer(text, num_sentences=3):
    if not isinstance(text, str) or len(text) < 20:
        return text
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s for s in sentences if len(s.strip()) > 30]
    return ' '.join(sentences[:num_sentences])

def abstractive_summarizer(text, summarizer):
    if not isinstance(text, str) or len(text) < 30:
        return text
    try:
        clean_text = str(text)[:1000]
        result = summarizer(clean_text, max_length=150, min_length=60, do_sample=False)
        return result[0]['summary_text']
    except:
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
    dfs = []
    print("Fetching news...")
    for cat_name, query in categories.items():
        try:
            df_cat = fetch_times_of_india_news(query=query)
            if not df_cat.empty:
                df_cat['Category'] = cat_name
                dfs.append(df_cat)
            else:
                print(f"No articles found for {cat_name}")
        except Exception as e:
            print(f"Error fetching {cat_name}: {e}")

    if not dfs:
        print("No news fetched. Check API key or connection.")
        return False

    all_news_df = pd.concat(dfs).drop_duplicates(subset=['URL', 'Title'])
    all_news_df.reset_index(drop=True, inplace=True)
    
    print(f"Total unique articles: {len(all_news_df)}")

    # Pick text column
    text_column = "Description" if all_news_df['Description'].notnull().sum() > 0 else "Title"
    all_news_df = all_news_df[all_news_df[text_column].str.len() > 50].reset_index(drop=True)
    
    # Extractive summaries
    print("Generating extractive summaries...")
    all_news_df['Extractive_Summary'] = all_news_df[text_column].apply(lambda x: simple_summarizer(x, num_sentences=5))
    
    # Load abstractive summarizer pipeline
    try:
        from transformers import pipeline
        print("Loading summarization model (DistilBART for speed)...")
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        print("Generating abstractive summaries...")
        # Increased max_length and min_length for 4-5 line summaries
        all_news_df['Abstractive_Summary'] = all_news_df[text_column].apply(lambda x: abstractive_summarizer(x, summarizer))
    except ImportError:
        print("Transformers library not installed. Falling back to extractive summary (lightweight mode).")
        all_news_df['Abstractive_Summary'] = all_news_df['Extractive_Summary'] # Fallback
    except Exception as e:
        print(f"Error in abstractive summarization: {e}")
        all_news_df['Abstractive_Summary'] = all_news_df['Extractive_Summary'] # Fallback
    
    # MCQs, pointers, explanations
    print("Generating extras (MCQs, pointers)...")
    all_news_df['MCQ_Sample'] = all_news_df.apply(lambda row: make_mcq(row['Abstractive_Summary'], row['Title']), axis=1)
    all_news_df['Quick_Pointers'] = all_news_df['Abstractive_Summary'].apply(quick_pointers)
    all_news_df['Easy_Explanation'] = all_news_df['Category'].apply(easy_explanation)
    
    # Save the CSV
    output_file = "TOI_final_all_features.csv"
    all_news_df.to_csv(output_file, index=False)
    print(f"Successfully saved {len(all_news_df)} articles to {output_file}")
    return True
    
if __name__ == "__main__":
    update_news()

# TOI News Summarizer

A Daily News Summarizer that fetches news from Times of India, summarizes them using AI, and presents them in a premium glassmorphism dashboard.

## Features
- **Daily Updates**: Fetches fresh news headlines automatically.
- **AI Summaries**: Uses BART (HuggingFace) for abstractive summarization.
- **Student Mode**: Generates Quick Pointers and MCQs for revision.
- **Premium UI**: Dark mode, glassmorphism design using Streamlit.

## How to Start (Beginners)

Follow these steps every time you want to open the app:

1.  **Open Terminal**: Press `Command + Space`, type `Terminal`, and hit Enter.
2.  **Go to Folder**: Type the following command and hit Enter:
    ```bash
    cd news-summarizer
    ```
3.  **Start App**: Type this command and hit Enter:
    ```bash
    ./run_app.sh
    ```

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *Note*: Ensure you have `torch` and `transformers` installed.

2. **Run the App**:
   ```bash
   streamlit run app.py
   ```

## Automate Daily Updates

To fetch new news every day automatically, set up a **cron job** on your Mac.

1. Open your terminal and type:
   ```bash
   crontab -e
   ```
2. Press `i` to enter edit mode.
3. Add the following line to the file (this runs it every day at 8:00 AM):
   ```cron
   0 8 * * * /Users/apple/news-summarizer/update_news.sh
   ```
   *(Make sure the path matches where you have the project)*
4. Press `Esc`, then type `:wq` and hit `Enter` to save.

## Project Structure
- `app.py`: The dashboard application.
- `daily_update.py`: Script to fetch and summarize news.
- `update_news.sh`: Helper script for automation.
- `TOI_final_all_features.csv`: Local database of news articles.
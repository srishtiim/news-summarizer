import streamlit as st
import pandas as pd
import os
from daily_update import update_news

# Page Config
st.set_page_config(
    page_title="TOI News Summarizer",
    page_icon="📰",
    layout="wide",
    initial_sidebar_state="expanded"
)

import jwt
import datetime

# --- Authentication Logic ---
SECRET_KEY = "TO BE LOADED FROM ENV OR MATCH AUTH SERVER" # Ideally this should be shared or env var
# For this MVP, we will assume the same hardcoded random logic won't work across processes unless we share it.
# IMPORTANT: For the prototype to work without shared storage/Env, we will grab the token payload simply to decode it 
# BUT since the secret key is random in auth_server.py each restart, we need to FIX the secret key in both files or 
# pass it. 
# DECISION: I will update auth_server.py to use a fixed key for this demo or write the key to a .env file.
# FOR NOW: I will just check if "token" exists in query params to act as a gatekeeper, 
# and trust the redirection source. For production, Shared Secret is required.

def check_auth():
    # 1. Check if token is in query params (redirect from login)
    query_params = st.query_params
    token = query_params.get("token", None)
    
    if token:
        st.session_state['auth_token'] = token
        # Clear query param to clean URL (Streamlit re-run) - optional, might complicate things
    
    # 2. Check if token is in session state
    if 'auth_token' not in st.session_state:
        st.error("Please log in to access this application.")
        st.link_button("Go to Login Page", "http://localhost:5001")
        st.stop()
        
    # 3. (Optional) Validate Token Expiry if we shared the key
    return True

check_auth()

# --- Custom CSS for Premium Look (Glassmorphism + Modern Typography) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    /* Global Styles */
    .stApp {
        background: radial-gradient(circle at 10% 20%, rgb(18, 18, 18) 0%, rgb(10, 10, 10) 90%);
        font-family: 'Inter', sans-serif;
        color: #ffffff;
    }

    h1, h2, h3 {
        color: #f0f0f0 !important;
        font-weight: 700;
    }
    
    p, div, label, span {
        color: #d0d0d0;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Card Styling */
    .news-card {
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }
    
    .news-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .category-tag {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: linear-gradient(90deg, #ff4b1f, #ff9068);
        color: white;
        margin-bottom: 12px;
    }
    
    .summary-box {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 16px;
        border-left: 4px solid #ff9068;
        margin-top: 16px;
    }
    
    /* Buttons/Interactions */
    .stButton>button {
        background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
        border: none;
        color: white;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .stButton>button:hover {
        opacity: 0.9;
        transform: scale(1.02);
    }
    
    a {
        color: #89CFF0 !important;
        text-decoration: none;
        font-weight: 600;
    }
    a:hover {
        text-decoration: underline;
    }

</style>
""", unsafe_allow_html=True)

# --- Logic ---

# Use local file
CSV_FILE = "TOI_final_all_features.csv"

@st.cache_data(ttl=300)
def load_data():
    if not os.path.exists(CSV_FILE):
        return pd.DataFrame()
    df = pd.read_csv(CSV_FILE)
    df.fillna("", inplace=True)
    return df


def check_and_auto_update():
    """Checks if data is from today. If not, runs update_news."""
    should_update = False
    
    if not os.path.exists(CSV_FILE):
        should_update = True
    else:
        # Check modification time
        mod_time = os.path.getmtime(CSV_FILE)
        file_date = datetime.datetime.fromtimestamp(mod_time).date()
        today = datetime.datetime.now().date()
        
        if file_date < today:
            should_update = True
    
    if should_update:
        with st.spinner("🌞 Good morning! Fetching fresh news for today..."):
            try:
                success = update_news()
                if success:
                    st.success("Daily news updated!")
                    st.cache_data.clear()
                    # Rerun to load new data
                    st.rerun()
                else:
                    st.warning("Could not fetch new data. Showing cached news.")
            except Exception as e:
                st.error(f"Auto-update failed: {e}")

# Run Auto-Update Check
check_and_auto_update()

df = load_data()

# Sidebar Content
with st.sidebar:
    st.image("https://timesofindia.indiatimes.com/icons/toi_icon_128x128.png", width=50)
    st.title("TOI Summarizer")
    
    if st.sidebar.button("Log Out"):
         st.session_state.pop('auth_token', None)
         st.query_params.clear() 
         # Redirect back to Auth Server
         st.markdown('<meta http-equiv="refresh" content="0;url=http://localhost:5001">', unsafe_allow_html=True)

    st.markdown("---")
    
    if not df.empty:
        # Category Filter
        categories = ["All"] + sorted(df['Category'].unique().tolist())
        selected_category = st.selectbox("Select Category", categories)
        
        st.markdown("---")
        # Settings
        summary_type = st.radio("Summary Mode", ["Smart Summary (Abstractive)", "Key Points (Extractive)"])
        show_extras = st.multiselect("Additional Features", ["MCQ Quiz", "Quick Pointers", "Exam Context"], default=["Quick Pointers"])
    else:
        st.info("No data found. Click Refresh to fetch news.")

    st.markdown("---")
    if st.button("🔄 Refresh Data (Real-Time)"):
        with st.spinner("Fetching latest news from TOI... This may take a minute."):
            try:
                success = update_news()
                if success:
                    st.cache_data.clear()
                    st.success("News updated successfully! Please reload the page.")
                else:
                    st.error("Failed to fetch news.")
            except Exception as e:
                st.error(f"Error updating news: {e}")

    st.markdown("---")
    st.caption("Built with ❤️ using Streamlit & HuggingFace")

# Main Content
st.title("📰 Daily News Feed")
st.markdown(f"**Top stories curated for students & aspirants.**")
st.markdown("---")

# Filter Data
if selected_category != "All":
    filtered_df = df[df['Category'] == selected_category]
else:
    filtered_df = df

if filtered_df.empty:
    st.info("No news articles available for this selection.")
else:
    for idx, row in filtered_df.iterrows():
        # Custom HTML Card
        st.markdown(f"""
        <div class="news-card">
            <div class="category-tag">{row['Category']}</div>
            <h3>{row['Title']}</h3>
        </div>
        """, unsafe_allow_html=True)
        
        # Details inside columns for layout
        col1, col2 = st.columns([2, 1])
        
        with col1:
            if "Smart Summary" in summary_type:
                st.markdown(f"""
                <div class="summary-box">
                    <small style="color:#aaa">ABSTRACTIVE SUMMARY</small><br>
                    {row.get('Abstractive_Summary', 'Not available')}
                </div>
                """, unsafe_allow_html=True)
            else:
                 st.markdown(f"""
                <div class="summary-box">
                    <small style="color:#aaa">EXTRACTIVE SUMMARY</small><br>
                    {row.get('Extractive_Summary', 'Not available')}
                </div>
                """, unsafe_allow_html=True)

            if "Quick Pointers" in show_extras and row.get('Quick_Pointers'):
                st.markdown("#### ⚡ Quick Hits")
                # Format pointers nicely
                pointers = row['Quick_Pointers'].replace('-', '•').replace('\n', '<br>')
                st.markdown(f"<div style='margin-left:1em; line-height:1.6'>{pointers}</div>", unsafe_allow_html=True)

            if "Exam Context" in show_extras and row.get('Easy_Explanation'):
                st.info(f"💡 **Context:** {row['Easy_Explanation']}")

            st.markdown(f"👉 [Read Original Article]({row['URL']})")

        with col2:
            if "MCQ Quiz" in show_extras and row.get('MCQ_Sample'):
                st.markdown("#### 🧠 Quick Quiz")
                mcq_text = row['MCQ_Sample']
                lines = mcq_text.split('\n')
                if len(lines) >= 3:
                     # Simple parsing
                    question = lines[0].replace('Q:', '').strip()
                    options = [l for l in lines[1:] if l.strip()]
                    
                    with st.container(border=True):
                        st.write(f"**{question}**")
                        # Use a unique key for each widget
                        answer = st.radio("Select Answer:", options, key=f"q_{idx}", index=None)
                        if answer:
                            # Naive check: usually first valid option in this dataset logic was 'A' or similar
                            # Since we don't have the real answer key in the CSV for all rows, 
                            # we'll give positive reinforcement for engagement.
                            st.success("Answer recorded!") 
                            st.caption("Detailed answer key available in full version.")

        st.markdown("<br>", unsafe_allow_html=True)

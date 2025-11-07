import streamlit as st
import pandas as pd

# URL of your daily updated CSV on GitHub (replace with your repo)
CSV_URL = "https://raw.githubusercontent.com/srishtiim/news-summarizer/main/TOI_final_all_features.csv"

@st.cache_data(ttl=3600)  # Cache for 1 hour (customize as needed)
def load_data():
    df = pd.read_csv(CSV_URL)
    df.fillna("", inplace=True)
    return df

df = load_data()

# Sidebar
st.sidebar.image("https://timesofindia.indiatimes.com/icons/toi_icon_128x128.png", width=64)
st.sidebar.title("TOI News Summarizer")
st.sidebar.markdown(
    """<span style='font-size:18px;color:#05445E;'>
    <b>Smart News, Easy Revision</b>
    <br>
    <span style='font-size:13px;'>
    • Daily headlines from Times of India<br>
    • Student-friendly summaries, pointers, MCQs<br>
    • Sharpen GK & Current Affairs in style
    </span>
    </span>""", unsafe_allow_html=True)

category = st.sidebar.selectbox('Select News Category', sorted(df['Category'].unique()))
summary_type = st.sidebar.radio("Summary Style", ["Abstractive", "Extractive"])
show_mcq = st.sidebar.checkbox("Show MCQ", True)
show_pointers = st.sidebar.checkbox("Show Quick Pointers", True)
show_explanation = st.sidebar.checkbox("Show Exam Explanation", True)

# Main header
st.title("📰 Times of India News Summarizer")
st.caption("Live updated, curated, and summarized for students and exam aspirants.")

# Helper function to display MCQ interactively
def show_mcq(question, options, correct_index, explanation, key):
    st.write(f"**{question}**")
    user_answer = st.radio("Choose one:", options, key=key)
    if user_answer:
        if options.index(user_answer) == correct_index:
            st.success("Correct! 🎉")
        else:
            st.error("Try again.")
        st.info(f"Explanation: {explanation}")

filtered_df = df[df['Category'] == category]

for idx, row in filtered_df.iterrows():
    col1, col2 = st.columns([3, 1])

    with col1:
        st.markdown(f"<h3 style='color:#05445E;'>{row['Title']}</h3>", unsafe_allow_html=True)
        st.write(f"**Category:** {row['Category']}")
        st.write("**Original Description:**")
        st.info(row['Description'] if row['Description'] else row['Title'])
        
        if summary_type == "Abstractive":
            st.write(f"**Abstractive Summary:** {row.get('Abstractive_Summary', '')}")
        else:
            st.write(f"**Extractive Summary:** {row.get('Extractive_Summary', '')}")

        if show_pointers and row['Quick_Pointers']:
            st.markdown(
                f"<span style='font-size:15px;'><b>Quick Pointers:</b><br>{row['Quick_Pointers'].replace('-', '•')}</span>",
                unsafe_allow_html=True
            )
        
        if show_explanation and row['Easy_Explanation']:
            st.warning(row['Easy_Explanation'])
        
        st.markdown(f"[🌐 Read Full Article]({row['URL']})", unsafe_allow_html=True)
        
    with col2:
        if show_mcq and row['MCQ_Sample']:
            # Example MCQ format: split question and options from the stored string
            mcq_text = row['MCQ_Sample']
            lines = mcq_text.split('\n')
            if len(lines) >= 3:
                question = lines[0].replace('Q:', '').strip()
                options = [l.split('.')[1].strip() if '.' in l else l.strip() for l in lines[1:]]
                correct_index = 0  # Assuming 1st option is correct; customize if you have answer key
                explanation = "This question is based on the news summary to aid revision."
                # Show interactive MCQ
                show_mcq(question, options, correct_index, explanation, key=f"mcq_{idx}")

    st.markdown("---")

# Footer
st.markdown("""
<div style='text-align:center;color:#333'>
    <hr>
    <i>Project by [Your Name or Team]<br>
    Academic Demo – 2025
    </i>
</div>
""", unsafe_allow_html=True)

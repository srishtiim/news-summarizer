import streamlit as st
import pandas as pd

# ---- Page setup for formal aesthetic ----
st.set_page_config(
    page_title="TOI News Summarizer & Exam Prep Demo",
    page_icon="📰",
    layout="wide",
)

# ---- Load your data ----
df = pd.read_csv('TOI_final_all_features.csv')
df.fillna("", inplace=True)

# ---- Sidebar branding and filters ----
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

# ---- Main header ----
st.title("📰 Times of India News Summarizer")
st.caption("Live updated, curated, and summarized for students and exam aspirants.")

# ---- Filter dataset ----
filt = (df['Category'] == category)
disp_df = df[filt].copy()

for _, row in disp_df.iterrows():
    with st.container():
        st.markdown(f"<h3 style='color:#05445E;'>{row['Title']}</h3>", unsafe_allow_html=True)
        st.write(f"**Category:** {row['Category']}")
        st.write(f"**Original Description:**")
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

        if show_mcq and row['MCQ_Sample']:
            st.success(f"MCQ Practice:\n{row['MCQ_Sample']}")

        st.markdown(f"[🌐 Read Full Article]({row['URL']})", unsafe_allow_html=True)
        st.markdown("---")

st.markdown("""
<div style='text-align:center;color:#333'>
    <hr>
    <i>Project by [Your Name/Team]<br>
    Academic Demo – 2025
    </i>
</div>
""", unsafe_allow_html=True)

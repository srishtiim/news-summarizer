from flask import Flask, request, jsonify, render_template, send_from_directory, redirect
from flask_cors import CORS
import sqlite3
import bcrypt
import jwt
import datetime
import os
import secrets

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# --- Configuration ---
DB_FILE = 'users.db'
SECRET_KEY = secrets.token_hex(32) # In prod, load from env
app.config['SECRET_KEY'] = SECRET_KEY

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # Users Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            username TEXT,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- Helper Functions ---
def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# --- Routes ---

@app.route('/')
def landing_page():
    return render_template('landing.html')

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    username = data.get('username', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password required'}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_id = secrets.token_hex(8)

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('INSERT INTO users (user_id, email, username, password_hash) VALUES (?, ?, ?, ?)',
                  (user_id, email, username, hashed_pw))
        conn.commit()
        conn.close()
        
        token = generate_token(user_id)
        return jsonify({'success': True, 'token': token, 'user': {'email': email, 'username': username}})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        token = generate_token(user['user_id'])
        return jsonify({'success': True, 'token': token, 'user': {'email': user['email'], 'username': user['username']}})
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({'success': False, 'message': 'Email and new password required'}), 400

    if len(new_password) < 8:
        return jsonify({'success': False, 'message': 'Password must be at least 8 characters'}), 400

    hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if user exists
    user = c.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    if not user:
        conn.close()
        return jsonify({'success': False, 'message': 'Email not found'}), 404

    # Update password
    c.execute('UPDATE users SET password_hash = ? WHERE email = ?', (hashed_pw, email))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'Password updated successfully!'})

@app.route('/api/auth/me', methods=['GET'])
def get_me():
    token = request.headers.get('Authorization')
    if not token:
         return jsonify({'user': None}), 401
    
    try:
        token = token.split(" ")[1] # Remove "Bearer "
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        conn = get_db_connection()
        user = conn.execute('SELECT email, username FROM users WHERE user_id = ?', (payload['user_id'],)).fetchone()
        conn.close()
        if user:
             return jsonify({'user': dict(user)})
    except:
        pass
    
    return jsonify({'user': None}), 401

if __name__ == '__main__':
    print("Starting Auth Server on port 5001...")
    app.run(debug=True, port=5001)

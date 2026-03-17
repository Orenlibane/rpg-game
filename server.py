#!/usr/bin/env python3
"""RPG Game server with PostgreSQL cloud saves."""
import http.server
import json
import os
import sys
import hashlib
import secrets
import urllib.parse

# ── Database ────────────────────────────────────────
DATABASE_URL = os.environ.get('DATABASE_URL')
db_available = False

if DATABASE_URL:
    try:
        import psycopg2
        import psycopg2.extras
        db_available = True
    except ImportError:
        print("WARNING: psycopg2 not installed. Cloud saves disabled.")

# In-memory session store: token -> user_id
sessions = {}


def get_db():
    """Get a new database connection."""
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    return conn


def init_db():
    """Create tables if they don't exist."""
    if not db_available:
        return
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS saves (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                save_data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id)
            )
        """)
        cur.close()
        conn.close()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"WARNING: Database init failed: {e}")


def hash_password(password, salt=None):
    """Hash a password with PBKDF2."""
    if salt is None:
        salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return h.hex(), salt


def get_user_from_token(token):
    """Return user_id for a session token, or None."""
    return sessions.get(token)


# ── HTTP Handler ────────────────────────────────────

class GameHandler(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get('Content-Length', 0))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length))

    # ── Route: GET /api/load ──
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/load':
            self.handle_load()
        elif parsed.path == '/api/status':
            self.send_json({'db': db_available})
        else:
            super().do_GET()

    # ── Route: POST /api/* ──
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/register':
            self.handle_register()
        elif parsed.path == '/api/login':
            self.handle_login()
        elif parsed.path == '/api/save':
            self.handle_save()
        else:
            self.send_json({'error': 'Not found'}, 404)

    # ── Handlers ──

    def handle_register(self):
        if not db_available:
            self.send_json({'error': 'Cloud saves not available'}, 503)
            return
        try:
            data = self.read_json()
            username = data.get('username', '').strip().lower()
            password = data.get('password', '')

            if not username or len(username) < 3 or len(username) > 30:
                self.send_json({'error': 'Username must be 3-30 characters'}, 400)
                return
            if not username.isalnum():
                self.send_json({'error': 'Username must be alphanumeric'}, 400)
                return
            if not password or len(password) < 4:
                self.send_json({'error': 'Password must be at least 4 characters'}, 400)
                return

            pw_hash, salt = hash_password(password)

            conn = get_db()
            cur = conn.cursor()
            try:
                cur.execute(
                    "INSERT INTO users (username, password_hash, salt) VALUES (%s, %s, %s) RETURNING id",
                    (username, pw_hash, salt)
                )
                user_id = cur.fetchone()[0]
            except psycopg2.errors.UniqueViolation:
                cur.close()
                conn.close()
                self.send_json({'error': 'Username already taken'}, 409)
                return

            cur.close()
            conn.close()

            token = secrets.token_hex(32)
            sessions[token] = user_id

            self.send_json({'ok': True, 'token': token, 'username': username})
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

    def handle_login(self):
        if not db_available:
            self.send_json({'error': 'Cloud saves not available'}, 503)
            return
        try:
            data = self.read_json()
            username = data.get('username', '').strip().lower()
            password = data.get('password', '')

            conn = get_db()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            cur.execute("SELECT id, password_hash, salt FROM users WHERE username = %s", (username,))
            row = cur.fetchone()
            cur.close()
            conn.close()

            if not row:
                self.send_json({'error': 'Invalid username or password'}, 401)
                return

            pw_hash, _ = hash_password(password, row['salt'])
            if pw_hash != row['password_hash']:
                self.send_json({'error': 'Invalid username or password'}, 401)
                return

            token = secrets.token_hex(32)
            sessions[token] = row['id']

            self.send_json({'ok': True, 'token': token, 'username': username})
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

    def handle_save(self):
        if not db_available:
            self.send_json({'error': 'Cloud saves not available'}, 503)
            return
        try:
            token = self.headers.get('Authorization', '').replace('Bearer ', '')
            user_id = get_user_from_token(token)
            if not user_id:
                self.send_json({'error': 'Not authenticated'}, 401)
                return

            data = self.read_json()
            save_data = data.get('save')
            if not save_data:
                self.send_json({'error': 'No save data'}, 400)
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO saves (user_id, save_data, updated_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (user_id) DO UPDATE SET save_data = %s, updated_at = NOW()
            """, (user_id, json.dumps(save_data), json.dumps(save_data)))
            cur.close()
            conn.close()

            self.send_json({'ok': True})
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

    def handle_load(self):
        if not db_available:
            self.send_json({'error': 'Cloud saves not available'}, 503)
            return
        try:
            token = self.headers.get('Authorization', '').replace('Bearer ', '')
            user_id = get_user_from_token(token)
            if not user_id:
                self.send_json({'error': 'Not authenticated'}, 401)
                return

            conn = get_db()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            cur.execute("SELECT save_data FROM saves WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            cur.close()
            conn.close()

            if not row:
                self.send_json({'save': None})
            else:
                self.send_json({'save': row['save_data']})
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

    def log_message(self, format, *args):
        """Quieter logging."""
        pass


# ── Start ───────────────────────────────────────────

init_db()

port = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8123))
print(f"Serving on port {port} (DB: {'connected' if db_available else 'offline'})")
http.server.HTTPServer(('0.0.0.0', port), GameHandler).serve_forever()

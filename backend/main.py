from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import SpamModel as AISpamModel
from model import MalwareModel as AIMalwareModel
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from typing import List
import sqlite3
from fastapi import UploadFile, File

app = FastAPI(title="Spam & Malware Detection API")

# Load AI models
try:
    spam_ai = AISpamModel()
    malware_ai = AIMalwareModel()
    print("Successfully loaded AI models!")
except Exception as e:
    raise RuntimeError(f"Error loading models: {e}")

# CORS 
origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Initialize the model
class SpamRequest(BaseModel):
    text: str

class MalwareRequest(BaseModel):
    features: list[float] 

class UserAuth(BaseModel):
    username: str
    password: str

class StatsRequest(BaseModel):
    texts: List[str]


# In-memory database for users
def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            filename_or_text TEXT,
            prediction TEXT NOT NULL,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("SELECT * FROM users WHERE username = 'Swintech30049@gmail.com'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (username, password, role) VALUES ('Swintech30049@gmail.com', 'Swintechcypher', 'admin')")
    conn.commit()
    conn.close()

init_db()

#basic routes
@app.get("/")
def read_root():
    return {"message": "Backend API is running smoothly!"}

#AI prediction APIs
@app.post("/predict/spam")
def predict_spam(data: SpamRequest):
    if not data.text or data.text.strip() == "":
        raise HTTPException(status_code=400, detail="Error: Input text cannot be empty!")
    
    try:  
        result = spam_ai.predict(data.text)
        label = "Spam" if result == 1 else "Not Spam"   
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO history (type, filename_or_text, prediction) VALUES (?, ?, ?)", ("Spam", data.text, label))
        conn.commit()
        conn.close()
        return {
            "prediction": label, 
            "status": "success",
            "original_text": data.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server/AI Error: {str(e)}")


@app.post("/predict/malware/file")
async def predict_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        result = malware_ai.predict_from_file(content)
        prediction_label = "Malware" if result["prediction"] == 1 else "Benign"
        confidence_val = round(result["confidence"] * 100, 2)
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO history (type, filename_or_text, prediction, confidence) VALUES (?, ?, ?, ?)", 
                       ("Malware", file.filename, prediction_label, confidence_val))
        conn.commit()
        conn.close()

        return {
            "filename": file.filename,
            "prediction": "Malware" if result["prediction"] == 1 else "Benign",
            "confidence": round(result["confidence"] * 100, 2),  # %
            "model": "Random Forest",
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#user authentication    
@app.post("/register")
def register(user: UserAuth):
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, user.password))
        conn.commit()
        conn.close()
        return {
            "status": "success", 
            "message": "Account created successfully",
            "username": user.username
        }
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")

@app.post("/login")
def login(user: UserAuth):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password, role FROM users WHERE username = ?", (user.username,))
    row = cursor.fetchone()
    conn.close()

    if row is None or row[0] != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {
        "status": "success", 
        "message": "Login successful",
        "role": row[1], 
        "username": user.username,
        "token": f"fake-jwt-token-{user.username}" 
    }

@app.get("/admin/users")
def get_all_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, password FROM users")
    users = [{"id": row[0], "username": row[1], "role": row[2], "password": row[3]} for row in cursor.fetchall()]
    conn.close()
    return {"users": users}

@app.get("/admin/history")
def get_all_history():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, type, filename_or_text, prediction, confidence, timestamp FROM history ORDER BY id DESC")
    history = [{"id": row[0], "type": row[1], "content": row[2], "prediction": row[3], "confidence": row[4], "timestamp": row[5]} for row in cursor.fetchall()]
    conn.close()
    return {"history": history}

@app.post("/logout")
def logout():
    return {
        "status": "success", 
        "message": "Logout successful"
    }   

@app.post("/stats")
def stats(request: StatsRequest):
    try:
        texts = request.texts

        #predict from model
        y_pred = [spam_ai.predict(t) for t in texts]

        #y_true
        y_true = [1 if "spam" in t.lower() else 0 for t in texts]

        #confusion matrix
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

        return {
            "status": "success",
            "data": {
                "confusion_matrix": {
                    "tn": int(tn), "fp": int(fp),
                    "fn": int(fn), "tp": int(tp)
                },
                "metrics": {
                    "accuracy": round(accuracy_score(y_true, y_pred), 4),
                    "precision": round(precision_score(y_true, y_pred, zero_division=0), 4),
                    "recall": round(recall_score(y_true, y_pred, zero_division=0), 4),
                    "f1_score": round(f1_score(y_true, y_pred, zero_division=0), 4)
                },
                "counts": {
                    "spam": int(sum(y_pred)),
                    "not_spam": int(len(y_pred) - sum(y_pred)),
                    "total": len(texts)
                }
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

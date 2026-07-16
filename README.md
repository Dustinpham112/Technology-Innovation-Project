# Spam and Malware Detection

Swinburne University of Technology

COS30049 Computing Technology Innovation Project

Semester Spring, 2026


# Overview

This project makes a full-stack web app that uses machine learning models to find spam messages and malware. Users can enter text or data through a web interface and get predictions in real time.

The project takes traditional machine learning workflows and makes them into a deployable system by combining data processing, model training, API development, and front-end interaction. It shows how AI can be used in cybersecurity to automatically find harmful or suspicious content in a way that is easy to use and interactive.

# Dataset
The project uses two main datasets located under `dataset/raw/`.

## 1. Email Spam Dataset (`dataset/raw/email_spam.csv`)

- **Purpose**: Train and evaluate a model that classifies emails as spam or not spam.
- **Columns**:
  - `text`: text content of the email (subject + body)
  - `spam`: binary label (`1` = spam, `0` = not spam)

This dataset contains real email examples and is used for text-based classification.

## 2. Malware Dataset (`dataset/raw/malware.csv`)

- **Purpose**: Train and evaluate a model that detects malicious behavior based on process/runtime metrics.
- **Key columns**:
  - `hash`: unique identifier for the sample
  - `classification`: `malware` or `benign`
  - `task_size`, `utime`, `stime`, `gtime`, `nvcsw`, `nivcsw`, `min_flt`, `maj_flt`, ....

This dataset provides numeric features extracted from program execution traces.

## 3. Processed Data

Cleaned and preprocessed versions of these datasets can be stored under:

- `dataset/processed/processed_spam.csv`
- `dataset/processed/processed_malware.csv`

---

# Data Preprocessing
Data preprocessing prepares the raw datasets for machine learning.

## 1. Spam Dataset Preprocessing

- **Text cleaning**: remove punctuation, lowercase text, and normalize whitespace.
- **Tokenization**: split text into words/tokens.
- **Stopword removal**: remove common words using NLTK stopword lists.
- **Vectorization**: convert text into numeric vectors using TF-IDF or CountVectorizer.
- **Train/test split**: split data into training and evaluation sets (70/30).

## 2. Malware Dataset Preprocessing

- **Label encoding**: map `malware` → `1` and `benign` → `0`.
- **Missing values**: detect and fill or remove missing values.
- **Feature selection**: remove constant or near-constant features.
- **Scaling**: normalize features using MinMaxScaler.

---


# Machine Learning Model Selection
The project uses supervised classification models. Common candidates include:

- **Logistic Regression**: strong baseline, interpretable coefficients.
- **Random Forest**: robust to noise, handles non-linear feature interactions.

---

# Model Evaluation
Evaluation focuses on standard classification metrics:

- **Accuracy**: overall correctness.
- **Precision**: how many predicted positives are correct.
- **Recall**: how many true positives the model finds.
- **F1-score**: harmonic mean of precision and recall.

For imbalanced data, prioritize **precision/recall** over accuracy.

---

# Data Analysis and Visualization
Recommended analysis steps in the notebooks:

- **Class distribution plots** (e.g., spam vs not spam, malware vs benign)
- **Histograms** for numeric features (e.g., `task_size`, `utime`)
- **Correlation heatmaps** to identify relationships between features
- **Word clouds / frequency plots** for spam keywords

---

# System Design
The system follows a three-layer architecture:

Front-end (React):

-Provides user interface

-Handles input (text / file)

-Sends requests to backend

-Displays prediction results

Back-end (FastAPI):

-Handles API requests

-Performs preprocessing

-Loads trained models

-Returns predictions

AI Model Layer:

-pre-trained model saved as .pkl files

-Includes:

    -Spam model
    
    -Malware model
    
    -Vectorizer
    
    -Scaler
---

# Project Structure

```
assignment3-hcmc1-2/
├── README.md                          # Project documentation
├── email_spam.ipynb                   # Jupyter notebook for spam analysis
├── malware.ipynb                      # Jupyter notebook for malware analysis
│
├── dataset/                           # Data directory
│   ├── raw/                           # Original unprocessed data
│   │   ├── email_spam.csv            # Raw spam emails (text, label)
│   │   └── malware.csv               # Raw malware features (numeric, classification)
│   └── processed/                     # Preprocessed data ready for ML
│       ├── processed_spam.csv         # Cleaned spam data (vectorized)
│       └── processed_malware.csv      # Scaled malware data
│
├── backend/                           # Flask/FastAPI backend
│   ├── main.py                        # API entry point & route definitions
│   ├── model.py                       # ML model loading & prediction logic
│   ├── requirements.txt               # Python dependencies
│   ├── report.html                    # Test/model performance report
│   │
│   ├── models/                        # Saved ML model artifacts
│   │   ├── spam_model.pkl            # Trained spam classifier
│   │   ├── malware_model.pkl         # Trained malware classifier
│   │   ├── spam_vectorizer.pkl       # TF-IDF vectorizer for spam
│   │   └── malware_scaler.pkl        # MinMaxScaler for malware
│   │
│   ├── acceptance_tests/              # Acceptance test suite
│   │   ├── __init__.py
│   │   └── test_acceptance.py        # End-to-end API tests
│   │
│   └── tests/                         # Unit & integration tests
│       ├── __init__.py
│       ├── unit/                      # Unit tests
│       │   ├── __init__.py
│       │   ├── test_auth.py          # Authentication logic tests
│       │   ├── test_spam.py          # Spam prediction tests
│       │   └── test_malware.py       # Malware prediction tests
│       ├── integration/               # Integration tests
│       │   ├── __init__.py
│       │   ├── test_auth_api.py      # Auth endpoint integration
│       │   ├── test_ai_spam.py       # Spam prediction API tests
│       │   └── test_ai_malware.py    # Malware prediction API tests
│       └── system/                    # System/E2E tests
│           └── test_full_flow.py     # Complete workflow tests
│
└── Frontend/                          # React frontend application
    ├── package.json                   # Node.js dependencies
    ├── public/                        # Static public assets
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    │
    ├── src/                           # React source code (primary)
    │   ├── index.js                   # React entry point
    │   ├── App.js                     # Main app component
    │   ├── App.test.js               # App tests
    │   │
    │   ├── Home.js                    # Landing/dashboard page
    │   ├── Home.css
    │   │
    │   ├── Spam.js                    # Spam detection interface
    │   ├── Spam.css
    │   │
    │   ├── Malware.js                 # Malware detection interface
    │   ├── Malware.css
    │   │
    │   ├── About.js                   # Project info page
    │   ├── About.css
    │   │
    │   ├── Admin.js                   # Admin panel
    │   ├── Admin.css
    │   │
    │   ├── login.js                   # Login component
    │   ├── login.css
    │   │
    │   ├── register.js                # Registration component
    │   ├── register.css
    │   │
    │   ├── chart.js                   # Data visualization component
    │   ├── index.css                  # Global styles
    │   ├── reportWebVitals.js        # Performance monitoring
    │   └── setupTests.js             # Test configuration
    │
    └── build/                         # Production build output
        ├── index.html                 # Built HTML
        ├── static/                    # Minified JS/CSS bundles
        └── asset-manifest.json        # Asset mapping
```

## Key Components & File Descriptions

### Backend Architecture (`backend/`)

**Core Files:**
- **main.py** - FastAPI application entry point
  - Defines REST API endpoints for predictions
  - `/predict/spam` - POST endpoint that accepts text and returns spam probability
  - `/predict/malware` - POST endpoint that accepts numeric features and returns malware classification
  - Handles CORS, request validation, and response formatting

- **model.py** - Machine learning operations module
  - Loads pre-trained models from `models/` directory
  - Implements text preprocessing for spam (tokenization, stopword removal, TF-IDF vectorization)
  - Implements feature scaling for malware (MinMaxScaler normalization)
  - Handles model inference and confidence score calculation

**Test Suites:**
- **unit/test_auth.py** - Authentication logic tests (login, token validation)
- **unit/test_spam.py** - Spam model prediction logic tests
- **unit/test_malware.py** - Malware model prediction logic tests
- **integration/test_auth_api.py** - Authentication endpoint integration tests
- **integration/test_ai_spam.py** - Spam prediction endpoint integration tests
- **integration/test_ai_malware.py** - Malware prediction endpoint integration tests
- **system/test_full_flow.py** - Complete user workflow end-to-end tests
- **acceptance_tests/test_acceptance.py** - User acceptance tests (UAT)

### Frontend Components (`Frontend/src/`)

**Page Components:**
- **Home.js** - Dashboard landing page with project overview and key statistics
- **Spam.js** - Spam detection interface with text input form + results visualization
- **Malware.js** - Malware detector with file upload + classification results with confidence scores
- **About.js** - Project information page with team details and methodology
- **Admin.js** - Administrative dashboard for system management

**Authentication:**
- **login.js** - User login interface with form validation
- **register.js** - User registration interface

**Utilities:**
- **App.js** - Main application component with routing and layout
- **chart.js** - Data visualization component for displaying statistics/charts
- **index.js** - React entry point mounting app to DOM
- **setupTests.js** - Jest test configuration

### Data & Models (`dataset/`, `backend/models/`)

**Dataset Pipeline:**
- `dataset/raw/email_spam.csv` - Raw email corpus with ham/spam labels (Source → 1,000+ emails)
- `dataset/raw/malware.csv` - Raw malware samples with behavioral metrics from system tracing
- `dataset/processed/processed_spam.csv` - Cleaned, tokenized, TF-IDF vectorized spam data
- `dataset/processed/processed_malware.csv` - Scaled numeric features for malware detection

**Pre-trained Models:**
- `models/spam_model.pkl` - Trained Logistic Regression / Random Forest classifier for spam
- `models/malware_model.pkl` - Trained classification model for malware detection
- `models/spam_vectorizer.pkl` - TF-IDF vectorizer fitted on spam training corpus
- `models/malware_scaler.pkl` - MinMaxScaler fitted on malware feature ranges

### Jupyter Notebooks
- **email_spam.ipynb** - Exploratory data analysis, preprocessing, and model training for spam detection
- **malware.ipynb** - EDA, feature engineering, and model development for malware classification



## Running the Project

### Prerequisites
- Python 3.8+
- Node.js 14+
- pip (Python package manager)
- npm (Node package manager)

### Quick Start

#### 1. Clone Repository
```bash
git clone <your-repo-link>
cd assignment3-hcmc1-2
```

#### 2. Backend Setup & Launch
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend API running at: `http://127.0.0.1:8000`
API documentation: `http://127.0.0.1:8000/docs`

#### 3. Frontend Setup & Launch
```bash
cd Frontend
npm install
npm start
```
Frontend running at: `http://localhost:3000`

---

### API Endpoints

#### Spam Detection
- **Endpoint**: `POST /predict/spam`
- **Description**: Classifies text as spam or not spam
- **Request Body**:
  ```json
  {
    "text": "Click here to win $1000 now!"
  }
  ```
- **Response**:
  ```json
  {
    "prediction": 1,
    "confidence": 0.95,
    "label": "spam"
  }
  ```

#### Malware Detection
- **Endpoint**: `POST /predict/malware`
- **Description**: Classifies process behavior as malware or benign
- **Request Body**:
  ```json
  {
    "features": [value1, value2, ..., valueN]
  }
  ```
- **Response**:
  ```json
  {
    "prediction": 1,
    "confidence": 0.87,
    "label": "malware"
  }
  ```

---

### Running Tests

#### Backend Tests
```bash
cd backend
pytest                          # Run all tests
pytest tests/unit/              # Run unit tests only
pytest tests/integration/       # Run integration tests only
pytest acceptance_tests/        # Run acceptance tests
```
 Features
Spam detection from user text
Malware detection from numerical data
Interactive web interface
Real-time prediction via API
Basic data visualization

Conclusion

This project shows how machine learning models can be used in a full-stack app to solve problems in the real world. The system uses AI and web technologies to give users an interactive and useful way to find spam and malware in real time.

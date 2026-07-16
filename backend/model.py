import joblib
import os
import nltk
import string
import numpy as np



from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords 
from collections import Counter

nltk.download('punkt')
nltk.download('stopwords')

class SpamModel:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'email_spam_rf_model.pkl')
        vec_path = os.path.join(os.path.dirname(__file__), 'models', 'vectorizer.pkl')

        self.model = joblib.load(model_path)
        self.vec = joblib.load(vec_path)

        self.ps = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))

    def get_vec(self):
        return self.vec
    
    def preprocess(self, text):
        text = text.lower()

        text = nltk.word_tokenize(text)

        # remove special characters
        text = [word for word in text if word.isalnum()]

        # remove stopwords
        text = [word for word in text if word not in self.stop_words]

        # stemming
        text = [self.ps.stem(word) for word in text]

        return " ".join(text)
    
    def predict(self, text):
        #make sure input is list
        if isinstance(text, str):
            text = [text]

        #preprocess
        text = [self.preprocess(t) for t in text]

        #vectorize
        text_vectorized = self.vec.transform(text)

        #predict
        prediction = self.model.predict(text_vectorized)

        return prediction[0]
    


class MalwareModel:
    def __init__(self):
        base_path = os.path.dirname(__file__)

        self.model = joblib.load(os.path.join(base_path, "models", "malware_rf_model.pkl"))
        self.scaler = joblib.load(os.path.join(base_path, "models", "scaler.pkl"))

    # =============================
    # FEATURE EXTRACTION (IMPORTANT)
    # =============================
    def extract_features(self, file_content: bytes):
        file_size = len(file_content)

        byte_freq = Counter(file_content)
        byte_counts = [byte_freq.get(i, 0) for i in range(256)]

        # entropy
        entropy = 0
        if file_size > 0:
            for count in byte_counts:
                if count > 0:
                    p = count / file_size
                    entropy -= p * np.log2(p)

        features = []

        features.append(file_size % 1000)
        features.append(int(entropy * 3 / 8))
        features.append(byte_freq.get(0, 0))
        features.append(20)
        features.append(len(byte_freq))
        features.append(int(entropy * 100))
        features.append(file_size // 10000 + 1)
        features.append((file_size // 1024) % 100)
        features.append(file_size)
        features.append(int(file_size * 0.3))
        features.append(int(file_size * 0.2))
        features.append(int(file_size * 0.5))
        features.append(file_size)
        features.append(max(byte_counts) if byte_counts else 0)
        features.append(sum(1 for i in range(len(file_content)-1) if file_content[i] != file_content[i+1]))
        features.append(int(entropy * 1000))
        features.append(sum(1 for b in file_content if b != 0))
        features.append(sum(1 for b in file_content if b == 0))
        features.append(len(set(file_content)))
        features.append(hash(file_content) % 100000)
        features.append(int(entropy * 10000))
        features.append((file_size + entropy * 1000) % 100000)

        features = features[:22]
        while len(features) < 22:
            features.append(0)

        return features

    # =============================
    # PREDICT FROM FILE
    # =============================
    def predict_from_file(self, file_content: bytes):
        features = self.extract_features(file_content)

        file_size = len(file_content)

        # Simple heuristic: if file is very small, likely benign
        if file_size < 100:
            return {
                "prediction": 0,  # Benign
                "confidence": 0.9
            }

        features = np.array([features])

        scaled = self.scaler.transform(features)

        # predict class
        prediction = self.model.predict(scaled)[0]

        # predict probability
        probabilities = self.model.predict_proba(scaled)[0]

        confidence = probabilities[prediction]

        # If confidence is low, classify as benign
        if confidence < 0.6:
            prediction = 0
            confidence = 1 - confidence

        return {
            "prediction": int(prediction),
            "confidence": float(confidence)
        }
    
    

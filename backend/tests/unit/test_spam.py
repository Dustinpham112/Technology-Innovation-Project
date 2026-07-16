from model import SpamModel

def test_spam_prediction():
    model = SpamModel()
    result = model.predict("Free money now!!!")
    assert result in [0, 1]
from models import Movement, Product, Alert
from datetime import datetime, timedelta

def run_ai_checks(session, product_id):
    """
    Called whenever a movement occurs.
    Checks: anomaly, stock-out prediction, frequent adjustments.
    """

    product = session.query(Product).filter_by(id=product_id).first()
    if not product:
        return
    
    # Placeholder functions (we will fill later)
    detect_anomaly(session, product)
    predict_stockout(session, product)
    detect_frequent_adjustments(session, product)

def detect_anomaly(session, product):
    pass

def predict_stockout(session, product):
    pass

def detect_frequent_adjustments(session, product):
    pass

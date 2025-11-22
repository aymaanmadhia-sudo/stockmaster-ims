from flask import Flask, render_template, request,jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Product, Movement, Alert
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Backend Running Successfully!"
    

@app.route('/api', methods=['POST'])
def api():
    data = request.get_json()
    print("Data received from frontend:", data)

    return jsonify({"message": "Backend received your data!"})


if __name__ == '__main__':
    app.run(debug=True)
app = Flask(__name__)
CORS(app)

# Database setup
engine = create_engine("sqlite:///database.db")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


# ---------------------- AUTH ----------------------
@app.post("/signup")
def signup():
    data = request.json
    session = Session()
    if session.query(User).filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(data["password"])
    )
    session.add(user)
    session.commit()
    return jsonify({"message": "User created"})


@app.post("/login")
def login():
    data = request.json
    session = Session()
    user = session.query(User).filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 400
    return jsonify({"message": "Login success", "user_id": user.id})


# ---------------------- PRODUCTS ----------------------
@app.post("/product/add")
def add_product():
    data = request.json
    session = Session()
    product = Product(
        name=data["name"],
        sku=data["sku"],
        category=data["category"],
        unit=data["unit"],
        current_stock=data.get("initial_stock", 0),
        min_stock_level=data.get("min_stock", 5)
    )
    session.add(product)
    session.commit()
    return jsonify({"message": "Product added"})


@app.get("/product/all")
def get_products():
    session = Session()
    products = session.query(Product).all()
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "category": p.category,
            "unit": p.unit,
            "current_stock": p.current_stock
        })
    return jsonify(result)


# ---------------------- MOVEMENTS ----------------------
@app.post("/movement/add")
def add_movement():
    data = request.json
    session = Session()

    product = session.query(Product).filter_by(id=data["product_id"]).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    m = Movement(
        product_id=data["product_id"],
        type=data["type"],
        quantity=data["quantity"],
        reason=data.get("reason")
    )
    session.add(m)

    # update stock according to movement type
    if data["type"] == "RECEIPT":
        product.current_stock += data["quantity"]
    elif data["type"] == "DELIVERY":
        product.current_stock -= data["quantity"]
    elif data["type"] == "ADJUSTMENT":
        product.current_stock -= data["quantity"]

    session.commit()

    # AI logic trigger
    run_ai_checks(session, product.id)
    session.commit()

    return jsonify({"message": "Movement added"})


# ---------------------- ALERTS ----------------------
@app.get("/alerts")
def get_alerts():
    session = Session()
    alerts = session.query(Alert).order_by(Alert.created_at.desc()).all()
    result = []
    for a in alerts:
        result.append({
            "id": a.id,
            "product_id": a.product_id,
            "type": a.alert_type,
            "message": a.message,
            "severity": a.severity,
            "created_at": str(a.created_at)
        })
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)





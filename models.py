from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)  # hashed

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    sku = Column(String)
    category = Column(String)
    unit = Column(String)
    current_stock = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=5)
    movements = relationship("Movement", back_populates="product")

class Movement(Base):
    __tablename__ = "movements"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    type = Column(String)  # RECEIPT / DELIVERY / ADJUSTMENT
    quantity = Column(Float)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="movements")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    alert_type = Column(String)
    message = Column(String)
    severity = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

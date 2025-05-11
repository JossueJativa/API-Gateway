from utils.database import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class City(db.Model):
    __tablename__ = 'cities'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    weather = relationship('Weather', back_populates='city')
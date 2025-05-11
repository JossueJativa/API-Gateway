from utils.database import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Weather(db.Model):
    __tablename__ = 'weather'
    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, db.ForeignKey('cities.id'), nullable=False)
    date = Column(String(10), nullable=False)
    temperature = Column(Integer, nullable=False)
    humidity = Column(Integer, nullable=False)
    description = Column(String(100), nullable=False)
    city = relationship('City', back_populates='weather')
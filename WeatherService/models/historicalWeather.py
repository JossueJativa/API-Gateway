from utils.database import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class HistoricalWeather(db.Model):
    __tablename__ = 'historical_weather'
    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, db.ForeignKey('cities.id'), nullable=False)
    date = Column(String(10), nullable=False)
    temperature = Column(Integer, nullable=False)
    humidity = Column(Integer, nullable=False)
    description = Column(String(100), nullable=False)
    city = relationship('City')
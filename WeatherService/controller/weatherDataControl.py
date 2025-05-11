from flask import Blueprint, jsonify, request
from utils.database import db
from models.weather import Weather
from models.city import City
from models.historicalWeather import HistoricalWeather

weather_data_blueprint = Blueprint('weather', __name__)

@weather_data_blueprint.route('/weather', methods=['GET'])
def get_weather_data():
    """Get a list of weather data with limit and offset."""
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    weather_data_list = Weather.query.limit(limit).offset(offset).all()
    result = [
        {
            'id': data.id,
            'city_id': data.city_id,
            'date': data.date,
            'temperature': data.temperature,
            'humidity': data.humidity,
            'description': data.description
        }
        for data in weather_data_list
    ]

    return jsonify(result), 200

@weather_data_blueprint.route('/weather/<string:city>', methods=['GET'])
def get_weather_by_city(city):
    """Get weather data for a specific city."""
    city_data = City.query.filter_by(name=city).first()
    if not city_data:
        return jsonify({'message': 'City not found'}), 404

    weather_data_list = Weather.query.filter_by(city_id=city_data.id).all()
    result = [
        {
            'id': data.id,
            'date': data.date,
            'temperature': data.temperature,
            'humidity': data.humidity,
            'description': data.description
        }
        for data in weather_data_list
    ]

    return jsonify(result), 200

@weather_data_blueprint.route('/weather', methods=['POST'])
def create_weather_data():
    """Create a new weather data entry and save it to historical records."""
    data = request.get_json()
    if not data or not all(key in data for key in ('city_id', 'date', 'temperature', 'humidity', 'description')):
        return jsonify({'message': 'Invalid input'}), 400

    # Create new weather data
    new_weather_data = Weather(
        city_id=data['city_id'],
        date=data['date'],
        temperature=data['temperature'],
        humidity=data['humidity'],
        description=data['description']
    )
    db.session.add(new_weather_data)

    # Save to historical records
    historical_weather = HistoricalWeather(
        city_id=data['city_id'],
        date=data['date'],
        temperature=data['temperature'],
        humidity=data['humidity'],
        description=data['description']
    )
    db.session.add(historical_weather)

    db.session.commit()

    return jsonify({
        'id': new_weather_data.id,
        'city_id': new_weather_data.city_id,
        'date': new_weather_data.date,
        'temperature': new_weather_data.temperature,
        'humidity': new_weather_data.humidity,
        'description': new_weather_data.description
    }), 201

@weather_data_blueprint.route('/weather/<int:data_id>', methods=['PUT'])
def update_weather_data(data_id):
    """Update a weather data entry and save changes to historical records."""
    weather_data = Weather.query.get(data_id)
    if not weather_data:
        return jsonify({'message': 'Weather data not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    # Update weather data
    weather_data.date = data.get('date', weather_data.date)
    weather_data.temperature = data.get('temperature', weather_data.temperature)
    weather_data.humidity = data.get('humidity', weather_data.humidity)
    weather_data.description = data.get('description', weather_data.description)

    # Save updated data to historical records
    historical_weather = HistoricalWeather(
        city_id=weather_data.city_id,
        date=weather_data.date,
        temperature=weather_data.temperature,
        humidity=weather_data.humidity,
        description=weather_data.description
    )
    db.session.add(historical_weather)

    db.session.commit()

    return jsonify({
        'id': weather_data.id,
        'city_id': weather_data.city_id,
        'date': weather_data.date,
        'temperature': weather_data.temperature,
        'humidity': weather_data.humidity,
        'description': weather_data.description
    }), 200

@weather_data_blueprint.route('/weather/<int:data_id>', methods=['DELETE'])
def delete_weather_data(data_id):
    """Delete a weather data entry and save deletion to historical records."""
    weather_data = Weather.query.get(data_id)
    if not weather_data:
        return jsonify({'message': 'Weather data not found'}), 404

    # Save deletion to historical records
    historical_weather = HistoricalWeather(
        city_id=weather_data.city_id,
        date=weather_data.date,
        temperature=weather_data.temperature,
        humidity=weather_data.humidity,
        description=f"Deleted: {weather_data.description}"
    )
    db.session.add(historical_weather)

    db.session.delete(weather_data)
    db.session.commit()

    return jsonify({'message': 'Weather data deleted successfully'}), 200

@weather_data_blueprint.route('/weather/forecast', methods=['GET'])
def get_forecast_general():
    """Get general forecast for all cities with a maximum of 5 records per city."""
    limit = request.args.get('limit', default=5, type=int)

    # Group by city and limit to 5 records per city
    cities = City.query.all()
    result = []
    for city in cities:
        weather_data_list = Weather.query.filter_by(city_id=city.id).limit(limit).all()
        if weather_data_list:
            result.append({
                'city': city.name,
                'records': [
                    {
                        'date': data.date,
                        'temperature': data.temperature,
                        'humidity': data.humidity,
                        'description': data.description
                    }
                    for data in weather_data_list
                ]
            })

    return jsonify(result), 200

@weather_data_blueprint.route('/weather/forecast/<string:city_name>', methods=['GET'])
def get_forecast_by_city(city_name):
    """Get forecast for a specific city with limit and offset."""
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    city = City.query.filter_by(name=city_name).first()
    if not city:
        return jsonify({'message': 'City not found'}), 404

    weather_data_list = Weather.query.filter_by(city_id=city.id).limit(limit).offset(offset).all()
    result = {
        'city': city.name,
        'records': [
            {
                'date': data.date,
                'temperature': data.temperature,
                'humidity': data.humidity,
                'description': data.description
            }
            for data in weather_data_list
        ]
    }

    return jsonify(result), 200

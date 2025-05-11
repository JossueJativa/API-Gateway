from flask import Blueprint, jsonify, request
from utils.database import db
from models.city import City

city_blueprint = Blueprint('city', __name__)

@city_blueprint.route('/cities', methods=['GET'])
def get_cities():
    """Get a list of cities with limit and offset."""
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    cities = City.query.limit(limit).offset(offset).all()
    city_list = [{'id': city.id, 'name': city.name} for city in cities]

    return jsonify(city_list), 200

@city_blueprint.route('/cities', methods=['POST'])
def create_city():
    """Create a new city."""
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'message': 'Invalid input'}), 400

    new_city = City(name=data['name'])
    db.session.add(new_city)
    db.session.commit()

    return jsonify({'id': new_city.id, 'name': new_city.name}), 201

@city_blueprint.route('/cities/<int:city_id>', methods=['DELETE'])
def delete_city(city_id):
    """Delete a city by ID."""
    city = City.query.get(city_id)
    if not city:
        return jsonify({'message': 'City not found'}), 404

    db.session.delete(city)
    db.session.commit()

    return jsonify({'message': 'City deleted successfully'}), 200

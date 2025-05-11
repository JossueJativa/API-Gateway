from flask import Flask
from utils.database import db
import os

from controller.cityControl import city_blueprint
from controller.weatherDataControl import weather_data_blueprint
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)

__basedir__ = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///' + os.path.join(__basedir__, 'weather.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'a_default_secret_key_for_development')

db.init_app(app)

app.register_blueprint(city_blueprint, url_prefix='/api')
app.register_blueprint(weather_data_blueprint, url_prefix='/api')

# Swagger configuration
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Weather Service API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=8082)
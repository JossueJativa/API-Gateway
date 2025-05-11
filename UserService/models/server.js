const express = require('express');
const cors = require('cors');

// Import Swagger dependencies
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Gateway Documentation',
        },
        servers: [
            {
                url: 'http://localhost:8081',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID del usuario',
                        },
                        username: {
                            type: 'string',
                            description: 'Nombre de usuario',
                        },
                        email: {
                            type: 'string',
                            description: 'Correo electrónico del usuario',
                        },
                        status: {
                            type: 'boolean',
                            description: 'Estado del usuario',
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

class Server {
    constructor() {
        this.user_path = '/api/users';
        this.auth_path = '/api/auth';

        this.app = express();

        this.port = process.env.PORT || 8081;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        // Configure CORS to allow all origins
        this.app.use(cors({
            origin: '*', // Permitir todas las solicitudes de origen
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));

        this.app.use(express.json());

        // Add Swagger middleware
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }

    routes() {
        this.app.use(
            this.user_path,
            require('../routes/user.routes')
        )
        this.app.use(
            this.auth_path,
            require('../routes/auth.routes')
        )
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = Server;
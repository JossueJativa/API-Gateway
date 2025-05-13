const { Router } = require('express');
const { check } = require('express-validator');
const { login, logout } = require('../controller/auth.controller');
const { validateCampus } = require('../middlewares/checkcampus');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints relacionados con la autenticación
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en la aplicación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *       400:
 *         description: Credenciales inválidas
 */
router.post(
    '/login',
    [
        check('email', 'Email is required').notEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('password', 'Password is required').notEmpty(),
        validateCampus
    ],
    login
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión en la aplicación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT a revocar
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 *       400:
 *         description: Token no proporcionado o inválido
 */
router.post(
    '/logout',
    [
        check('token', 'Token is required').notEmpty(),
        validateCampus
    ],
    logout
);

module.exports = router;
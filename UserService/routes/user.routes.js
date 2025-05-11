const { Router } = require('express');
const { check } = require('express-validator');
const {
    userGet,
    userGetById,
    userPost,
    userPut,
    userDelete
} = require('../controller/user.controller');
const { validateFieldExists } = require('../helpers/controller_validator');
const { validateCampus } = require('../middlewares/checkcampus');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados con los usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de usuarios a obtener
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Desplazamiento de los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', userGet);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
    '/:id',
    [
        check('id', 'ID is not valid').isNumeric(),
        check('id').custom(async (id) => {
            const user = await validateFieldExists('id', id);
            if (!user) {
                throw new Error(`User with ID ${id} does not exist`);
            }
        }),
        validateCampus,
    ],
    userGetById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la creación del usuario
 */
router.post(
    '/',
    [
        check('username', 'Username is required').notEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('email').custom(async (email) => {
            const user = await validateFieldExists('email', email);
            if (user) {
                throw new Error(`Email ${email} already exists`);
            }
        }),
        check('username').custom(async (username) => {
            const user = await validateFieldExists('username', username);
            if (user) {
                throw new Error(`Username ${username} already exists`);
            }
        }),
        check('password', 'Password must be at least 12 characters').isLength({ min: 6 }),
        validateCampus,
    ],
    userPost
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en la actualización del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
    '/:id',
    [
        check('id', 'ID is not valid').isNumeric(),
        check('id').custom(async (id) => {
            const user = await validateFieldExists('id', id);
            if (!user) {
                throw new Error(`User with ID ${id} does not exist`);
            }
        }),
        check('username', 'Username is required').notEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('email').custom(async (email, { req }) => {
            const user = await validateFieldExists('email', email, req.params.id);
            if (user) {
                throw new Error(`Email ${email} already exists`);
            }
        }),
        check('username').custom(async (username, { req }) => {
            const user = await validateFieldExists('username', username, req.params.id);
            if (user) {
                throw new Error(`Username ${username} already exists`);
            }
        }),
        validateCampus,
    ],
    userPut
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
    '/:id',
    [
        check('id', 'ID is not valid').isNumeric(),
        check('id').custom(async (id) => {
            const user = await validateFieldExists('id', id);
            if (!user) {
                throw new Error(`User with ID ${id} does not exist`);
            }
        }),
        validateCampus,
    ],
    userDelete
);

module.exports = router;
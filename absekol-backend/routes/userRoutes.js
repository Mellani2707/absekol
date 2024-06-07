const express = require('express');
const {creatUserController,deleteUserController,getUserController,updateUserController,}=require('../controllers/userController')

const route = express.Router();


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the database with the provided details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user10@mail.com
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: user1
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Loremipsum
 *               noWa:
 *                 type: string
 *                 description: The user's WhatsApp number
 *                 example: 083182647716
 *               roleId:
 *                 type: integer
 *                 description: The role ID assigned to the user
 *                 example: 2
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                   description: The user ID
 *                   example: 1
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                   example: user10@mail.com
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                   example: user1
 *                 noWa:
 *                   type: string
 *                   description: The user's WhatsApp number
 *                   example: 083182647716
 *                 roleId:
 *                   type: integer
 *                   description: The role ID assigned to the user
 *                   example: 2
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user
 *                   example: 2024-05-22T14:48:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user
 *                   example: 2024-05-22T14:48:00.000Z
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid input data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "An error occurred while creating the user"
 */

route.post('/users', creatUserController);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database. This can be used to populate a list of users for management or display purposes.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: integer
 *                     description: The user ID
 *                     example: 1
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                     example: johndoe@example.com
 *                   emailVerifiedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user's email was verified
 *                     example: 2021-05-05T14:48:00.000Z
 *                   password:
 *                     type: string
 *                     description: The user's password (hashed)
 *                     example: $2b$10$K7QeK3sL2T9jlXziJ1G/5e
 *                   nisn:
 *                     type: string
 *                     description: The user's NISN
 *                     example: 1234567890
 *                   token:
 *                     type: integer
 *                     description: The user's token
 *                     example: 1234
 *                   noWa:
 *                     type: string
 *                     description: The user's WhatsApp number
 *                     example: +628123456789
 *                   roleId:
 *                     type: integer
 *                     description: The role ID assigned to the user
 *                     example: 2
 *                   tokenEpired:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user's token expires
 *                     example: 2021-05-05T14:48:00.000Z
 */
route.get('/users', getUserController);
/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update an existing user
 *     description: Update the details of an existing user with the provided data.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: integer
 *                 description: The user ID
 *                 example: 1
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user8@mail.com
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: rahmatnur89
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Loremipsum
 *               nisn:
 *                 type: string
 *                 description: The user's NISN
 *                 example: 1720001
 *               noWa:
 *                 type: string
 *                 description: The user's WhatsApp number
 *                 example: 083182647716
 *               roleId:
 *                 type: integer
 *                 description: The role ID assigned to the user
 *                 example: 2
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                   description: The user ID
 *                   example: 1
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                   example: user8@mail.com
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                   example: rahmatnur89
 *                 nisn:
 *                   type: string
 *                   description: The user's NISN
 *                   example: 1720001
 *                 noWa:
 *                   type: string
 *                   description: The user's WhatsApp number
 *                   example: 083182647716
 *                 roleId:
 *                   type: integer
 *                   description: The role ID assigned to the user
 *                   example: 2
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user
 *                   example: 2024-05-22T14:48:00.000Z
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid input data"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "An error occurred while updating the user"
 */
route.put('/users',updateUserController);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "An error occurred while deleting the user"
 */
route.delete('/users/:uid', deleteUserController);


module.exports=route;
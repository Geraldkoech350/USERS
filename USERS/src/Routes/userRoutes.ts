import express from 'express';
const router = express.Router();

import { createUser, getUser, getUsers, updateUser, deleteUser, loginUser, homepage } from '../controller/userContoller';
import { permit } from '../Middleware/permit';
import { VerifyToken } from '../Middleware/verify';

router.post('/add', createUser)

router.post('/login', loginUser)

router.get('/', getUsers)

router.get('/home', VerifyToken, permit, homepage)

router.get('/:id', getUser)

router.patch('/:id', updateUser)

router.delete('/:id',VerifyToken, deleteUser)

export default router;
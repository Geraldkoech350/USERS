"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userContoller_1 = require("../controller/userContoller");
const permit_1 = require("../Middleware/permit");
const verify_1 = require("../Middleware/verify");
router.post('/add', userContoller_1.createUser);
router.post('/login', userContoller_1.loginUser);
router.get('/', userContoller_1.getUsers);
router.get('/home', verify_1.VerifyToken, permit_1.permit, userContoller_1.homepage);
router.get('/:id', userContoller_1.getUser);
router.patch('/:id', userContoller_1.updateUser);
router.delete('/:id', verify_1.VerifyToken, userContoller_1.deleteUser);
exports.default = router;

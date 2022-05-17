"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homepage = exports.loginUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const RegisterValidator_1 = require("../Helpers/RegisterValidator");
const LoginValidator_1 = require("../Helpers/LoginValidator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v1)();
        const { username, fullname, email, age, password, role } = req.body;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { error } = RegisterValidator_1.Registerschema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const PasswordHash = yield bcrypt_1.default.hash(password, 10);
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('username', mssql_1.default.VarChar, username)
            .input('fullname', mssql_1.default.VarChar, fullname)
            .input('email', mssql_1.default.VarChar, email)
            .input('age', mssql_1.default.VarChar, age)
            .input('password', mssql_1.default.VarChar, PasswordHash)
            .input('role', mssql_1.default.VarChar, role)
            .execute('insertUser');
        res.json({ message: 'User created successfully' });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createUser = createUser;
const getUsers = (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const users = yield pool.request().execute('getUsers');
        res.json(users.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUser');
        if (!user.recordset[0]) {
            return res.json({ message: `user with id : ${id} Does not exist` });
        }
        return res.json(user.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { username, fullname, email, age, password, role } = req.body;
        const user = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUser');
        if (!user.recordset[0]) {
            return res.json({ message: `user with id : ${id} Does not exist` });
        }
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('username', mssql_1.default.VarChar, username)
            .input('fullname', mssql_1.default.VarChar, fullname)
            .input('email', mssql_1.default.VarChar, email)
            .input('age', mssql_1.default.VarChar, age)
            .input('password', mssql_1.default.VarChar, password)
            .input('role', mssql_1.default.VarChar, role)
            .execute('updateUser');
        res.json({ message: "User updated successfully" });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .execute("getUser");
        if (!user.recordset[0]) {
            return res.json({
                message: `user not availabe: ${id}`
            });
        }
        yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .execute("deleteUser");
        res.status(200).json({
            message: "deleted successufuly"
        });
    }
    catch (error) {
        error.error.message;
    }
});
exports.deleteUser = deleteUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const { email, password } = req.body;
        const { error } = LoginValidator_1.Loginschema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const user = yield pool.request().query(`SELECT username, fullname, email, age, password, role FROM Users
            WHERE email= '${email}'
            `);
        if (!user.recordset[0]) {
            return res.json({ message: `Incorrect credentials` });
        }
        const validpassword = yield bcrypt_1.default.compare(password, user.recordset[0].password);
        if (!validpassword) {
            return res.json({ message: `Incorrect credentials` });
        }
        const data = user.recordset.map(record => {
            const { password } = record, rest = __rest(record, ["password"]);
            return rest;
        });
        let payload = yield pool.request().query(`SELECT username, fullname, email, age, role FROM Users
            WHERE email= '${email}'
            `);
        payload = payload.recordset[0];
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '30m' });
        res.json({ message: "Login Sucess",
            data, token });
    }
    catch (error) {
        res.json(error.message);
    }
});
exports.loginUser = loginUser;
const homepage = (req, res) => {
    res.json({ message: 'Hello Gerald welcome..' });
};
exports.homepage = homepage;

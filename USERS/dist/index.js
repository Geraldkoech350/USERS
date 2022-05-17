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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const mssql_1 = __importDefault(require("mssql"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', userRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello from express and typescript');
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on PORT ${port}`));
// CHECKING SQL CONNECTION
const checkConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const x = yield mssql_1.default.connect(config_1.default);
        if (x.connected) {
            console.log('Database connected');
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
checkConnection();

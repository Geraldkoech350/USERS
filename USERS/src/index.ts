import express from "express";
import sqlConfig from "./config/config";
import mssql from 'mssql';
import router from "./Routes/userRoutes";

const app = express();

app.use(express.json());

app.use('/user', router)

app.get('/', (req, res)=>{
    res.send('Hello from express and typescript');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));

// CHECKING SQL CONNECTION

const checkConnection = async () => {
    try {
        const x = await mssql.connect(sqlConfig)
        if(x.connected) {
            console.log('Database connected');
               
        }
        
    } catch (err: any) {
        console.log(err.message);
    }
}

checkConnection()
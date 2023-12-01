// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import {AppDataSource} from "./dataSource";
import  express, { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import {router} from "./routes/user";
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.get("/", async(_:Request, res:Response)=> {
    res.send("welcome to the home page");
});
app.use(router);

app.listen(3000,()=> {
    console.log("server has been started at port 3000...");
});

AppDataSource.initialize().then(()=> {
    console.log("connected to the database");
}).catch((error)=> {
    console.log(error);
    throw new Error("unable to connect to the database");
});





















































































































































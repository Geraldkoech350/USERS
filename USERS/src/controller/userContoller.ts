import { Request, Response, RequestHandler } from "express";

import { v1 as uid } from 'uuid';
import mssql from 'mssql';
import sqlConfig from "../config/config";
import bcrypt from 'bcrypt';
import { Registerschema } from "../Helpers/RegisterValidator";
import { Loginschema } from "../Helpers/LoginValidator";
import jwt from 'jsonwebtoken';
import { options } from "joi";
import dotenv from 'dotenv';
dotenv.config();

export const createUser: RequestHandler = async (req, res)=>{
    try {
        const id = uid()
        const{username, fullname, email, age, password, role} = req.body as {username: string, fullname: string, email: string,  age: number, password: string, role: string}
        let pool = await mssql.connect(sqlConfig)
        const {error} = Registerschema.validate(req.body)
        if(error){
            return res.json({error:error.details[0].message})
        }

        const PasswordHash = await bcrypt.hash(password, 10)

        await pool.request()
        .input('id', mssql.VarChar, id)
        .input('username', mssql.VarChar, username)
        .input('fullname', mssql.VarChar, fullname)
        .input('email', mssql.VarChar, email)
        .input('age', mssql.VarChar, age)
        .input('password', mssql.VarChar, PasswordHash)
        .input('role', mssql.VarChar, role)
        .execute('insertUser')

        res.json({message: 'User created successfully'})
    } catch (error: any) {
        res.json({error: error.message})
    }
}


export const getUsers: RequestHandler = async(_req, res, _next) => {
    try {
        let pool = await mssql.connect(sqlConfig)
        const users = await pool.request().execute('getUsers')
            res.json(users.recordset)
    } catch (error: any) {
       res.json({error:error.message}) 
    }
    
}


export const getUser: RequestHandler<{id: string}>= async(req, res)=>{
    try {
        const id = req.params.id 
        let pool = await mssql.connect(sqlConfig)
        const user = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getUser')

            if(!user.recordset[0]){
                return res.json({message: `user with id : ${id} Does not exist`})
            }
            return res.json(user.recordset)
    } catch (error:any) {
        res.json({error:error.message})
    }
}



export const updateUser: RequestHandler<{id: string}> = async(req, res)=>{
    try {
        const id = req.params.id 
        let pool = await mssql.connect(sqlConfig)
        const{username, fullname, email, age, password, role} = req.body as {username: string, fullname: string, email: string,  age: number, password: string, role: string}
        const user = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getUser')
        if(!user.recordset[0]){
        return res.json({message: `user with id : ${id} Does not exist`})
    }

        await pool.request()
        .input('id', mssql.VarChar, id)
        .input('username', mssql.VarChar, username)
        .input('fullname', mssql.VarChar, fullname)
        .input('email', mssql.VarChar, email)
        .input('age', mssql.VarChar, age)
        .input('password', mssql.VarChar, password)
        .input('role', mssql.VarChar, role)
        .execute('updateUser')

        res.json({message: "User updated successfully"})
    } catch (error: any) {
        res.json({error: error.message})
    }
}

interface RequestExtended extends Request{
    users?: any
}
export const deleteUser = async (req: RequestExtended, res:Response)=>{
    try {
        const id = req.params.id;
        let pool = await mssql.connect(sqlConfig)
        const user = await pool 
        .request()
        .input("id", mssql.VarChar, id)
        .execute("getUser")
        if(!user.recordset[0]) {
            return res.json({
                message: `user not availabe: ${id}`
            })
        }
        await pool
        .request()
        .input("id", mssql.VarChar, id)
        .execute("deleteUser")
        res.status(200).json({
            message: "deleted successufuly"
        })
    } catch(error:any) {
        error.error.message
    }
}


export const loginUser: RequestHandler = async (req, res)=>{
    try {
        let pool = await mssql.connect(sqlConfig)
        const{email, password} = req.body as {email: string, password: string}

        const {error} = Loginschema.validate(req.body)
        if(error){
            return res.json({error:error.details[0].message})
        }

        const user = await pool.request().query(
            `SELECT username, fullname, email, age, password, role FROM Users
            WHERE email= '${email}'
            `
        )
        if(!user.recordset[0]){
            return res.json({message: `Incorrect credentials`})
        }
        const validpassword = await bcrypt.compare(password, user.recordset[0].password)
        if(!validpassword){
            return res.json({message: `Incorrect credentials`})
        }
        const data = user.recordset.map(record=>{
            const{password, ...rest} = record
            return rest
        })

        let payload = await pool.request().query(
            `SELECT username, fullname, email, age, role FROM Users
            WHERE email= '${email}'
            `
        )

        payload = payload.recordset[0]

        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn:'30m'})
        res.json({message: "Login Sucess",
            data, token})
    } catch (error:any) {
        res.json(error.message)
    }
}

export const homepage: RequestHandler = (req, res)=>{
    res.json({message: 'Hello Gerald welcome..'})
}






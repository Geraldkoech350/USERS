import { RequestHandler } from "express";

export const permit: RequestHandler = (req, res, next)=>{
const token = req.headers['token']

if(!token){
    return res.json({error: 'Not permitted to access this route, no token found'})
}
if(token!=='secret'){
    return res.json({error: 'Invalid token'})
}
next()
}
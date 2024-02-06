import zod from "zod";
import bcrypt from "bcrypt"
import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
const prisma = new PrismaClient();

const registerSchema = zod.object({
    email: zod.string(),
    firstName: zod.string(),
    lastName : zod.string(),
    password : zod.string()
  });

const loginSchema = zod.object({
    email :  zod.string(),
    password : zod.string()
})
const createUser = async (req : Request , res : Response) => {
    try {
        const {email , firstName , lastName , password} = req.body;
        const registerPayload = req.body;
        const parsePayload = registerSchema.safeParse(registerPayload)
        if(!parsePayload.success) {
            res.status(411).json({
                success : false,
                message : "Invalid inputs"
            })
          } 
        if(!email || !password || !firstName || !lastName) {
          return  res.status(411).json({
                success : false,
                message : "Please fill all the details"
            })
        }
        const existingUser =  await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(existingUser) {
            return  res.status(404).json({
                success : false,
                message : "User already exist !"
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const create = await prisma.user.create({
            data : {
                firstName,
                lastName,
                email,
                profilePic : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
                password : hashedPassword
            }
        })
        if(create) {
        return res.status(200).json({
                success : true,
                message : "User created successfully"
            })
        }
    } catch (error) {
        console.log(error , "error");
        return res.status(400).json({
            success : false,
            message : "Something went wrong !"
        })
        
    }
}

const getAllUsers = async (req : Request , res : Response) => {
    try {
        const users = await prisma.user.findMany({
            include : {
               todos : true
            }
           })
        return res.status(200).json({
            success : true,
            users
        })
    } catch (error) {
        console.log(error , "error");
        return res.status(400).json({
            success : false,
            message : "Something went wrong !"
        })
    }
}

const signin = async (req : Request , res : Response) => {
    try {
        const {email , password} = req.body;
        const loginPayload = req.body;
        const parsePayload = loginSchema.safeParse(loginPayload)
        console.log(parsePayload , "payo=l")
        if(!parsePayload.success) {
            res.status(411).json({
                success : false,
                message : "Invalid inputss"
            })
          } 

          if(!email || !password ) {
            return  res.status(411).json({
                  success : false,
                  message : "Please fill all the details"
              })
          }
          const existingUser =  await prisma.user.findUnique({
              where : {
                  email : email
              }
          })
          if(!existingUser) {
              return  res.status(404).json({
                  success : false,
                  message : "User does not exist , kindly signup !"
              })
          }
          const paylod = {
            id : existingUser.id,
            email : existingUser.email,
            firstName : existingUser.firstName,
            lastName : existingUser.lastName
          }
        
          if(await bcrypt.compare(password , existingUser.password)) {
            const token = await jwt.sign(paylod , "secret")
            return res.status(200).json({
                success : true,
                message : "User logged in successfully !",
                user : existingUser,
                token
            })
          } else {
            return res.status(400).json({
                success : false,
                message : "Incorrect password !"
            })
          }
          

    } catch (error) {
        console.log(error , "error");
        return res.status(400).json({
            success : false,
            message : "Something went wrong !"
        })
    }
}

const deleteUser = async (req : Request , res : Response) => {
    const { userId } = req.body;
    try {
        const delteUser = await prisma.user.delete({
            where : {
                id : userId
            }   
        }) 
        return res.status(200).json({
            success : true,
            message : "User deleted successfully !",
            deleteUser
        })
    } catch (error) {

    }
}

const getUserById = async (req : Request , res : Response) => {
    try {
        const { userId } = req.params;

        
        const user = await prisma.user.findMany({
            where : {
                id : parseInt(userId)
            },
            include : {
               todos : true
            }
           })
        return res.status(200).json({
            success : true,
            user
        })
    } catch (error) {
        console.log(error , "error");
        return res.status(400).json({
            success : false,
            message : "Something went wrong !"
        })
    }
}

module.exports = {
    createUser,
    getAllUsers,
    signin,
    deleteUser,
    getUserById
};

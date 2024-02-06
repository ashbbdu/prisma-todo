
import zod from "zod";
import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createTodoSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
  });

const updateTodoSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    done : zod.boolean()
})

const createTodo = async (req : Request , res : Response) => {
    try {
        const { id } = req.body.user;
        const {title , description} = req.body;
        console.log(req , "request");
        
        const createTodoPayload = req.body;
        const parsePayload = createTodoSchema.safeParse(createTodoPayload)
        if(!parsePayload.success) {
            res.status(411).json({
                success : false,
                message : "Invalid inputs"
            })
          } 
        if(!title || !description) {
          return  res.status(411).json({
                success : false,
                message : "Please fill all the details"
            })
        }

        const create = await prisma.todos.create({
            data : {
                userId : id,
                title ,
                description 
            }
        })
        if(create) {
        return res.status(200).json({
                success : true,
                message : "Todo created successfully"
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

const updateTodo = async (req : Request , res : Response) => {
    try {
        const { todoId } = req.body;
        const { id } = req.body.user;
        const {title , description , done} = req.body;
        const updateTodoPayload = req.body;
        const parsePayload = updateTodoSchema.safeParse(updateTodoPayload)
        if(!parsePayload.success) {
            res.status(411).json({
                success : false,
                message : "Invalid inputs"
            })
          } 
        if(!title || !description || !done) {
          return  res.status(411).json({
                success : false,
                message : "Please fill all the details"
            })
        }
        const update = await prisma.todos.update({
            where : {
                id : parseInt(todoId) ,
                userId : id
            },
            data : {
                title,
                description,
                done
            }
        })
    return res.status(200).json({
        success : true,
        message : "Todo update successfully !",
        update
    })
        
    } catch (error) {
        console.log(error , "error");
        return res.status(400).json({
            success : false,
            message : "Something went wrong !"
        })
    }
}

const deleteTodo = async (req : Request , res : Response) =>  {
    try {
        const {id} = req.body.user
        const { todoId } = req.body;
        const deleteTodo = await prisma.todos.delete({
            where : {
                userId : id,
                id : todoId
            }
        })
        if(deleteTodo) {
          return  res.status(200).json({
            success : true,
            message : "Todo Deleted Successfully"
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

const getAllTodos = async (req : Request , res : Response) => {
    try {
        const { id } = req.body.user;
        const todos = await prisma.todos.findMany({
            where : {
                userId : id,
            }
        })
        if(todos) {
            return res.status(200).json({
                success : true,
                message : "Todos fetched successfully !",
                todos
            })
        } else {
            return res.status(401).json({
                success : false,
                message : "Unable to fetch todos!",
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




module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    getAllTodos
}
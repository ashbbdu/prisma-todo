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
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTodoSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
});
const updateTodoSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    done: zod_1.default.boolean()
});
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const { title, description } = req.body;
        console.log(req, "request");
        const createTodoPayload = req.body;
        const parsePayload = createTodoSchema.safeParse(createTodoPayload);
        if (!parsePayload.success) {
            res.status(411).json({
                success: false,
                message: "Invalid inputs"
            });
        }
        if (!title || !description) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const create = yield prisma.todos.create({
            data: {
                userId: id,
                title,
                description
            }
        });
        if (create) {
            return res.status(200).json({
                success: true,
                message: "Todo created successfully"
            });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(400).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId } = req.body;
        const { id } = req.body.user;
        const { title, description, done } = req.body;
        const updateTodoPayload = req.body;
        const parsePayload = updateTodoSchema.safeParse(updateTodoPayload);
        if (!parsePayload.success) {
            res.status(411).json({
                success: false,
                message: "Invalid inputs"
            });
        }
        if (!title || !description || !done) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const update = yield prisma.todos.update({
            where: {
                id: parseInt(todoId),
                userId: id
            },
            data: {
                title,
                description,
                done
            }
        });
        return res.status(200).json({
            success: false,
            message: "Todo update successfully !",
            update
        });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(400).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const { todoId } = req.body;
        const deleteTodo = yield prisma.todos.delete({
            where: {
                userId: id,
                id: todoId
            }
        });
        if (deleteTodo) {
            return res.status(200).json({
                success: true,
                message: "Todo Deleted Successfully"
            });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(400).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
const getAllTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const todos = yield prisma.todos.findMany({
            where: {
                userId: id,
            }
        });
        if (todos) {
            return res.status(200).json({
                success: true,
                message: "Todos fetched successfully !",
                todos
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch todos!",
            });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(400).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    getAllTodos
};

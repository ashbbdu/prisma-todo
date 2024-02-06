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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const registerSchema = zod_1.default.object({
    email: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    password: zod_1.default.string()
});
const loginSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string()
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, password } = req.body;
        const registerPayload = req.body;
        const parsePayload = registerSchema.safeParse(registerPayload);
        if (!parsePayload.success) {
            res.status(411).json({
                success: false,
                message: "Invalid inputs"
            });
        }
        if (!email || !password || !firstName || !lastName) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(404).json({
                success: false,
                message: "User already exist !"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const create = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        });
        if (create) {
            return res.status(200).json({
                success: true,
                message: "User created successfully"
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: {
                todos: true
            }
        });
        return res.status(200).json({
            success: true,
            users
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
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loginPayload = req.body;
        const parsePayload = loginSchema.safeParse(loginPayload);
        console.log(parsePayload, "payo=l");
        if (!parsePayload.success) {
            res.status(411).json({
                success: false,
                message: "Invalid inputss"
            });
        }
        if (!email || !password) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User does not exist , kindly signup !"
            });
        }
        const paylod = {
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName
        };
        if (yield bcrypt_1.default.compare(password, existingUser.password)) {
            const token = yield jsonwebtoken_1.default.sign(paylod, "secret");
            return res.status(200).json({
                success: true,
                message: "User logged in successfully !",
                user: existingUser,
                token
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Incorrect password !"
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
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const delteUser = yield prisma.user.delete({
            where: {
                id: userId
            }
        });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully !",
            deleteUser
        });
    }
    catch (error) {
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma.user.findMany({
            where: {
                id: parseInt(userId)
            },
            include: {
                todos: true
            }
        });
        return res.status(200).json({
            success: true,
            user
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
module.exports = {
    createUser,
    getAllUsers,
    signin,
    deleteUser,
    getUserById
};

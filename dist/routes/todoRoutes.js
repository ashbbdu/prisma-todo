"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { createTodo, updateTodo, deleteTodo, getAllTodos } = require("../controllers/Todos");
const auth = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/create-todo", auth, createTodo);
router.put("/update-todo", auth, updateTodo);
router.delete("/delete-todo", auth, deleteTodo);
router.get("/todos", auth, getAllTodos);
module.exports = router;


import express from "express"
const { createTodo, updateTodo , deleteTodo , getAllTodos } = require("../controllers/Todos")
const auth = require("../middlewares/auth")

const router = express.Router();

router.post("/create-todo" , auth , createTodo)
router.put("/update-todo" , auth , updateTodo)
router.delete("/delete-todo" , auth , deleteTodo)
router.get("/todos" , auth , getAllTodos)


module.exports = router;
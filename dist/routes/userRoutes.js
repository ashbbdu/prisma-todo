"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { createUser, getAllUsers, signin, deleteUser, getUserById } = require("../controllers/User");
const auth = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/signup", createUser);
router.post("/signin", signin);
router.get("/users", auth, getAllUsers);
router.get("/user/:userId", auth, getUserById);
router.delete("/delete-user", auth, deleteUser);
module.exports = router;
// export {};

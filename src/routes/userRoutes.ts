import express from "express"
const { createUser , getAllUsers , signin , deleteUser , getUserById } = require("../controllers/User")
const auth = require("../middlewares/auth")

const router = express.Router();

router.post("/signup" , createUser )
router.post("/signin" , signin )
router.get("/users" , auth , getAllUsers)
router.get("/user/:userId" , auth , getUserById )
router.delete("/delete-user" , auth , deleteUser)


module.exports = router;


// export {};
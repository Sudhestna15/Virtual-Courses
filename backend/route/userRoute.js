import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile } from "../controllers/userController.js"
import upload from "../middleware/multer.js"

const userRouter= express.Router()

userRouter.get("/getcurrentuser",isAuth,getCurrentUser)
userRouter.post("/profile",isAuth,upload.single("photoUrl"),updateProfile)

export default userRouter
import express from "express"
import { createCourse, createLecture, editCourse, editLecture,  enrollCourse,  getAllCourses, getCourseById, getCourseLecture, getcreatorById, getCreatorCourses, getEnrolledCourses, getPublishedCourses, removeCourse, removeLecture } from "../controllers/courseController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { searchWithAi } from "../controllers/searchController.js"
const courseRouter = express.Router()

courseRouter.post("/create", isAuth, createCourse)
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcreator", isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)


courseRouter.post("/createlecture/:courseId", isAuth,createLecture)
courseRouter.get("/courselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/creator",isAuth,getcreatorById)
courseRouter.get("/getallcourses", getAllCourses);
courseRouter.get("/getEnrolledCourses", isAuth, getEnrolledCourses);
courseRouter.post("/enroll", isAuth, enrollCourse);
courseRouter.post("/search",searchWithAi)


export default courseRouter
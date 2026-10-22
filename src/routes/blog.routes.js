import { Router } from "express";
import authentication from "../middlewares/authentication.js";


const router = Router()


router.post("/add-blog",authentication, addBlog)
router.get("/get-all-blogs", getAllBlogs)
router.get("/getMyBlogs",authentication,getMyBlogs) 
router.delete("/delete-blog/:blogId",authentication, deleteBlog)
router.put("/edit-blog/:blogId",authentication, editBlog)
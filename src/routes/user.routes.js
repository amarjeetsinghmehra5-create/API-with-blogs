import { Router } from "express";
import { addBlog, getAllBlogs, registerUser ,getMyBlogs, deleteBlog, getMyProfile,updateMyProfile, editBlog, forgotPassword, resetPassword} from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import authentication from "../middlewares/authentication.js";
import { upload } from "../middlewares/multer.js";


const router = Router()

router.post("/register-user", registerUser)
router.post("/login-user", loginUser)
router.post("/add-blog",authentication,upload, addBlog)
router.get("/get-all-blogs", getAllBlogs)
router.get("/getMyBlogs",authentication,getMyBlogs) 
router.delete("/delete-blog/:blogId",authentication, deleteBlog)
router.put("/edit-blog/:blogId",authentication,upload,editBlog)

router.get("/getMyProfile", authentication, getMyProfile);

router.put("/updateMyProfile",authentication,upload,updateMyProfile);
router.post("/forgotpassword",forgotPassword)
router.post("/reset-password/:token",resetPassword)



export default router
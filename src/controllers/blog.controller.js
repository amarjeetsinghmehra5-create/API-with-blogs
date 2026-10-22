import Blog from "../models/blog.model";
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"
import "dotenv/config"

export const addBlog = async (req, res) => {
  try {
   
    const {title, description} = req.body

    if (!title || !description) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const blog = await Blog.create({
      title,
      description,
      userId
    })

    return res.status(201).json({
      message: "Blog created successfully",
      data: blog
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId","email username")

    if (!blogs) {
      return res.status(404).json({
        message: "Blogs not found"
      })
    }

    return res.status(200).json({
      message:"Blogs returned successfully",
      data: blogs
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id

    const blogs = await Blog.find({
      userId:userId
    })

    if (!blogs) {
      return res.status(404).json({
        message: "Blogs not found"
      })
    }

    return res.status(200).json({
      message: "Blogs returned successfully",
      data: blogs
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const deleteBlog = async (req, res) => {
  try {
    const {blogId} = req.params
    const userId = req.user._id

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(400).json({
        message:"Blog not found"
      })
    }

   const deleteBlog = await Blog.findOneAndDelete({
    _id: blogId,
    userId: userId
   })

   if (!deleteBlog) {
    return res.status(401).json({
      message: "You are not allowed to delete this blog"
    })
   }

   return res.status(200).json({
    message: "BLog deleted successfully",
    data: deleteBlog
   })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const editBlog = async (req, res) => {
  try {
    const {blogId} = req.params
    const userId = req.user._id

    const {title, description} = req.body 

    if (!title && !description) {
      return res.status(400).json({
        message:"At least one field is required for editing a blog"
      })
    }

    let updatedData = {}

    if (title) updatedData.title = title
    if (description) updatedData.description = description


   const blog = await Blog.findOneAndUpdate(
    {
      _id: blogId,
      userId: userId
    }, 
    {
      $set: updatedData    
    },
    {
      new: true,
    }
   )

   if (!blog) {
    return res.status(404).json({
      message: "Unauthorized or blog not found"
    })
   }

   return res.status(201).json({
    message: "Blog updated successfully",
    data: blog
   })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}


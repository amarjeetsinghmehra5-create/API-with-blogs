import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"
import "dotenv/config"
import Blog from "../models/blog.model.js"

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !password || !email) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(401).json({
        message: "User already registered, please login to continue"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    return res.status(201).json({
      message: "User registered successfully",
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Both email and password are required"
      })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "User does not exist, please register first"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password"
      })
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d"
    })

    return res.status(200).json({
      message: "User logged in successfully",
      data: token
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const addBlog = async (req, res) => {
  try {

    const userId = req.user._id
    const { title, description } = req.body

    if (!title || !description || !req.file) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const blog = await Blog.create({
      title,
      description,
      image: `/${req.file.filename}`,
      userId,
    });

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
    const blogs = await Blog.find().populate("userId", "email username")

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

export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id

    const blogs = await Blog.find({
      userId: userId
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
    const { blogId } = req.params
    const userId = req.user._id

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(400).json({
        message: "Blog not found"
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
    const { blogId } = req.params
    const userId = req.user._id

    const { title, description } = req.body

    if (!title && !description && !req.file) {
      return res.status(400).json({
        message: "At least one field is required for editing a blog"
      })
    }

    let updatedData = {}

    if (title) updatedData.title = title
    if (description) updatedData.description = description
    if (req.file) {
      updatedData.image = `/public/${req.file.filename}`;
    }

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

    return res.status(200).json({
      message: "Blog updated successfully",
      data: blog
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.username = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (req.file) {
      updateData.profileImage = `/public/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name !== undefined) {
      updateData.username = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (req.file) {
      updateData.profileImage = `/public/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      })
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m"
    })

    const expiresIn = Date.now() + 15 * 60 * 1000

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiresIn;
    await user.save()

    const resetPasswordUrl = `http://localhost:3000/reset-password/${token}`


    ///send mail logic


    return res.status(200).json({
      message: "Reset password link sent successfully",
      data: resetPasswordUrl
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params

    const { password, confirmPassword } = req.body

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Both fields are required"
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password must be same"
      })
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userId = decoded.userId;

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });


    if (!user) {
      return res.status(404).json({
        message: "Invalid or expried reset token",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    })


  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
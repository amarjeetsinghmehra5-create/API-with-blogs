import "dotenv/config"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({
                message: "Token is required/unauthorized"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
                  
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export default authentication
import {Schema, model} from "mongoose"


const blogSchema = new Schema({
    title: {type: String, default: null},
    description: {type: String, default:null},
    image: {type: String, default:null},
    userId: {type: Schema.Types.ObjectId, ref:"User"}
}, {timestamps: true})


const Blog = model("Blog", blogSchema)

export default Blog
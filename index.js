import express from 'express'
import "dotenv/config"
import connectDB from './src/configs/db.config.js'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
const app = express()
// const port = 3000  
const port = process.env.PORT || 3000;

await connectDB()
app.use(express.json())
app.use(cors())
app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use("/api/user", userRoutes)
app.get('/', (req, res) => {
  res.send('hey how are you and your family')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



//  "express": "^5.2.1"
//   "start": "node index.js"
import express from "express";
import authRoutes from"./modules/auth/auth.route.js"
const app = express();

app.use(express.json({limit:"1mb"}));

app.use("/auth",authRoutes)

app.get("/health",(req,res)=>{
    res.json({status:"ok"});
});



export default app;

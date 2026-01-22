import express from "express";
import { loginController,registerController, refreshController  } from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import { rateLimit } from "./rateLimit.middleware.js";
const router= express.Router();

router.post("/login",rateLimit({ keyPrefix: "login", limit: 5, windowSeconds: 60 }), loginController);
router.post("/refresh",rateLimit({ keyPrefix: "refresh", limit: 10, windowSeconds: 300 }), refreshController);
router.post("/register", rateLimit({ keyPrefix: "register", limit: 3, windowSeconds: 300 }), registerController)


router.get("/gateway/data", authMiddleware(),(req,res)=>{
    res.json({message:`Hello user ${req.user.id}`})
});


router.delete("/gateway/admin/delete", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Deleted successfully" });
});







export default router;
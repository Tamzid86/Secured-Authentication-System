import { loginService, registerService } from "./auth.service.js";
import { refreshTokenService } from "./auth.service.js";
import{registerSchema} from "./auth.schema.js"
import { logSecurityEvent } from "../../utils/securityLogger.js";


export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({msg:"email & password are required"})
        }
        const result= await loginService(email,password);

        return res.status(200).json({
            msg:"Login successful",
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken

        });

    }
    catch(err){
      await logSecurityEvent({
        eventType: "LOGIN_FAILED",
        ip: req.ip,
        metadata: { reason: err.message },
      });
    
      return res.status(401).json({ message: "Invalid credentials" });
    }
};

export const refreshController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const tokens = await refreshTokenService(refreshToken);

    return res.status(200).json({
      message: "Token refreshed",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const registerController = async(req,res)=>{
  try{
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success){
      return res.status(400).json({message:"invalid input"});
    }
    const {email, password, role}=parsed.data;
    const user= await registerService(email, password, role);

    return res.status(201).json({
      message:"User registered successfully",
      user:{
        id: user.id,
        email:user.email,
        role: user.role
      }
    })
  }
  catch(err){
      return res.status(500).json({message:err.message})
  }
}
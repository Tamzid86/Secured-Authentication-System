import { verifyAccessToken } from "../../utils/token.js";

export const authMiddleware = (allowedRoles=[])=>{
    return (req,res,next)=>{
        try{
            const authHeader= req.headers["authorization"];
            if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({message:"Authorization token is missing"})
            }
            const token= authHeader.split(" ")[1];
            const decode = verifyAccessToken(token);

            req.user={
                id: decode.sub,
                role: decode.role
            };
            if(allowedRoles.length && !allowedRoles.includes(decode.role)){
                return res.status(403).json({message:"Forbidden"})
            }
            next();
        }
        catch{
            return res.status(500).json({message:"Internal system error"})
        }
    }
}
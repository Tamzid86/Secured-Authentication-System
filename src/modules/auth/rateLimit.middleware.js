import { redis } from "../../config/redis.js";

export const rateLimit=({
    keyPrefix,
    limit,
    windowSeconds,
})=>{
    return async (req,res, next)=>{
        try{
            const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
            const key = `${keyPrefix}: ${identifier}`;
            const current = await redis.incr(key);
            if(current==1){
                await redis.expire(key,windowSeconds);
            }

            if(current>limit){
                return res.status(429).json({
                    message:"Too many requests. Try again later",
                })
            }
            next();
        }
        catch(err){
            return res.status(500).json({message:"Rate limiter error"})
        }
    }
}
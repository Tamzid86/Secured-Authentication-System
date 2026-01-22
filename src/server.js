import app from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

app.listen(env.PORT,async ()=>{
    try{
        await pool.query("Select 1");
        console.log("Database is connected");
        console.log(`API Gateway running on port ${env.PORT}`);
    }
    catch(err){
         console.error("Cannot connect to PostgreSQL:", err);
    }
});



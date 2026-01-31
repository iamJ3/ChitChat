import mongoose from "mongoose"

export const  connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        // console.log(`mongodb connected ${connectDb.connection.host}`);
        
    } catch (error) {
        console.log(`mongoddb not connected ${error}`);
        
    }
}
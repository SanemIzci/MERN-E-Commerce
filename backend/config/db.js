import mongoose from 'mongoose';

export const connectDB=async()=>{
  
    const conn=await mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database connection error: ', err))
}
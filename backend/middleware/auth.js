import User from '../models/user.js'
import jwt from 'jsonwebtoken'


export const authenticationMid = async (req, res, next) => {
    try {
        const token=req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Please login to continue" });
        }

        const decodedData = jwt.verify(token, "SECRETTOKEN");

        req.user = await User.findById(decodedData.id);
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        next(); 
        
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};

export const roleCheck=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:   "You do not have permission to perform this action."})
        }
        next() 
    }
    
}
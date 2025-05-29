import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto'
import nodemailer from 'nodemailer'


export const register = async (req, res) => {
    try {
      // Avatar yükleme işlemi
      const avatar = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",  // Cloudinary'de "avatars" adlı klasöre yükle
        width: 130,          // Yüklenen avatar'ın genişliğini ayarla
        crop: "scale",       // Boyutlandırma türünü "scale" yap
        overwrite: true      // Aynı isme sahip bir avatar varsa üzerine yaz
      })
  
      const { name, email, password } = req.body;
  
      // Aynı e-posta ile kayıtlı bir kullanıcı olup olmadığını kontrol et
      const user = await User.findOne({ email })
      if (user) {
        return res.status(409).json({ message: "This email is already in use." })
      }
  
      // Şifreyi hash'le
      const passwordHash = await bcrypt.hash(password, 10)
  
      // Şifre uzunluğunu kontrol et
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." })
      }
  
      // Yeni kullanıcı oluştur
      const newUser = await User.create({
        name,
        email,
        password: passwordHash,
        avatar: {
          public_id: avatar.public_id,  // Cloudinary public_id'sini kaydet
          url: avatar.secure_url        // Cloudinary URL'sini kaydet
        }
      })
  
      // JWT token oluştur
      const token = jwt.sign({ id: newUser._id }, "SECRETTOKEN", { expiresIn: "1h" })
  
      // Cookie ayarları
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)  // 5 gün geçerlilik
      }
  
      // Token'ı cookie olarak gönder
      res.status(201)
        .cookie("token", token, cookieOptions)
        .json({
          newUser,
          token
        })
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error, please try again later" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        const token = await jwt.sign({ id: user._id }, "SECRETTOKEN", { expiresIn: "1h" });

        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        };

        res.status(200).cookie("token", token, cookieOptions).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

export const forgotPassword = async(req,res) => {
    
    console.log("Forgot password request received for email:", req.body.email);
    const user = await User.findOne({email:req.body.email})
    if(!user){
        console.log("User not found for email:", req.body.email);
        return res.status(404).json({message:"user can not be found"})
    }
    console.log("User found, generating reset token");
    const resetToken = crypto.randomBytes(20).toString('hex')
    console.log("Generated reset token:", resetToken);
    
    // Token'ı hash'lemeden önce kaydediyoruz
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = Date.now() + 5*60*1000
    console.log("Token expiry set to:", new Date(user.resetPasswordExpire));
    
    await user.save({validateBeforeSave:false})
    console.log("Token saved to database for user:", user.email);
    
    const message = `You can use the following code to reset your password:${resetToken}`
    try {
        console.log("Attempting to send email...");
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "44aea328e91a9c",
                pass: "d8f70e9268aea5"
            }
        });

        const mailData = {
            from: '"E-Commerce App" <noreply@ecommerce.com>',
            to: req.body.email,
            subject: 'Password Reset Request',
            text: message,
            html: `<p>You can use the following code to reset your password: <strong>${resetToken}</strong></p>
                   <p>This code will expire in 5 minutes.</p>`
        };

        await transporter.sendMail(mailData)
        console.log("Email sent successfully with token:", resetToken);
        res.status(200).json({
            message: "We've sent a verification code to your email. Please check your inbox and enter the code to proceed.",
            resetToken: resetToken
        })
    } catch (error) {
        console.error("Error sending email:", error);
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave:false})
        res.status(500).json({message:error.message})
    }
}

export const resetPassword = async(req,res) => {
    try {
        console.log("Reset password request received");
        console.log("Token from params:", req.params.token);
        console.log("Password from body:", req.body.password);
        
        if (!req.params.token) {
            console.log("No token provided");
            return res.status(400).json({ message: "Reset token is required" });
        }

        // Token'ı hash'lemeden direkt olarak kontrol ediyoruz
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        console.log("Found user:", user ? "Yes" : "No");
        if (user) {
            console.log("User email:", user.email);
            console.log("Token expiry:", new Date(user.resetPasswordExpire));
            console.log("Current time:", new Date());
            console.log("Stored token:", user.resetPasswordToken);
            console.log("Received token:", req.params.token);
            console.log("Tokens match:", user.resetPasswordToken === req.params.token);
        } else {
            // If no user found, let's check if it's because of expiry or wrong token
            const userWithToken = await User.findOne({ resetPasswordToken: req.params.token });
            if (userWithToken) {
                console.log("User found but token expired. Expiry:", new Date(userWithToken.resetPasswordExpire));
            } else {
                console.log("No user found with this token");
            }
        }

        if (!user) {
            console.log("No user found with this token or token expired");
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        if (!req.body.password) {
            console.log("No password provided");
            return res.status(400).json({ message: "Password is required" });
        }

        // Yeni şifreyi hash'le
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        console.log("Password reset successful for user:", user.email);

        // Yeni token oluştur
        const token = jwt.sign({ id: user._id }, "SECRETTOKEN", { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
            token
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
}

export const logout=async(req,res)=> {
    const cookieOptions={
        httpOnly:true,
        expires:new Date(Date.now())
    }
    res.status(200).cookie("token",null,cookieOptions).json({
        message:"Logout is succesfull"  
    })
}

export const userDetail = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import ProductRoutes from './routes/product.js';
import UserRoutes from './routes/user.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Cloudinary Konfigürasyonu
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();

// Middleware'ler
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Router'lar
app.use('/products', ProductRoutes);
app.use('/users', UserRoutes);

// Veritabanına Bağlan
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import Product from "../models/product.js";
import { v2 as cloudinary } from 'cloudinary';
import ProductFilter from "../utils/ProductFilter.js"; // Sınıf ismi büyük harfle başlatıldı
// Redux thunk (örnek)

export const allProducts = async (req, res) => {
    const resultPerPage = 10;
    const productFilter = new ProductFilter(Product.find(), req.query) // Sınıf ismi düzeltildi
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await productFilter.query;
    res.status(200).json({
        products,
    });
};

  



export const adminProduct = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
};


export const productDetail = async (req, res) => {
    const productDetail = await Product.findById(req.params.id)
        .populate("reviews.user", "name avatar");

    if (!productDetail) {
        return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
    }

    res.status(200).json({ success: true, productDetail });
};



export const createProduct = async (req, res) => {
    try {
        let images = [];

        // Eğer tek bir image string olarak geldiyse diziye çevir
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images; // JSON'daki images dizisini al
        }

        let all_images = [];

        // Cloudinary'ye yükleme işlemi
        for (let index = 0; index < images.length; index++) {
            const result = await cloudinary.uploader.upload(images[index], {
                folder: "products"
            });

            all_images.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        req.body.images = all_images;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Ürün Sil
export const deleteProduct = async (req, res) => {
    const deleteProduct = await Product.findById(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
    }

    for (let index = 0; index < deleteProduct.images.length; index++) {
        await cloudinary.uploader.destroy(deleteProduct.images[index].public_id);
    }

    await deleteProduct.deleteOne();

    res.status(200).json({ success: true, message: "Ürün başarıyla silindi" });
};

// Ürün Güncelle
export const updateProduct = async (req, res) => {
    let updateProduct = await Product.findById(req.params.id);
    if (!updateProduct) {
        return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images.length > 0) {
        for (let index = 0; index < updateProduct.images.length; index++) {
            await cloudinary.uploader.destroy(updateProduct.images[index].public_id);
        }
    }

    let all_image = [];
    for (let index = 0; index < images.length; index++) {
        const result = await cloudinary.uploader.upload(images[index], { folder: "products" });
        all_image.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    }

    req.body.images = all_image;
    updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, updateProduct });
};


export const createReview = async (req, res) => {
    const { product_id, comment, rating } = req.body;

    const review = {
        user: req.user.id,
        name: req.user.name,
        comment,
        rating: Number(rating)
    };

    const product = await Product.findById(product_id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product could not found" });
    }

    product.reviews.push(review);
    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.rating = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: "Comment added succesfully" });
};

export const getRelatedProducts = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category })
            .limit(4)
            .select('name price images category');
            
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



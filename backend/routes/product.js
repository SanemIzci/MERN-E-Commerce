import express from 'express';
import { allProducts, deleteProduct, updateProduct, productDetail, createProduct, createReview, adminProduct, getRelatedProducts } from "../controllers/productController.js";
import { authenticationMid, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/', allProducts);
router.get('/admin', authenticationMid, roleCheck("admin"), adminProduct);
router.get('/:id', productDetail);
router.post('/newReview', authenticationMid, createReview);
router.post('/new', authenticationMid, createProduct);
router.delete('/:id', authenticationMid, roleCheck("admin"), deleteProduct);
router.put('/:id', authenticationMid, roleCheck("admin"), updateProduct);
router.get('/related/:category', getRelatedProducts);

export default router;

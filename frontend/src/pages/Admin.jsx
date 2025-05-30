import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, createProduct } from '../redux/productSlice'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import { openModalFunc } from '../redux/generalSlice'
import Modal from '../components/Modal'
import Input from '../components/Input'

function Admin() {
    const dispatch = useDispatch();
    const {adminProducts, loading, error} = useSelector((state)=>state.products)
    const {openModal} = useSelector((state)=>state.general)
    const {user, isAuth} = useSelector((state) => state.user);
    
    // Debug logs
    useEffect(() => {
        console.log('=== Admin Page Debug Info ===');
        console.log('Current user state:', user);
        console.log('Is authenticated:', isAuth);
        console.log('User role:', user?.role);
        console.log('Admin products:', adminProducts);
        console.log('Loading state:', loading);
        console.log('Error state:', error);
        console.log('Token:', localStorage.getItem('token'));
    }, [user, isAuth, adminProducts, loading, error]);

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        rating: "",
        category: "",
        images: [],
    })
    
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    useEffect(() => {
        const fetchAdminProducts = async () => {
            if (isAuth && user?.role === "admin") {
                console.log('Fetching admin products...');
                try {
                    const result = await dispatch(getAdminProducts()).unwrap();
                    console.log('Admin products fetch result:', result);
                } catch (error) {
                    console.error('Error fetching admin products:', error);
                }
            }
        };
        
        fetchAdminProducts();
    }, [dispatch, isAuth, user]);

    const addProduct = () => {
        dispatch(openModalFunc())
    }

    const productHandle = (e) => {
        if (e.target.name === "images") {
            const files = Array.from(e.target.files);
            console.log('Selected files:', files); // Debug log
            
            // Clear previous previews
            imagePreview.forEach(preview => URL.revokeObjectURL(preview));
            
            setSelectedImages(files);
            
            // Create preview URLs for selected images
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreview(previews);
            
            setData(prev => ({...prev, images: files}));
        } else {
            setData(prev => ({...prev, [e.target.name]: e.target.value}));
        }
    }

    const removeImage = (index) => {
        const newSelectedImages = [...selectedImages];
        const newImagePreview = [...imagePreview];
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newImagePreview[index]);
        
        newSelectedImages.splice(index, 1);
        newImagePreview.splice(index, 1);
        
        setSelectedImages(newSelectedImages);
        setImagePreview(newImagePreview);
        setData(prev => ({...prev, images: newSelectedImages}));
    }

    const handleSubmit = async () => {
        try {
            // Convert images to base64
            const imagePromises = selectedImages.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const base64Images = await Promise.all(imagePromises);
            
            // Create the product data object
            const productData = {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                rating: data.rating,
                category: data.category,
                images: base64Images
            };

            console.log('Sending product data:', productData); // Debug log

            const result = await dispatch(createProduct(productData)).unwrap();
            if (result) {
                dispatch(openModalFunc()); // Close modal after successful submission
                setData({ // Reset form
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    rating: "",
                    category: "",
                    images: [],
                });
                setSelectedImages([]);
                setImagePreview([]);
                // Refresh the product list
                dispatch(getAdminProducts());
            }
        } catch (error) {
            console.error('Failed to create product:', error);
            alert(error.message || 'Failed to create product');
        }
    }

    const content = () => {
        return (
            <div className='my-3 space-y-4'>
                <Input 
                    onChange={productHandle} 
                    name="name" 
                    placeholder="Product Name" 
                    type="text" 
                    value={data.name}
                />
                <Input 
                    onChange={productHandle} 
                    name="description" 
                    placeholder="Product Detail" 
                    type="text" 
                    value={data.description}
                /> 
                <Input 
                    onChange={productHandle} 
                    name="price" 
                    placeholder="Product Price" 
                    type="number" 
                    value={data.price}
                />    
                <Input 
                    onChange={productHandle} 
                    name="category" 
                    placeholder="Product Category" 
                    type="text" 
                    value={data.category}
                />     
                <Input 
                    onChange={productHandle} 
                    name="stock" 
                    placeholder="Product Stock" 
                    type="number" 
                    value={data.stock}
                />      
                <Input 
                    onChange={productHandle} 
                    name="rating" 
                    placeholder="Product Rating" 
                    type="number" 
                    value={data.rating}
                />
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Input 
                            onChange={productHandle} 
                            name="images" 
                            type="file" 
                            multiple={true}
                            accept="image/*"
                        />
                        <span className="text-sm text-gray-500">
                            Select multiple images
                        </span>
                    </div>
                    {imagePreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {imagePreview.map((preview, index) => (
                                <div key={index} className="relative aspect-square">
                                    <img 
                                        src={preview} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-full object-cover rounded bg-white p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className='flex flex-col items-center gap-4'>
                <div className="text-sm text-gray-600">
                    {isAuth ? `Logged in as: ${user?.email} (${user?.role})` : 'Not logged in'}
                </div>
                {isAuth && user?.role === "admin" ? (
                    <Button name={"Add Product"} onClick={addProduct}/>
                ) : (
                    <div className="text-red-500">
                        {!isAuth ? "Please login" : "Access denied. Admin privileges required."}
                    </div>
                )}
            </div>
            
            {loading ? (
                <div className="text-center mt-4">Loading admin products...</div>
            ) : error ? (
                <div className="text-red-500 text-center mt-4">{error}</div>
            ) : adminProducts?.success && adminProducts?.products?.length > 0 ? (
                <div className="flex items-center justify-center gap-5 flex-wrap m-10">
                    {adminProducts.products.map((product, index) => (
                        <ProductCard key={index} product={product} edit={user?.role === "admin"}/>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4">
                    {isAuth && user?.role === "admin" 
                        ? "No products found. Add your first product!" 
                        : "Please log in as admin to view products"}
                </div>
            )}
            
            {openModal && (
                <Modal 
                    title={"Add Product"} 
                    content={content} 
                    btnName={"Add Product"} 
                    onClick={handleSubmit}
                />
            )}
        </div>
    )
}

export default Admin
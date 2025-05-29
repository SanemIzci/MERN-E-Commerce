import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, createProduct } from '../redux/productSlice'
import { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import { openModalFunc } from '../redux/generalSlice'
import Modal from '../components/Modal'
import Input from '../components/Input'

function Admin() {
    const dispatch = useDispatch();
    const {adminProducts, loading} = useSelector((state)=>state.products)
    const {openModal} = useSelector((state)=>state.general)
    const user = useSelector((state) => state.user);
    
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        rating: "",
        category: "",
        images: [],
    })
    
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    const addProduct = () => {
        dispatch(openModalFunc())
    }

    const productHandle = (e) => {
        if (e.target.name === "images") {
            const files = Array.from(e.target.files);
            setData(prev => ({...prev, images: files}));
        } else {
            setData(prev => ({...prev, [e.target.name]: e.target.value}));
        }
    }

    const handleSubmit = async () => {
        try {
            await dispatch(createProduct(data)).unwrap();
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
        } catch (error) {
            console.error('Failed to create product:', error);
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
                <Input 
                    onChange={productHandle} 
                    name="images" 
                    type="file" 
                    multiple
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className='flex justify-center'>
                {user?.role === "admin" && (
                    <Button name={"Add Product"} onClick={addProduct}/>
                )}
                

            </div>
            
            {loading ? "Loading..." : adminProducts?.products && (
                <div className="flex items-center justify-center gap-5 flex-wrap m-10">
                    {adminProducts?.products.map((product, index) => (
                        <ProductCard key={index} product={product} edit={true}/>
                    ))}
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
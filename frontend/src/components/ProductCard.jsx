import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { deleteProduct, updateProduct } from "../redux/productSlice";
import Modal from "./Modal";
import Input from "./Input";

function ProductCard({ product, edit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    category: product.category,
    images: product.images
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  if (!product || !product.images || product.images.length === 0) {
    return <div>No images available</div>;
  }

  const settings = {
    dots: true,
    infinite: false, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Clear previous previews
    imagePreview.forEach(preview => URL.revokeObjectURL(preview));
    
    setSelectedImages(files);
    
    // Create preview URLs for selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreview = [...imagePreview];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreview[index]);
    
    newSelectedImages.splice(index, 1);
    newImagePreview.splice(index, 1);
    
    setSelectedImages(newSelectedImages);
    setImagePreview(newImagePreview);
  };

  const removeExistingImage = (index) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    try {
      let updatedImages = [...editData.images];
      
      if (selectedImages.length > 0) {
        const imagePromises = selectedImages.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(imagePromises);
        updatedImages = [...updatedImages, ...base64Images];
      }

      const updatedData = {
        ...editData,
        images: updatedImages
      };

      await dispatch(updateProduct({ 
        productId: product._id, 
        productData: updatedData 
      })).unwrap();
      
      setOpenModal(false);
      setSelectedImages([]);
      setImagePreview([]);
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    }
  };

  const handleInputChange = (e) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const editContent = () => {
    return (
      <div className='my-3 space-y-4'>
        <Input 
          onChange={handleInputChange} 
          name="name" 
          placeholder="Product Name" 
          type="text" 
          value={editData.name}
        />
        <Input 
          onChange={handleInputChange} 
          name="description" 
          placeholder="Product Detail" 
          type="text" 
          value={editData.description}
        /> 
        <Input 
          onChange={handleInputChange} 
          name="price" 
          placeholder="Product Price" 
          type="number" 
          value={editData.price}
        />    
        <Input 
          onChange={handleInputChange} 
          name="category" 
          placeholder="Product Category" 
          type="text" 
          value={editData.category}
        />     
        <Input 
          onChange={handleInputChange} 
          name="stock" 
          placeholder="Product Stock" 
          type="number" 
          value={editData.stock}
        />      
        <Input 
          onChange={handleInputChange} 
          name="rating" 
          placeholder="Product Rating" 
          type="number" 
          value={editData.rating}
        />

        {/* Current Images */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Current Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {editData.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={image.url} 
                  alt={`Current ${index + 1}`} 
                  className="w-full h-full object-contain rounded bg-white p-1"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images Upload */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Add New Images</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input 
                onChange={handleImageChange} 
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
                      className="w-full h-full object-contain rounded bg-white p-1"
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
      </div>
    );
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/product/${product._id}`)} 
        className="bg-gray-100 p-4 rounded-lg shadow-md w-full sm:w-[calc(30%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] h-auto sm:h-[400px] relative overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
      >
        <div className="flex-grow">
          <Slider {...settings}>
            {product.images.map((image, index) => (
              <div key={`${product.id}-${index}`} className="flex justify-center flex-wrap">
                <img
                  src={image.url}
                  alt={`Product Image ${index}`}
                  className="w-full h-48 object-contain rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="flex items-center flex-col mt-auto">
          <h2 className="text-lg font-semibold text-center mt-2 font-be-vietnam">{product.name}</h2>
          <div className="text-lg font-bold mt-2">${product.price}</div>
          <Button 
            name="Buy Now" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }} 
            className="mt-2 w-full sm:w-auto"
          />
        </div>

        {edit && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <FaEdit 
              onClick={handleEdit}
              className="text-gray-600 hover:text-blue-500 cursor-pointer" 
            />  
            <FaTrash 
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-500 cursor-pointer" 
            />
          </div>
        )}
      </div>

      {openModal && (
        <Modal 
          title="Edit Product" 
          content={editContent} 
          btnName="Update Product" 
          onClick={handleUpdate}
        />
      )}
    </>
  );
}

export default ProductCard;


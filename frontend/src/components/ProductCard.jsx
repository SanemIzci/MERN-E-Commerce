import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "./Button"

function ProductCard({ product, edit }) {
  const navigate = useNavigate();

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

  return (
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
          <FaEdit className="text-gray-600 hover:text-blue-500 cursor-pointer" />  
          <FaTrash className="text-gray-600 hover:text-red-500 cursor-pointer" />
        </div>
      )}
    </div>
  );
}

export default ProductCard;


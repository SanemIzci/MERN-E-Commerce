import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetail, createReview, getRelatedProducts } from "../redux/productSlice";
import {addToCart} from "../redux/cartSlice"
import Slider from "react-slick";
import StarRating from "../components/StarRating";
import Button from "../components/Button";
import Input from "../components/Input";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";

function Details() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, relatedProducts } = useSelector((state) => state.products);
    const { isAuth } = useSelector((state) => state.user);
    const [quantity,setQuantity]=React.useState(1)
    const [comment, setComment] = React.useState("");
    const [rating, setRating] = React.useState(0);




    useEffect(() => {
      if (id) {
        dispatch(getProductDetail(id));
      }
    }, [dispatch, id]);

    useEffect(() => {
      if (product?.productDetail?.category) {
        dispatch(getRelatedProducts(product.productDetail.category));
      }
    }, [dispatch, product?.productDetail?.category]);

    console.log(product, loading, "detaylar");

    const settings = {
      dots: true,
      infinite: false, // Ensure this is set to false to prevent infinite scrolling
      speed: 500,
      slidesToShow: 1, // Show one image at a time
      slidesToScroll: 1, // Scroll one image at a time
      
    };
    
    

  const addBasket=()=>{
    const data={
      id:product?.productDetail?._id,
      name:product?.productDetail?.name,
      image:product?.productDetail?.images?.[0]?.url,
      price:product?.productDetail?.price,
      quantity:quantity
    }
    dispatch(addToCart(data));
  }

  const increment=()=>{
    if(quantity<product.productDetail.stock){
      setQuantity(quantity+1)}

  }

  const decrement=()=>{
    if(quantity>1){
      setQuantity(quantity-1)
    }
  }
  const leaveComment = () => {
    if (!comment || rating === 0) {
      alert("Please provide both a comment and rating");
      return;
    }
    dispatch(createReview({ product_id: id, comment, rating }));
    setComment("");
    setRating(0);
  };
  console.log(product)

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <Loading />
        ) : product?.productDetail ? (
          <>
            {/* Ürün Görselleri ve Detaylar */}
            <div className="w-full max-w-screen-lg mx-auto flex flex-wrap justify-center items-start gap-8 p-4">
              {/* Sol: Görseller */}
              <div className="w-full md:w-[45%] lg:w-1/3 h-[50vh] md:h-[75vh]">
                <Slider {...settings}>
                  {product.productDetail.images.map((image, index) => (
                    <div key={index} className="flex justify-center items-center h-[!/2vh]">
                      <img
                        src={image.url}
                        alt={`Product Image ${index}`}
                        className="w-full h-100 md:h-150 object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
  
              {/* Sağ: Detaylar */}
              <div className="w-full md:w-[45%] lg:w-1/3 flex flex-col gap-5 min-w-[300px] h-[50vh] md:h-[50vh] ">
                <div className="text-2xl font-semibold mb-4 font-inter">{product.productDetail.name}</div>
                <div className="text-gray-600 mb-4">{product.productDetail.description}</div>
                <div className="text-xl font-bold mb-4">${product.productDetail.price}</div>
                {product.productDetail.stock > 0 ? (
                  <div className="text-green-500 mb-4">Stock: {product.productDetail.stock}</div>
                ) : (
                  <div className="text-red-500 mb-4">Out of stock</div>
                )}
                <div className="mb-4">Category: {product.productDetail.category}</div>
                <div className="flex items-center gap-4 ml-0">
                  Rating:{" "}
                  <StarRating rating={product.productDetail.rating} totalStars={5} />
                </div>
                <div className="flex flex-row mt-2 gap-4 items-center">
                  <div className="flex items-center gap-5 border border-black rounded-md px-5 py-2">
                    <div className="text-3xl cursor-pointer" onClick={decrement}>-</div>
                    <div className="text-xl">{quantity}</div>
                    <div className="text-3xl cursor-pointer" onClick={increment}>+</div>
                  </div>
                  <Button name="Add to Cart" onClick={addBasket} size="large" />
                </div>
              </div>
            </div>
                
            {/* Yorum ve İncelemeler */}
            <div className="w-full max-w-screen-lg mx-auto mt-12 lg:mt-20">
              {isAuth ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <StarRating
                      rating={rating}
                      totalStars={5}
                      onRatingChange={setRating}
                      interactive={true}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Comment</label>
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here..."
                      type="text"
                      name="comment"
                    />
                  </div>
                  <Button name="Submit Review" onClick={leaveComment} />
                </>
              ) : (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 mb-2">Please login to leave a review</p>
                  <Button name="Login" onClick={() => window.location.href = '/auth'} />
                </div>
              )}
  
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-5">Reviews</h2>
                {product?.productDetail?.reviews?.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  product.productDetail.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-300 pb-4 mb-4 flex items-center gap-3">
                      {review.user?.avatar?.url ? (
                        <img src={review.user.avatar.url} alt={review.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                      )}
                      <div>
                        <div className="font-semibold">{review.name}</div>
                        <StarRating rating={review.rating} totalStars={5} />
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
  
            {/* İlgili Ürünler */}
            <div className="w-full max-w-screen-lg mx-auto mt-12">
              <h2 className="text-xl font-bold mb-5">Related Products</h2>
              <div className="flex items-center justify-center gap-5 flex-wrap">
                {loading ? <Loading /> : relatedProducts?.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">Product not found</p>
        )}
      </div>
    </div>
  );
}

export default Details;

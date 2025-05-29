import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import bannerImg from '../images/Banner.png';
import Banner2 from '../images/Banner 2.png';
import Button from "../components/Button";
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const dispatch = useDispatch();
  const {products,loading} = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const navigate = useNavigate();


  console.log(products,loading,"ürünler");
  return(
    <div>
      <div>
        <img src={bannerImg} alt='banner' className="w-full    object-contain"></img>
      </div>
    
   
    {
      loading ? (
        <Loading />
      ) : products?.products && <div className="flex items-center justify-center gap-5 flex-wrap m-10">
        {products?.products.map((product,index)=>(
          <ProductCard key={index} product={product}/>
        ))}
      </div>
    }
    <div>
    <img src={Banner2} alt='banner' className="w-full object-contain"></img>

    </div>
   
</div>
  )
  
}


export default Home;
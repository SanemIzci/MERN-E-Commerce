import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../redux/productSlice'
import ProductCard from '../components/ProductCard'
import Filter from '../layout/Filter'
import Pagination from '../components/Pagination'
import Loading from "../components/Loading";

function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { keyword } = useSelector((state) => state.general)
  const [price, setPrice] = React.useState({ min: 0, max: 10000 })
  const [rating, setRating] = React.useState(0)
  const [category, setCategory] = React.useState("")
  const [currentItems, setCurrentItems] = React.useState([]);

  useEffect(() => {
    dispatch(getProducts({ keyword, price, rating, category }));
  }, [dispatch, keyword, price, rating, category]);

  useEffect(() => {
    if (products?.products) {
      setCurrentItems(products.products.slice(0, 8));
    }
  }, [products]);

  return (
    <>
   
      <div className='flex flex-row min-h-screen ml-5'>
        {/* Sol taraf - Filter */}
        <div className='w-1/2 md:w-1/5'>
          <Filter setCategory={setCategory} setRating={setRating} setPrice={setPrice} />
        </div>
        {/* Sağ taraf - Ürünler */}
        {loading ? (
          <Loading />
        ) : (
          <div className='w-1/2 md:w-4/5 p-6'>
            {products?.products && (
              <div className="flex flex-wrap justify-start gap-4">
                {currentItems.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
        
        
      </div>
    
      <div className="flex justify-center mb-4">
        <Pagination
          items={products?.products || []}
          itemsPerPage={8}
          onPageChange={(items) => {
            setCurrentItems(items);
          }}
        />
      </div>
    </>
  );
}

export default Products
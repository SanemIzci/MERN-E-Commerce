import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Filter({ setCategory, setRating, setPrice }) {
  const categoryList = ['Smart Watches', 'Wireless Headphones', 'Laptop', 'Smartphone', 'Tablet', 'Headphones'];
  const ratingList = [1, 2, 3, 4, 5];
  const [isOpen, setIsOpen] = useState(false); // boolean
  const [isCategoryOpen, setCategoryOpen] = useState(false)
  const [isRatingOpen, setRatingOpen] = useState(false)

  return (
    <div className="w-full h-full p-6 text-black">

      {/* Dropdown */}
      <div className="relative mb-6">
        <div
          className="flex justify-between items-center cursor-pointer w-full"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span className="text-xl font-inter sm:flex-wrap">Price</span>

          {isOpen ? (
            <FaChevronUp className="w-4 h-4" />
          ) : (
            <FaChevronDown className="w-4 h-4" />
          )}
        </div>
        <hr className="my-2 border-t border-gray-300" />

        {isOpen && (
          <div className="flex gap-2 mt-2">
            <input
              onChange={(e) =>
                setPrice((prev) => ({ ...prev, min: e.target.value }))
              }
              type="number"
              placeholder="From"
              className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
            />
            <input
              onChange={(e) =>
                setPrice((prev) => ({ ...prev, max: e.target.value }))
              }
              type="number"
              placeholder="To"
              className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="relative mb-6">
        <div
          className="flex justify-between items-center cursor-pointer w-full"
          onClick={() => setCategoryOpen(prev => !prev)}
        >
          <span className="text-xl font-inter sm:flex-wrap">Categories</span>

          {isCategoryOpen ? (
            <FaChevronUp className="w-4 h-4"/>
          ) : (
            <FaChevronDown className="w-4 h-4" />
          )}
        </div>
        <hr className="my-2 border-t border-gray-300" />

        {isCategoryOpen && (
          <ul className="space-y-1">
            {categoryList.map((category, index) => (

              <li
                key={index}
                onClick={() => setCategory(category)}
                className="cursor-pointer hover:underline "
              >
                {category}
              </li>
            ))}
          </ul>

        )}

      </div>


      {/* Ratings */}
      <div className="relative mb-6">
        <div
          className="flex justify-between items-center cursor-pointer w-full"
          onClick={() => setRatingOpen(prev => !prev)}
        >
          <span className="text-xl font-inter flex sm:flex-wrap">Rating</span>

          {isRatingOpen ? (
            <FaChevronUp className="w-4 h-4" />
          ) : (
            <FaChevronDown className="w-4 h-4" />
          )}
        </div>
        <hr className="my-2 border-t border-gray-300" />

        {isRatingOpen && (
          <ul className="space-y-1">
            {ratingList.map((rating, index) => (
              <li
                key={index}
                onClick={() => setRating(rating)}
                className="cursor-pointer"
              >
                {rating} ⭐
              </li>
            ))}
          </ul>

        )}

      </div>



    </div>
  );
}

export default Filter;



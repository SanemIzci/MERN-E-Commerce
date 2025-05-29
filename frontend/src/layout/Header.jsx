import React, { useState,useRef, useEffect } from 'react';
import { LuShoppingBasket } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getKeyword } from '../redux/generalSlice';
import { useSelector } from 'react-redux';
import logo from '../images/logo.png';
import { IoSearchOutline } from "react-icons/io5";
import { PiBasketThin, PiUserThin } from "react-icons/pi";
import { RiMenu3Line } from "react-icons/ri";
import { toast } from 'react-toastify';

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);  
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, isAuth} = useSelector(state => state.user);
  const {carts} = useSelector(state => state.cart);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: 'Profile', url: '/profile' },
    { name: 'Admin', url: '/admin' },
    { name: 'Logout', url: '/logout' }
  ];

  const handleSearch = () => {
    dispatch(getKeyword(keyword));
    navigate("/products");
    setKeyword("");
  };

  const home = () => {
    navigate("/");
  };

  const menuFunc = (item) => {
    if(item.name == "Logout"){
      localStorage.clear();
      window.location = "/";
    } else if(item.name == "Admin" && user?.role === "user") {

      window.location = "/";
    } else {
      window.location = item.url;
    }
    setMobileMenuOpen(false);
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  console.log(user, "userrr");

  return (
    <div className="bg-white h-16 px-2 flex items-center justify-between shadow-2xs">
      <img src={logo} alt="logo" className='w-20 h-20 ml-0.5 md:ml-8' onClick={home}/>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <div className="flex items-center w-full gap-4"> 
          <div className='flex flex-row gap-0.5'>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-gray-100 p-2 mt-2 mb-2 rounded-sm"
              type="text"
              placeholder="Search"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-100 cursor-pointer mt-2 mb-2 p-1 rounded-sm"
            >
              <IoSearchOutline/>
            </button>
          </div>

          <div className="relative m-2">
            {user?.avatar?.url ? (
              <img
                className="w-8 h-8 rounded-full cursor-pointer mt-1.5"
                onClick={toggleMenu}
                src={user.avatar.url}
                alt="User"
              />
            ) : (
              <PiUserThin
                className="w-8 h-8 rounded-full cursor-pointer mt-1.5"
                onClick={toggleMenu}
              />
            )}

            {openMenu && (
              <div 
                ref={dropdownRef} 
                className="z-50 absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg py-1 border border-gray-100 transform origin-top-right transition-all duration-200 ease-out"
              >
                {menuItems.map((item, index) => (
                  <div
                    onClick={() => menuFunc(item)}  
                    key={index}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-150 ease-in-out"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative m-2" onClick={() => navigate("/cart")}>
            <div className="mt-1.5">
              <PiBasketThin size={35}/>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {carts?.length}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Burger Menu */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          <RiMenu3Line size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white h-full w-64 p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className='flex flex-row gap-0.5 mb-6'>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-gray-100 p-2 rounded-sm w-full"
                  type="text"
                  placeholder="Search"
                />
                <button
                  onClick={handleSearch}
                  className="bg-gray-100 cursor-pointer p-1 rounded-sm"
                >
                  <IoSearchOutline/>
                </button>
              </div>

              {menuItems.map((item, index) => (
                <div
                  
                  key={index}
                  onClick={() => menuFunc(item)}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  {item.name}
                </div>
              ))}

              <div 
                className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center gap-2"
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
              >
                <PiBasketThin size={24}/>
                <span>Cart ({carts?.length})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
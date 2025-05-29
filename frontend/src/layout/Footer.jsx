import React from 'react'
import { FaXTwitter,FaTiktok } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";
import { CiInstagram } from "react-icons/ci";
import logo from '../images/inverted_image.png';

function footer() {
  return (
    <div className='bg-black md:h-80 flex flex-col mt-auto'>
      <div className='flex md:flex-row justify-around items-center mt-10 ml-8 gap-5 flex-col'>
        <div className='flex flex-col w-1/3 space-y-2'>
          <img src={logo} alt="logo" className='w-20 h-20 rounded-full' />
          <p className='text-white font-extra text-wretty md:block'>Your trusted source for the latest tech gadgets and seamless online shopping.</p>
        </div>
        <div className='hidden md:flex flex-col w-1/3 space-y-2'>
          <h1 className='text-white font-bold'>Services</h1>
          <a href='#' className='text-white font-extralight'>Gift Cards</a>
          <a href='#' className='text-white font-extralight'>Credit and Payment</a>
          <a href='#' className='text-white font-extralight'>Shipping</a>
        </div>
        <div className='hidden md:flex flex-col w-1/3 space-y-2'>
          <h1 className='text-white font-bold'>Assistance to the buyer</h1>
          <a href='#' className='text-white font-extralight'>Frequently Asked Questions</a>
          <a href='#' className='text-white font-extralight'>Find an order</a>
          <a href='#' className='text-white font-extralight'>Contact Us</a>
        </div>
      </div>
      <div className='mt-15 flex flex-row gap-2 md:w-100'>
        <FaXTwitter className='w-100 text-white'/>
        <CiInstagram className='w-100 text-white'/>
        <SlSocialFacebook className='w-100 text-white'/>
        <FaTiktok className='w-100 text-white'/>
      </div>
    </div>
  )
}

export default footer
import {useSelector, useDispatch} from 'react-redux'
import React from "react";
import {removeFromCart, decreaseQuantity, addToCart} from "../redux/cartSlice"
import { FaCircleQuestion } from "react-icons/fa6";
import Button from "../components/Button";
import { CiTrash } from "react-icons/ci";

export function Cart() {
    const {carts} = useSelector(state => state.cart)
    const dispatch = useDispatch()
    
    console.log(carts, "cartsss  ")
    return (
        <div className="h-screen w-fullml-5 flex flex-row justify-between items-center">
            {carts?.length > 0 ? (
                <div className="" >
                        {carts?.map((cart, index) => (
                            <div key={index} className="w-full flex flex-row justify-between items-center my-10 gap-10 border-b border-gray-200 pb-4">
                                <img src={cart?.image} alt={cart?.name} className="w-[25vh] h-[25vh] flex items-center flex-row py-2" />
                                <div className='w-1/4'>{cart?.name}</div>
                                <div className='w-1/4'>{cart?.price}</div>
                                <div className="flex items-center justify-center gap-2 w-1/4 border border-black rounded-md shadow-md" >
                                    <button 
                                        onClick={() => dispatch(decreaseQuantity(cart.id))}
                                    >
                                        -
                                    </button>
                                    <span>{cart?.quantity}</span>
                                    <button 
                                        onClick={() => dispatch(addToCart({...cart, quantity: 1}))}
                                    >
                                        +
                                    </button>
                                </div>
                                <div 
                            
                                    onClick={() => dispatch(removeFromCart(cart.id))}
                                >
                                    <CiTrash size={25}/>
                                </div>
                                
                            </div>
                            
                        ))}

                </div>
            ) : (
                <div className='text-xl text-gray-500 ml-10'>No product on the cart</div>
            )}

            <div className="w-[25%] h-[50vh] shadow-2xl mr-10 p-6 rounded-lg bg-white">
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold border-b pb-4">Order Summary</h1>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Subtotal</span>
                                <FaCircleQuestion className="text-gray-400 hover:text-gray-600 cursor-help" />
                            </div>
                            <span className="font-semibold">
                                ${carts?.reduce((acc, cart) => acc + cart.price * cart.quantity, 0).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-medium">Shipping</span>
                            <span className="font-semibold text-green-500">Free</span>
                        </div>

                        

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold">
                                    ${(carts?.reduce((acc, cart) => acc + cart.price * cart.quantity, 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center'>
                    <Button name={"Proceed to Checkout"}/>
                    </div>
                       
                </div>
            </div>
            
        </div>
    )
}

export default Cart
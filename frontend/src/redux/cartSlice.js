import { createSlice} from "@reduxjs/toolkit";

const fetchFromLocalStorage=()=>{   
    let cart=localStorage.getItem('cart')
    if(cart){
        try {
            const parsedCart = JSON.parse(cart)
            // Eğer parsedCart bir array değilse veya boşsa, boş array döndür
            if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
                return []
            }
            // Eğer array'in ilk elemanı sadece quantity içeriyorsa, onu filtrele
            return parsedCart.filter(item => item.id !== undefined)
        } catch (error) {
            console.error('Error parsing cart:', error)
            return []
        }
    }
    return []
}

const storeInLocalStorage=(data)=>{
    try {
        // Sadece geçerli cart item'larını sakla
        const validItems = data.filter(item => item.id !== undefined)
        localStorage.setItem('cart', JSON.stringify(validItems))
    } catch (error) {
        console.error('Error storing cart:', error)
    }
}

const initialState = {
    carts: fetchFromLocalStorage()
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const isItemCart = state.carts.find(cart => cart.id === action.payload.id)
            if(isItemCart){
                state.carts = state.carts.map(item => {
                    if(item.id === action.payload.id){
                        return {
                            ...item,
                            quantity: item.quantity + action.payload.quantity
                        }
                    }
                    return item
                })
            } else {
                const newItem = {
                    id: action.payload.id,
                    name: action.payload.name,
                    image: action.payload.image,
                    price: action.payload.price,
                    quantity: action.payload.quantity
                }
                state.carts.push(newItem)
            }
            storeInLocalStorage(state.carts)
        },
        removeFromCart:(state,action)=>{
            state.carts = state.carts.filter(item => item.id !== action.payload)
            storeInLocalStorage(state.carts)    
        },
        decreaseQuantity:(state,action)=>{
            state.carts = state.carts.map(item => {
                if(item.id === action.payload){
                    if(item.quantity > 1){
                        return {
                            ...item,
                            quantity: item.quantity - 1
                        }
                    }
                    return null
                }
                return item
            }).filter(Boolean) // null değerleri filtrele
            storeInLocalStorage(state.carts)
        },
        clearCart:(state)=>{
            state.carts = []
            storeInLocalStorage(state.carts)    
        }
    },
})

export const {addToCart, removeFromCart, decreaseQuantity, clearCart} = cartSlice.actions
export default cartSlice.reducer;

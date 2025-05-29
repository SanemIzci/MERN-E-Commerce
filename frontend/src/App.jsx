import { BrowserRouter as ROUTER, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Details from "./pages/Details"
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from './redux/userSlice'
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./layout/ProtectedRoute";
import ForgetPassword from "./pages/ForgetPassword";
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ResetPassword from "./pages/ResetPassword";




export default function App() {
  const dispatch = useDispatch()
  const { user, isAuth } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(profile())
  }, [dispatch])

  console.log(user, isAuth, "auth")
  return (
    <ROUTER>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/product/:id" element={<Details />} />
        <Route path="/products" element={<Products />} />
        <Route element={<ProtectedRoute isAdmin={false} />}>
          <Route path="/profile" element={<Profile />} /> 
        </Route>
        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin" element={<Admin/>}/>
        </Route>
        <Route path="/forgot" element={<ForgetPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart/>}/>
        
      </Routes>
      <Footer />
    </ROUTER>
  );
}


import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({isAdmin,user}) {
    const token = localStorage.getItem("token");
    
    if(isAdmin && user?.role != "user"){
        return  <Outlet />
    }
    if(!isAdmin && token){
        return  <Outlet />
    }
    
    return <Navigate to="/" />
}
export default ProtectedRoute
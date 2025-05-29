import React from 'react'
import Button from "../components/Button";
import Input from "../components/Input";
import { useDispatch } from 'react-redux';
import { register, login } from '../redux/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Outlet, Navigate } from "react-router-dom";


function Auth() {
  const [signUp, setSignup] = React.useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuth } = useSelector(state => state.user)

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  })

  const [preview, setPreview] = React.useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4tJPTNS6GO7badZIHoWFsLCMMEob3pyEAfA&s")

  const registerFunc = () => {
    dispatch(register(data))
  }

  const loginFunc = async () => {
    try {
      const result = await dispatch(login(data)).unwrap();
      if (result) {
        toast.success('Welcome back! You have successfully logged in.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error || 'Authentication failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const handleChange=(e)=>{
    if(e.target.name==="avatar"){
       const reader=new FileReader();
       reader.onload=()=>{
           if(reader.readyState===2){
               setData(prev=>({...prev,avatar:reader.result}))
               setPreview(reader.result)
           }
       }
       reader.readAsDataURL(e.target.files[0])
    }
    else{
        setData(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  }

  useEffect(() => {
    
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <div className='w-full md:w-1/3 mx-auto p-6 bg-white rounded-lg shadow-lg' >
        <div className="text-3xl font-bold text-center mb-6">{signUp ? "Create Account" : "Welcome Back"}</div>
        
        {signUp && <Input 
            type="text" 
            name="name" 
            id="name"
            placeholder="Full Name"
            value={data.name}
            onChange={handleChange}
        />}
        
        <Input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Email Address"
            value={data.email}
            onChange={handleChange}
        />
        
        <Input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
        />
        
        {signUp && <div className="flex items-center gap-4 my-4">
            <img 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
                src={preview} 
                alt="Profile Preview"
            />
            <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
                <Input 
                    type="file" 
                    name="avatar" 
                    id="" 
                    placeholder="Choose an image"
                    onChange={handleChange}
                />
            </div>
        </div>}
        
        <Button 
            name={signUp ? "Create Account" : "Log in"} 
            onClick={signUp ? registerFunc : loginFunc}
            className="w-full mt-4 "
        />
        
        <p className="text-center text-sm text-gray-600 mt-4">
            {signUp ? "Already have an account? " : "Don't have an account? "}
            <button 
                className="text-blue-600 hover:underline" 
                onClick={() => setSignup(!signUp)}
            >
                {signUp ? "Log in" : "Sign up"}
            </button>
        </p>

        {!signUp  && <p className="text-center text-sm text-gray-600 mt-4">
            <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate('/forgot')}
            >
                Forgot Password?
            </button>
        </p>}

        </div>
        </div>
      
    
  )
}

const ProtectedRoute = () => {
  const { isAuth } = useSelector((state) => state.user);
  return isAuth ? <Outlet /> : <Navigate to="/auth" />;
};

export default Auth
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import { ForgotPassword } from '../redux/userSlice'

function ForgetPassword() {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const forgetFunc = async () => {
    try {
      const response = await dispatch(ForgotPassword(email)).unwrap()
      if (response) {
        // Başarılı yanıt aldığımızda kullanıcıya bilgi verelim
        alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.")
        // Kullanıcıyı reset password sayfasına yönlendirelim
        const resetToken = response.resetToken
        navigate(`/reset/${resetToken}`)
      }
    } catch (error) {
      alert(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }
  
  const { user, isAuth } = useSelector(state => state.user)

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 min-h-screen mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-3xl font-bold text-center mb-6 space-y-1">Forgot Password?</div>
      <Input 
        placeholder={"Enter your email"} 
        onChange={(e) => setEmail(e.target.value)} 
        name="email" 
        id="" 
        type="email"
      />
      <Button 
        name={'Confirm'} 
        onClick={forgetFunc}
        className="w-full mt-4"
      />
    </div>
  )
}

export default ForgetPassword
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import { resetPassword } from '../redux/userSlice'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const { token } = useParams()
  const navigate = useNavigate()

  const handleReset = async () => {
    try {
      if (!token) {
        setError('Invalid reset token')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }

      console.log('Attempting to reset password with token:', token);
      const response = await dispatch(resetPassword({ token, password })).unwrap()
      console.log('Reset password response:', response);
      
      if (response.success) {
        alert('Password has been reset successfully')
        navigate('/login')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError(error.message || 'Error resetting password')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 min-h-screen mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-3xl font-bold text-center mb-6 space-y-1">Create new password</div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Input 
        placeholder="New password" 
        onChange={(e) => setPassword(e.target.value)} 
        name="password" 
        type="password"
        className="mb-4"
      />
      <Input 
        placeholder="Confirm password" 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        name="confirmPassword" 
        type="password"
        className="mb-4"
      />
      <Button 
        name="Reset Password" 
        onClick={handleReset}
        className="w-full mt-4"
      />
    </div>
  )
}

export default ResetPassword
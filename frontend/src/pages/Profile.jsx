import React from 'react'
import { useSelector } from 'react-redux'
import Button from '../components/Button'

function Profile() {
    const {user, isAuth} = useSelector(state => state.user)

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            <img 
                                src={user?.avatar?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4tJPTNS6GO7badZIHoWFsLCMMEob3pyEAfA&s"} 
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                        <p className="text-gray-600">No orders yet</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Settings</h2>
                        <Button name="Edit Profile"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
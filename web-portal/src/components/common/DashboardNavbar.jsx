import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ChevronDown, User, Settings, Bell, X, Camera, Calendar, Shield, Upload } from 'lucide-react'
import logoImage from '../../assets/logo.png'

const DashboardNavbar = ({ 
  userName = 'User', 
  userRole = 'Stakeholder', 
  userAvatar = null,
  dateJoined = 'December 2024',
  approvedBy = 'System Admin'
}) => {
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [profileImage, setProfileImage] = useState(userAvatar)
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('herbaltrace_user')
    localStorage.removeItem('herbaltrace_token')
    // Navigate to home page
    navigate('/')
  }

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleViewProfile = () => {
    setShowProfileMenu(false)
    setShowProfileModal(true)
  }

  const handleOpenSettings = () => {
    setShowProfileMenu(false)
    setShowSettingsModal(true)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2">
              <img 
                src={logoImage} 
                alt="HerbalTrace Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
              <span className="text-2xl md:text-3xl font-bold text-primary-700">HerbalTrace</span>
            </div>

            {/* Right Section - Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="relative">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-primary-200">
                        {getInitials(userName)}
                      </div>
                    )}
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">{userName}</span>
                    <span className="text-xs text-gray-500">{userRole}</span>
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {/* Profile Header in Dropdown */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt={userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                              {getInitials(userName)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{userName}</p>
                            <p className="text-xs text-gray-500">{userRole}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button 
                          onClick={handleViewProfile}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm">View Profile</span>
                        </button>
                        <button 
                          onClick={handleOpenSettings}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-sm">Settings</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close menu */}
        {showProfileMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </nav>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-center relative">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {/* Profile Image */}
                <div className="relative inline-block">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={userName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold text-2xl border-4 border-white shadow-lg mx-auto">
                      {getInitials(userName)}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></span>
                </div>
                
                <h2 className="text-xl font-bold text-white mt-4">{userName}</h2>
                <p className="text-primary-100 text-sm">{userRole}</p>
              </div>
              
              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                    <p className="font-semibold text-gray-900">{userRole}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date Joined</p>
                    <p className="font-semibold text-gray-900">{dateJoined}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Approved By</p>
                    <p className="font-semibold text-gray-900">{approvedBy}</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 pb-6">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Update Profile Image</h3>
                
                {/* Current Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={userName}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-gray-200">
                        {getInitials(userName)}
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{userName}</p>
                </div>

                {/* Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/png,image/jpeg,image/jpg" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload new image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex space-x-3 px-6 pb-6">
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DashboardNavbar

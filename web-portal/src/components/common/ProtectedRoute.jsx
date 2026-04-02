import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * ProtectedRoute - Protects dashboard routes from unauthorized access
 * 
 * Features:
 * - Checks for valid JWT token in localStorage
 * - Verifies user role matches allowed roles for the route
 * - Redirects to home page if not authenticated
 * - Shows loading state while checking authentication
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('herbaltrace_token')
        const userStr = localStorage.getItem('herbaltrace_user')

        if (!token || !userStr) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        
        // Check if token is expired (basic check - backend will validate properly)
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]))
          if (tokenPayload.exp && tokenPayload.exp * 1000 < Date.now()) {
            // Token expired - clear storage
            localStorage.removeItem('herbaltrace_token')
            localStorage.removeItem('herbaltrace_user')
            setIsAuthenticated(false)
            setIsLoading(false)
            return
          }
        } catch (e) {
          // If token parsing fails, let backend validate
          console.warn('Could not parse token for expiry check')
        }

        setIsAuthenticated(true)
        setUserRole(user.role)
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to home with message
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location, 
          message: 'Please sign in to access this page' 
        }} 
        replace 
      />
    )
  }

  // Check role-based access if allowedRoles specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have the right role
    // Redirect to their appropriate dashboard based on role
    const roleRoutes = {
      'Admin': '/admin',
      'Farmer': '/farmer',
      'Lab': '/laboratory',
      'Manufacturer': '/manufacturer',
      'Consumer': '/consumer',
      'Regulator': '/regulator'
    }
    
    const correctRoute = roleRoutes[userRole] || '/'
    
    return (
      <Navigate 
        to={correctRoute} 
        state={{ 
          message: `You don't have permission to access that page. Redirected to your dashboard.` 
        }} 
        replace 
      />
    )
  }

  // All checks passed - render the protected component
  return children
}

export default ProtectedRoute

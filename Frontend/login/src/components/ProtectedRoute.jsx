import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ authKey, redirectTo }) {
  const isAuthenticated = localStorage.getItem(authKey)

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

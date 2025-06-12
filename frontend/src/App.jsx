import { Routes, Route } from 'react-router-dom'
import NavBarComponent from './components/NavBarComponent'
import './App.css'
import Signup from './views/auth/Signup'
import Login from './views/auth/Login'
import Home from './views/Home'
import Logout from './views/auth/Logout'
import MenuHome from './views/menu/MenuHome'
import MenuAdd from './views/menu/MenuAdd'
import MenuEdit from './views/menu/MenuEdit'
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from './components/ToastContainer'
import MyReservations from './views/reservation/MyReservations'
import Profile from './views/profile/Profile'
import ChangePassword from './views/profile/ChangePassword'
import EditProfile from './views/profile/EditProfile'


function App() {

  return (
    <>
      <NavBarComponent />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/menu" element={<MenuHome />} />
        <Route path="/menu/create" element={
          <ProtectedRoute requiredRole={1}>
            <MenuAdd />
          </ProtectedRoute>
        } />
        <Route path="/my-reservations" element={
          <ProtectedRoute requiredRole={0}>
            <MyReservations />
          </ProtectedRoute>
        } />
        <Route path="/menu/edit/:id" element={
          <ProtectedRoute requiredRole={1}>
            <MenuEdit />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/update-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App

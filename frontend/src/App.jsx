import { Routes, Route } from 'react-router-dom'
import NavBarComponent from './components/NavBarComponent'
import './App.css'
import Signup from './views/auth/Signup'
import Login from './views/auth/Login'
import Home from './views/Home'
import Logout from './views/auth/Logout'
import MenuHome from './views/menu/MenuHome'

function App() {

  return (
    <>
      <NavBarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/menu" element={<MenuHome />} />
      </Routes>
    </>
  )
}

export default App

import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddShow from './pages/AddShow';
import { AuthProvider, RequireAuth } from 'react-auth-kit';
import { AnimatePresence } from "framer-motion";

function App() {

  const location = useLocation();

  return (
      <AuthProvider 
      authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <AnimatePresence>
      <Routes>
      <Route path ='/' element={<RequireAuth loginPath='/login'><Home /></RequireAuth>}/>
      <Route path ='/add' element={<RequireAuth loginPath='/login'><AddShow /></RequireAuth>}/>
      <Route path ='/login' element={<Login />}/>
      <Route path ='/signup' element={<Signup />}/>
    </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}

export default App

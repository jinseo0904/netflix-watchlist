import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import { AuthProvider, RequireAuth } from 'react-auth-kit';

function App() {

  return (
    <AuthProvider 
      authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <Routes>
      <Route path ='/' element={<RequireAuth loginPath='/login'><Home /></RequireAuth>}/>
      <Route path ='/login' element={<Login />}/>
    </Routes>
    </AuthProvider>
  )
}

export default App

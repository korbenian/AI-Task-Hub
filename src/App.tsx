import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import PageRegister from './pages/PageRegister'
import LogInPage from './pages/LogInPage'
function App () {
  return (
    <>
      <Routes>
        <Route path='/' element={<LogInPage />} />
        <Route path='/registerPage' element={<PageRegister />} />
        <Route path='/Home' element={<Home />} />
      </Routes>
    </>
  )
}

export default App

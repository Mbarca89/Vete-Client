import "./App.css"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import Landing from "./views/landing/Landing"
import Home from "./views/home/Home"
import NavBar from "./components/Nav/NavBar"
import Users from "./views/Users/Users"
import PrivateRoute from "./utils/PrivateRoutes"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { userState, logState } from "./app/store"
import { Toaster } from 'react-hot-toast';

const App = () => {
  let [isLogged, setLogged] = useRecoilState(logState)

  useEffect(() => {
    if (localStorage.getItem("userName")) {
      setLogged(true)
    }
  }, [])

  return (
    <div className="App align-items-center d-flex flex-column">
      <Toaster/>
      <Routes>
        <Route element={(
          <>
            <NavBar />
            <Outlet />
          </>
        )}>
          <Route path="/home" element={isLogged ? <Home /> : <Navigate to="/"/>} />
          <Route path="/users" element={isLogged ? <Users /> : <Navigate to="/"/>} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App

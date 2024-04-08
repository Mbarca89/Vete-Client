import "./App.css"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import Landing from "./views/landing/Landing"
import Home from "./views/home/Home"
import NavBar from "./components/Nav/NavBar"
import Users from "./views/Users/Users"
import Products from "./views/Products/Products"
import Providers from "./views/Providers/Providers"
import Clients from "./views/Clients/Clients"
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { logState } from "./app/store"
import { Toaster } from 'react-hot-toast';

const App = () => {
  let [isLogged, setLogged] = useRecoilState(logState)

  const [initialCheckDone, setInitialCheckDone] = useState(false); // State to track initial check completion

  useEffect(() => {
    if (!initialCheckDone) {
      if (localStorage.getItem("userName")) {
        setLogged(true);
      }
      setInitialCheckDone(true);
    }
  }, [initialCheckDone, setLogged]);
  if (!initialCheckDone) {
    return <div>Loading...</div>;
  }

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
          <Route path="/products" element={isLogged ? <Products /> : <Navigate to="/"/>} />
          <Route path="/providers" element={isLogged ? <Providers /> : <Navigate to="/"/>} />
          <Route path="/clients" element={isLogged ? <Clients /> : <Navigate to="/"/>} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App

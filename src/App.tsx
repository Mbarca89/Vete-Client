import "./App.css"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import Landing from "./views/landing/Landing"
import Home from "./views/home/Home"
import NavBar from "./components/Nav/NavBar"
import Users from "./views/Users/Users"
import Products from "./views/Products/Products"
import Providers from "./views/Providers/Providers"
import Clients from "./views/Clients/Clients"
import ClientDetail from "./components/ClientDetail/ClientDetail"
import Pets from "./views/Pets/Pets"
import PetDetail from "./components/PetDetail/PetDetail"
import Sale from "./views/Sale/Sale"
import Reports from "./views/Reports/Reports"
import Order from "./views/Order/Order"
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { logState, userState } from "./app/store"
import { Toaster } from 'react-hot-toast';

const App = () => {

  let [isLogged, setLogged] = useRecoilState(logState)
  const [user, setUser] = useRecoilState(userState)

  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    if (!initialCheckDone) {
      if (localStorage.getItem("userName")) {
        setLogged(true)
        setUser({
          name: localStorage.getItem("name") || "",
          surname: localStorage.getItem("surname") || "",
          id: localStorage.getItem("id") || "",
          userName: localStorage.getItem("userName") || "",
          role: localStorage.getItem("role") || ""
        })
      }
      setInitialCheckDone(true)
    }
  }, [initialCheckDone, setLogged])
  if (!initialCheckDone) {
    return <div>Loading...</div>
  }

  return (
    <div className="App align-items-center d-flex flex-column flex-grow-1" style={{height: "100vh"}}>
      <Toaster />
      <Routes>
        <Route element={(
          <>
            <NavBar />
            <Outlet />
          </>
        )}>
          <Route path="/home" element={isLogged ? <Home /> : <Navigate to="/" />} />
          <Route path="/users" element={isLogged ? <Users /> : <Navigate to="/" />} />
          <Route path="/products" element={isLogged ? <Products /> : <Navigate to="/" />} />
          <Route path="/providers" element={isLogged ? <Providers /> : <Navigate to="/" />} />
          <Route path="/clients" element={isLogged ? <Clients /> : <Navigate to="/" />} />
          <Route path="/clients/detail/:clientId" element={isLogged ? <ClientDetail /> : <Navigate to="/" />} />
          <Route path="/pets" element={isLogged ? <Pets /> : <Navigate to="/" />} />
          <Route path="/pets/detail/:petId" element={isLogged ? <PetDetail /> : <Navigate to="/" />} />
          <Route path="/sale" element={isLogged ? <Sale /> : <Navigate to="/" />} />
          <Route path="/reports" element={isLogged && user.role == "Administrador" ? <Reports /> : <Navigate to="/" />} />
          <Route path="/order" element={isLogged && user.role == "Administrador" ? <Order /> : <Navigate to="/" />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App

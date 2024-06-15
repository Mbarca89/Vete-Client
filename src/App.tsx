import "./App.css"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useState, useEffect, lazy, Suspense } from "react"
const Landing = lazy(() => import("./views/landing/Landing"))
const Home = lazy(() => import("./views/home/Home"))
const NavBar = lazy(() => import("./components/Nav/NavBar"))
const Users = lazy(() => import("./views/Users/Users"))
const Products = lazy(() => import("./views/Products/Products"))
const Providers = lazy(() => import("./views/Providers/Providers"))
const Clients = lazy(() => import("./views/Clients/Clients"))
const ClientDetail = lazy(() => import("./components/ClientDetail/ClientDetail"))
const Pets = lazy(() => import("./views/Pets/Pets"))
const PetReport = lazy(() => import("./views/PetReport/PetReport"))
const PetDetail = lazy(() => import("./components/PetDetail/PetDetail"))
const Sale = lazy(() => import("./views/Sale/Sale"))
const Reports = lazy(() => import("./views/Reports/Reports"))
const Graphs = lazy(() => import("./views/Graphs/Graphs"))
const Order = lazy(() => import("./views/Order/Order"))
const Payments = lazy(() => import("./views/Payments/Payments"))
const Wa = lazy(() => import("./views/Wa/Wa"))
const Billing = lazy(()=> import ("./views/Billing/Billing"))
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
    <div className="App align-items-center d-flex flex-column flex-grow-1" style={{ height: "100vh" }}>
      <Toaster />
      <Routes>
        <Route element={(
          <>
            <NavBar />
            <Suspense>
              <Outlet />
            </Suspense>
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
          <Route path="/petReports" element={isLogged ? <PetReport /> : <Navigate to="/" />} />
          <Route path="/reports" element={isLogged && user.role == "Administrador" ? <Reports /> : <Navigate to="/" />} />
          <Route path="/graphs" element={isLogged && user.role == "Administrador" ? <Graphs /> : <Navigate to="/" />} />
          <Route path="/order" element={isLogged && user.role == "Administrador" ? <Order /> : <Navigate to="/" />} />
          <Route path="/payments" element={isLogged && user.role == "Administrador" ? <Payments /> : <Navigate to="/" />} />
          <Route path="/billing" element={isLogged && user.role == "Administrador" ? <Billing /> : <Navigate to="/" />} />
          <Route path="/whatsapp" element={isLogged ? <Wa /> : <Navigate to="/" />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App

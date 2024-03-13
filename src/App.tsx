import "./App.css"
import { Routes, Route, Outlet } from "react-router-dom"
import Landing from "./views/landing/Landing"
import Home from "./views/home/Home"
import NavBar from "./components/Nav/NavBar"
import Users from "./components/Users/Users"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { userState } from "./app/store"

const App = () => {
  let isLogged: Boolean = false
  const [user, setUser] = useRecoilState(userState)

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      isLogged = true
      setUser({
        userName: localStorage.getItem("userName") || " ",
        role: localStorage.getItem("role") || "user"
      }
      )
    }
  }, [])


  return (
    <div className="App align-items-center d-flex flex-column">
      <Routes>
      <Route element={(
          <>
            <NavBar/>
            <Outlet/>
          </>
        )}>
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App

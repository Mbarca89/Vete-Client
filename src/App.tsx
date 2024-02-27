import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { Routes, Route } from "react-router-dom"
import "./views/landing/Landing"
import logo from "./logo.svg"
import Landing from "./views/landing/Landing"
import Home from "./views/home/Home"

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App

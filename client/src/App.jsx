import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

const App = () => {
  return (
    <>
      <Router>
        <div className="w-screen bg-neutral-950">
          <Routes>
            <Route path="/" Component={Home}/>
            <Route path="/login" Component={Login}/>
            <Route path="/register" Component={Register}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}
export default App
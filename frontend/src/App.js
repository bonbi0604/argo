// App.js
import React from "react"
import "./index.css"
import Footer from "./components/Footer"
import HeaderMenu from "./components/HeaderMenu"
import Navbar from "./components/Navbar"
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import Home from "./views/homePage"
import Login from "./views/loginPage"
import Register from "./views/registerPage"
import ProtectedPage from "./views/protectedPage"
import Chatbot from "./components/Chatbot"
import Chat from "./views/chat"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AuthProvider>
          <HeaderMenu />
          <Navbar />
          <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </AuthProvider>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  )
}


export default App

/* <PrivateRoute component={ProtectedPage} path="/protected" exact /> */
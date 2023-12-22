// App.js
import React from "react"
import "./index.css"
import "./App.css"
import Footer from "./components/Footer"
import HeaderMenu from "./components/HeaderMenu"
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom"
// import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import Home from "./views/homePage"
import Login from "./views/loginPage"
import Register from "./views/registerPage"
import ProtectedPage from "./views/protectedPage"
import Dashboard from "./views/Dashboard"

import CommunicationPage from "./views/CommunicationPage"

import LearningPage from "./views/learningPage"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AuthProvider>
          <HeaderMenu />
          <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Home />} />
            <Route path="/learn/communication" element={<CommunicationPage />} />
            <Route path="/learn" element={<LearningPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </Router>
  )
}


export default App

/* <PrivateRoute component={ProtectedPage} path="/protected" exact /> */
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
import FindId from "./views/find/findIdPage"
import FindPw from "./views/find/findPwPage"
import Dashboard from "./views/Dashboard"
import WritePost from './views/WritePost'
import Chatbot from "./components/Chatbot"
import Chat from "./views/chat"
import CommunicationPage from "./views/CommunicationPage"
import LearningPage from "./views/learningPage"
import EthicPage from "./views/ethicPage"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AuthProvider>
          <HeaderMenu />
          {/* <Navbar /> */}
          <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findPw" element={<FindPw />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/writepost" element={<WritePost />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/" element={<Home />} />
            <Route path="/learn/communication" element={<CommunicationPage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/learn/ethic" element={<EthicPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
        <Chatbot />
      </div>
    </Router>
  )
}


export default App

/* <PrivateRoute component={ProtectedPage} path="/protected" exact /> */
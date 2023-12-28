// App.js
import React, { useState } from "react";
import "./index.css";
import "./App.css";
import Footer from "./components/Footer";
import HeaderMenu from "./components/HeaderMenu";
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom";
// import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./views/homePage";
import Login from "./views/loginPage";
import Register from "./views/registerPage";
import ProtectedPage from "./views/protectedPage";
import FindId from "./views/find/findIdPage";
import FindPw from "./views/find/findPwPage";
import Dashboard from "./views/Dashboard";
import WritePost from './views/WritePost';
import Chatbot from "./components/Chatbot";
import Chat from "./views/chat";
import CommunicationPage from "./views/CommunicationPage";
import LearningPage from "./views/learningPage";
import LearnOtherPage from "./views/learnotherPage"
import EthicPage from "./views/ethicPage";

function App() {
  return (
    <Router>
      {/* <div className="flex flex-col min-h-screen overflow-hidden"> */}
      <div className="App">
        <AuthProvider>
          <HeaderMenu />
          {/* <Navbar /> */}
          <Routes>
            <Route path="/chat" element={<Chat />} />

            <Route path="/" element={<><Home /><Chatbot /></>} />
            <Route path="/login"  element={<><Login /><Chatbot /></>} />
            <Route path="/register" element={<><Register /><Chatbot /></>} />
            <Route path="/findId" element={<><FindId /><Chatbot /></>} />
            <Route path="/findPw" element={<><FindPw /><Chatbot /></>} />
            <Route path="/dashboard" element={<><Dashboard /><Chatbot /></>} />
            <Route path="/writepost" element={<><WritePost /><Chatbot /></>} />
            <Route path="/learn/communication" element={<><CommunicationPage /><Chatbot /></>} />
            <Route path="/learn" element={<><LearningPage /><Chatbot /></>} />
            <Route path="/learn/ethic" element={<><EthicPage /><Chatbot /></>} />
            <Route path="/learn/common-sense" element={<><LearnOtherPage /><Chatbot /></>} />
            {/* <Route path="/PostDetail/:id" element={<><PostDetail /><Chatbot /></>} />
            <Route path="/UpdatePost/:id/" element={<><UpdatePost /><Chatbot /></>} /> */}
          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </Router>
  )
}


export default App

/* <PrivateRoute component={ProtectedPage} path="/protected" exact /> */
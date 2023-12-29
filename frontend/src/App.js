// App.js
import React, { useState, useContext } from "react";
import "./index.css";
import "./App.css";
import Footer from "./components/Footer";
import HeaderMenu from "./components/HeaderMenu";
import { BrowserRouter as Router,  Routes,  Route} from "react-router-dom";
// import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext";
import { ChatbotProvider, ChatbotContext } from './context/ChatbotContext';
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
import LearnCommonSense from "./views/learn_other/learnCommonSense";
import LearnEthic from "./views/learn_other/learnEthic";
import LearnOccupation from "./views/learn_other/learnOccupation";
import LearnTools from "./views/learn_other/learnTools";
import MyPage from "./views/myPage";

function App() {
  return (
    <Router>
      <ChatbotProvider>
      {/* <div className="flex flex-col min-h-screen overflow-hidden"> */}
      <div className="App">
        <AuthProvider>
        
          <HeaderMenu />
          {/* <Navbar /> */}
          <Routes>
            {/* 챗봇이 안들어가는 페이지 */}
            <Route path="/chat" element={<Chat />} />

            {/* #챗봇이 들어가는 페이지 */}

            <Route path="/" element={<PageWithChatbot><Home /></PageWithChatbot>} />
            <Route path="/login" element={<PageWithChatbot><Login /></PageWithChatbot>} />
            <Route path="/register" element={<PageWithChatbot><Register /></PageWithChatbot>} />
            <Route path="/findId" element={<PageWithChatbot><FindId /></PageWithChatbot>} />
            <Route path="/findPw" element={<PageWithChatbot><FindPw /></PageWithChatbot>} />
            <Route path="/dashboard" element={<PageWithChatbot><Dashboard /></PageWithChatbot>} />
            <Route path="/writepost" element={<PageWithChatbot><WritePost /></PageWithChatbot>} />
            <Route path="/learn/communication" element={<PageWithChatbot><CommunicationPage /></PageWithChatbot>} />
            <Route path="/learn" element={<PageWithChatbot><LearningPage /></PageWithChatbot>} />
            <Route path="/learn/ethic" element={<PageWithChatbot><LearnEthic /></PageWithChatbot>} />
            {/* <Route path="/learn/commonsense" element={<><LearnCommonSense /><Chatbot /></>} />
            <Route path="/learn/occupation" element={<><LearnOccupation /><Chatbot /></>} />
            <Route path="/learn/tools" element={<><LearnTools /><Chatbot /></>} />

            <Route path="/profile" element={<><MyPage /><Chatbot /></>} /> */}

          </Routes>
          <Footer />
        </AuthProvider>
      </div>
      </ChatbotProvider>
    </Router>
  )
}

// 챗봇이 포함된 페이지를 래핑하는 컴포넌트
const PageWithChatbot = ({ children }) => {
  const { isChatbotExpanded } = useContext(ChatbotContext);

  const appStyle = isChatbotExpanded 
    ? { width: '85%', transition: 'width 0.3s' } // Adjust width instead of margin
    : { width: '100%', transition: 'width 0.3s' };

  return (
    <div style={appStyle}>
      {children}
      <Chatbot />
    </div>
  );
};

export default App

/* <PrivateRoute component={ProtectedPage} path="/protected" exact /> */
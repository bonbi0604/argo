import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderMenu from '../components/HeaderMenu';

const NoticeBoard = () => {
  const [selectedTab, setSelectedTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [posts, setPosts] = useState([]);

  // userToken을 컴포넌트 내부에서 가져옵니다.
  const userToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      const headers = {
        'Content-Type': 'application/json',
        // userToken이 있다면 Authorization 헤더에 추가합니다.
        ...(userToken && { 'Authorization': `Bearer ${userToken}` })
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/api/posts/', { headers });
        if (response.ok) {
          const data = await response.json();
          if (selectedTab === 'notices') {
            setNotices(data);
          } else {
            setPosts(data);
          }
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [selectedTab, userToken]); // userToken을 의존성 배열에 추가합니다.

  const dataToShow = selectedTab === 'notices' ? notices : posts;

  return (
    <div className="mt-6">
       {/* 탭 버튼들 */}
       <div className="tabs">
        <button onClick={() => setSelectedTab('notices')} className={selectedTab === 'notices' ? 'active' : ''}>
          공지사항
        </button>
        <button onClick={() => setSelectedTab('posts')} className={selectedTab === 'posts' ? 'active' : ''}>
          게시글
        </button>
      </div>
      {/* '글쓰기' 버튼 */}
      <div className="write-post-button-container">
        <Link to="/writepost" className="write-post-button">글쓰기</Link>
      </div>
      <div className="search-bar">
                <input type="text" placeholder="검색" className="search-input" />
                <button className="search-button">검색</button>
            </div>
            <div className="data-table">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">번호</th>
                            <th className="text-left p-4">제목</th>
                            <th className="text-left p-4">작성자</th>
                            <th className="text-left p-4">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((item) => (
                            <tr key={item.board_no} className="border-b hover:bg-gray-50">
                                <td className="p-4">{item.board_no}</td>
                                <td className="p-4">{item.title}</td>
                                <td className="p-4">{item.writer}</td>
                                <td className="p-4">{item.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </div>
  );
};

export default NoticeBoard;
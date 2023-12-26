import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios from "../utils/useAxios";

const NoticeBoard = () => {
  const [posts, setPosts] = useState([]); // 게시물 상태
  const [selectedTab, setSelectedTab] = useState('notices'); // 선택된 탭 상태
  const api = useAxios(); // 커스텀 Axios 훅을 사용하여 API 요청을 수행합니다.

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/noticeboard/posts/');
        
        if (response.status === 200) {
          setPosts(response.data); // 게시물 목록을 업데이트
        } else {
          // 실패 처리
        }
      } catch (error) {
        console.error('게시물 가져오기 오류', error);
      }
    };

    fetchPosts(); // 컴포넌트가 마운트될 때 게시물을 가져옵니다.
  }, [selectedTab]); // selectedTab을 의존성 배열에 추가

  const dataToShow = selectedTab === 'notices' ? posts : posts; // 필요에 따라 데이터를 조건에 따라 필터링합니다.


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
              <tr key={item.id}> {/* 게시글의 고유 ID를 key로 사용 */}
                <td className="p-4">{item.id}</td>
                <td className="p-4">{item.title}</td>
                <td className="p-4">{item.author_id}</td>
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
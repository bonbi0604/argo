import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from "../utils/useAxios";
import Pagination from "../components/Pagination";

const NoticeBoard = () => {
  const [items, setItems] = useState([]); // 공지사항 또는 게시글 목록
  const [posts, setPosts] = useState([]); // 게시물 상태
  const [selectedTab, setSelectedTab] = useState('notices'); // 선택된 탭 상태
  const api = useAxios(); // 커스텀 Axios 훅을 사용하여 API 요청을 수행합니다.
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 함수를 가져옵니다.

  useEffect(() => {
    // API request to retrieve data appropriate for the current page
    const offset = (currentPage - 1) * itemsPerPage;

    const fetchItems = async () => {
      const endpoint = selectedTab === 'notices' ? '/notices/' : '/posts/';
      try {
          const response = await api.get(`http://127.0.0.1:8000/noticeboard${endpoint}`);
          setItems(response.data);
      } catch (error) {
          console.error('Error fetching items', error);
      }
      };

      fetchItems();

    const fetchPosts = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/noticeboard/posts/?limit=${itemsPerPage}&offset=${offset}`);
        if (response.status === 200 && Array.isArray(response.data)) {
          // Reverse the order of the data
          const reversedPosts = [...response.data].reverse();
          setPosts(reversedPosts);
        } else {
          console.error('Data is not an array', response.data);
        }
      } catch (error) {
        console.error('Error retrieving post', error);
      }
    };
  
    fetchPosts();
  }, [currentPage, selectedTab, itemsPerPage]); // currentPage도 의존성 배열에 추가

  const dataToShow = selectedTab === 'notices' ? posts : posts; // 필요에 따라 데이터를 조건에 따라 필터링합니다.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedTab === 'notices' ? items : posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-6">
      {/* 탭 버튼들 */}
      <div className="tab-buttons">
          <button onClick={() => setSelectedTab('notices')}>공지사항</button>
          <button onClick={() => setSelectedTab('posts')}>게시글</button>
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
                        {currentItems.map((item) => (
                             <tr key={item.id} onClick={() => navigate(selectedTab === 'posts' ? `/PostDetail/${item.id}/` : `/NoticeDetail/${item.id}`)}>
                                <td className="p-4">{item.id}</td>
                                <td className="p-4">
                                    <Link to={selectedTab === 'posts' ? `/PostDetail/${item.id}/` : `/NoticeDetail/${item.id}`}>{item.title}</Link>
                                </td>
                                <td className="p-4">{item.author_id}</td>
                                <td className="p-4">{new Date(item.timestamp).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
      </div>
      {/* 페이지네이션 */}
      <Pagination
        totalItems={selectedTab === 'notices' ? items.length : posts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default NoticeBoard;
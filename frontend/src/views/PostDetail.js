import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";

const PostDetail = () => {
  const { id } = useParams(); // URL에서 게시글 ID를 가져옵니다.
  const [post, setPost] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const api = useAxios();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/noticeboard/posts/${id}/`);
        if (response.status === 200 && response.data) {
          // 데이터 구조에 맞게 수정
          setPost(response.data);
        } else {
          console.error('응답 오류:', response);
        }
      } catch (error) {
        console.error('게시물 가져오기 오류', error);
      }
    };
  
    fetchPost();
  }, []);

  const handleDelete = async () => {
    try {
      // Axios를 사용하여 DELETE 요청을 보냅니다.
      const response = await api.delete(`http://127.0.0.1:8000/noticeboard/posts/${id}/delete/`);
  
      // 응답 상태 코드가 성공적인 경우 (예: 200, 204)
      if (response.status === 200 || response.status === 204) {
        console.log("게시물이 성공적으로 삭제되었습니다.");
  
        // 게시물 삭제 후 다른 페이지로 이동하거나, 목록을 업데이트하는 로직을 추가할 수 있습니다.
        navigate('/DashBoard'); // 게시판 목록 페이지로 이동
      }
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생', error);
    }
  };

  const handleEdit = () => {
    navigate(`/UpdatePost/${id}/`); // 올바른 경로 이름으로 수정
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {user && user.id === post.author_id && (
        <div>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={handleEdit}>수정</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
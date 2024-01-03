import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]); // 댓글 목록 상태
    const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [editingComment, setEditingComment] = useState(null);
    const api = useAxios();

    useEffect(() => {
        const fetchPostAndComments = async () => {
          try {
            const response = await api.get(`http://127.0.0.1:8000/noticeboard/posts/${id}/`);
            if (response.status === 200 && response.data) {
              setPost(response.data);
              console.log(response.data);
            } else {
              console.error('응답 오류:', response);
            }
      
            const commentsResponse = await api.get(`http://127.0.0.1:8000/noticeboard/posts/${id}/comments/`);
            if (commentsResponse.status === 200 && commentsResponse.data) {
              setComments(commentsResponse.data);
            }
          } catch (error) {
            console.error('게시물 가져오기 오류', error);
          }
        };
      
        fetchPostAndComments();
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

      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
          const commentData = {
            content: newComment,
            board_no: id,  // 게시글 ID
            user_no: user.user_no,
            // user_no 필드는 백엔드에서 처리합니다. 따라서 여기에서는 제거합니다.
          };
      
          // 댓글 생성 API 엔드포인트를 호출합니다.
          const response = await api.post(`http://127.0.0.1:8000/noticeboard/posts/${id}/comments/`, commentData);
          if (response.status === 201) {
            setComments([...comments, response.data]);
            setNewComment('');
          }
        } catch (error) {
          console.error('댓글 작성 중 오류 발생', error.response ? error.response.data : error.message);
        }
      };

    const handleEdit = () => {
        navigate(`/UpdatePost/${id}/`); // 올바른 경로 이름으로 수정
      };

      // 댓글 삭제 핸들러
      const handleDeleteComment = async (commentId) => {
        try {
          const response = await api.delete(`http://127.0.0.1:8000/noticeboard/comments/${commentId}/delete/`);
          if (response.status === 200 || response.status === 204) {
            setComments(comments.filter(comment => comment.comm_no !== commentId));
          }
        } catch (error) {
          console.error('댓글 삭제 중 오류 발생', error);
        }
      };
    
    // 댓글 수정 핸들러
    const handleEditComment = (comment) => {
        setEditingComment({ id: comment.comm_no, content: comment.content });
      };

      const handleUpdateComment = async (commentId, content) => {
        try {
          const response = await api.put(`http://127.0.0.1:8000/noticeboard/comments/${commentId}/update/`, { content });
          if (response.status === 200) {
            // 댓글 목록에서 해당 댓글을 업데이트합니다.
            setComments(comments.map((comment) => {
              if (comment.comm_no === commentId) {
                return { ...comment, content };
              }
              return comment;
            }));
            // 수정 모드를 종료합니다.
            setEditingComment(null);
          }
        } catch (error) {
          console.error('댓글 수정 중 오류 발생', error);
        }
      };

  return (
    <div>
         {(user.user_no === post.user_no || user.is_admin) && (
        <button onClick={handleDelete}>삭제{post.author}</button>
        )}
        {user.user_no === post.user_no && (
         <button onClick={handleEdit}>수정</button>
        )}
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {/* 파일 다운로드 링크 추가 */}
      <div>
                {post.files && post.files.map((file, index) => (
                    <div key={index}>
                        <a href={file.src} download>{file.name}</a> {/* 파일 이름 표시 및 다운로드 링크 제공 */}
                    </div>
                ))}
            </div>

    {comments.map((comment) => (
    <div key={comment.comm_no} style={{ display: 'flex', alignItems: 'center' }}>
        {editingComment && editingComment.id === comment.comm_no ? (
        // 수정 모드 활성화
        <div>
            <input
            type="text"
            value={editingComment.content}
            onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
            />
            <button onClick={() => handleUpdateComment(editingComment.id, editingComment.content)}>수정 완료</button>
        </div>
        ) : (
        // 기본 댓글 표시
        <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <div style={{ marginRight: '10px' }}>{comment.content}</div>
            {user.user_no === comment.user_no && (
            <div>
                <button onClick={() => handleEditComment(comment)}>수정</button>
            </div>
            )}
             {(user.user_no === comment.user_no || user.is_admin) && (
                <button onClick={() => handleDeleteComment(comment.comm_no)}>삭제</button>
            )}
        </div>
            )}
        </div>
        ))}

      {/* 댓글 작성 폼 */}
      {user && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit">댓글 작성</button>
        </form>
      )}
      <div>
     
</div>
      
    </div>
  );
};

export default PostDetail;
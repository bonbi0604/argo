import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";

const WritePost = () => {
    const { user } = useContext(AuthContext); // 현재 로그인한 사용자 정보를 가져옵니다.
    const [title, setTitle] = useState(''); // 게시물 제목 상태
    const [content, setContent] = useState(''); // 게시물 내용 상태
    const navigate = useNavigate(); // React Router의 네비게이션 함수
    const api = useAxios(); // 커스텀 Axios 훅을 사용하여 API 요청을 수행합니다.

    // 게시물 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작을 막습니다.

        // 제목과 내용이 비어 있는지 확인
        if (!title.trim() || !content.trim()) {
            console.error("제목과 내용을 입력해야 합니다.");
            return;
        }

        // 새로운 게시물 데이터
        const newPost = {
            title,
            content,
            // author: user.id // 현재 사용자의 ID를 작성자로 설정
        };

        try {
            const response = await api.post('http://127.0.0.1:8000/noticeboard/posts/', newPost);

            if (response.status === 201 || response.status === 200) {
                navigate('/DashBoard'); // 게시물이 성공적으로 작성되면 게시판 페이지로 이동
            } else {
                // 다른 상태 코드를 처리할 수 있습니다.
            }
        } catch (error) {
            console.error('게시물 제출 중 오류 발생', error);
        }
    };

    return (
        <div className="write-post-page-background">
            <div className="write-post-container">
                <div className="write-post-form-container">
                    <h2 className="write-post-heading">새 게시물 작성</h2>
                    <form onSubmit={handleSubmit} className="write-post-form">
                        <div className="write-post-input-group">
                            <label htmlFor="postTitle" className="write-post-label">
                                제목
                            </label>
                            <input
                                type="text"
                                id="postTitle"
                                className="write-post-title-input"
                                placeholder="제목을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="write-post-input-group">
                            <label htmlFor="postContent" className="write-post-label">
                                내용
                            </label>
                            <textarea
                                id="postContent"
                                className="write-post-content-input"
                                placeholder="내용을 입력하세요"
                                rows="10"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                />
                        </div>
                        <div className="write-post-submit-group">
                            <button
                                type="submit"
                                className="write-post-submit-button"
                            >
                                작성 완료
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WritePost;
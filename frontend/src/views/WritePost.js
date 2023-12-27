import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트합니다.
import HeaderMenu from '../components/HeaderMenu';

const userToken = localStorage.getItem('token'); // 사용자 토큰을 로컬 스토리지에서 가져옵니다.

const WritePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate(); // useNavigate를 가져옵니다.

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, content };
      
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify(newPost)
            });
      
            if (response.ok) {
                console.log('Post created successfully!');
                navigate('/noticeboard', { replace: true });
                window.location.reload(); // 페이지를 새로고침하여 새 데이터를 반영합니다.
              } else {
                console.error('Failed to create post');
              }
            } catch (error) {
              console.error('Error submitting post', error);
            }
      };

    return (
        <div className="write-post-page-background">
            <div className="write-post-container">
                <HeaderMenu />
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
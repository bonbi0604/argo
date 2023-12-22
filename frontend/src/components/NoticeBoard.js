import React, { useState } from 'react';

const NoticeBoard = () => {
    const [selectedTab, setSelectedTab] = useState('notices'); // 선택된 탭 상태

    // 공지사항과 게시물 데이터
    const notices = [
        { board_no: 1, id: 1, title: '공지사항 1', content: '관리자가 작성한 공지사항입니다.', timestamp: '2023-12-25' },
        { board_no: 2, id: 2, title: '공지사항 2', content: '관리자가 작성한 공지사항입니다.', timestamp: '2023-12-26' },
        // ... 다른 공지 데이터
    ];

    const posts = [
        { board_no: 1, id: 3, title: '게시물 1', content: '사용자가 작성한 게시물입니다.', timestamp: '2023-12-27' },
        { board_no: 2, id: 4, title: '게시물 2', content: '사용자가 작성한 게시물입니다.', timestamp: '2023-12-28' },
        // ... 다른 게시글 데이터
    ];

    // 선택된 탭에 따라 데이터를 변경합니다.
    const dataToShow = selectedTab === 'notices' ? notices : posts;

    return (
        <div className="mt-6">
            <div className="tab-buttons">
                <button
                    className={`tab-button ${
                        selectedTab === 'notices' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedTab('notices')}
                >
                    공지사항
                </button>
                <button
                    className={`tab-button ${
                        selectedTab === 'posts' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedTab('posts')}
                >
                    게시물
                </button>
            </div>
            <button className="write-post">글쓰기</button>
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
                            <th className="text-left p-4">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((item) => (
                            <tr key={item.board_no} className="border-b hover:bg-gray-50">
                                <td className="p-4">{item.board_no}</td>
                                <td className="p-4">{item.title}</td>
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
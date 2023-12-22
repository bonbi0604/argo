import React, { useState, useEffect } from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    // 전체 페이지 수 계산
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    // 페이지 번호 배열 생성
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(i);
    }

    // 페이지 이동 핸들러
    const goToPage = (number) => {
        setCurrentPage(number);
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex gap-1">
                {/* 첫 페이지로 이동 */}
                <a onClick={() => goToPage(1)} className="pagination-link">«</a>
                {/* 이전 페이지로 이동 */}
                <a onClick={() => goToPage(Math.max(1, currentPage - 1))} className="pagination-link">‹</a>
                {/* 페이지 번호들 */}
                {pageNumbers.map(number => (
                    <a key={number} onClick={() => goToPage(number)} className={`pagination-link ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}>{number}</a>
                ))}
                {/* 다음 페이지로 이동 */}
                <a onClick={() => goToPage(Math.min(pageCount, currentPage + 1))} className="pagination-link">›</a>
                {/* 마지막 페이지로 이동 */}
                <a onClick={() => goToPage(pageCount)} className="pagination-link">»</a>
            </div>
        </div>
    );
};

export default Pagination;
import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import NoticeBoard from '../components/NoticeBoard';
import Pagination from '../components/Pagination';

const Dashboard = () => {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
                <HeaderMenu />
                <NoticeBoard />
            </div>
        </div>
    );
};

export default Dashboard;
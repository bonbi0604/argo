import React from 'react';
import NoticeBoard from '../components/NoticeBoard';
import Pagination from '../components/Pagination';
import "./Dashboard.css"

const Dashboard = () => {
    return (
        <section className='dashboard_div'>
            <div className='noticeboard_div'>
                {/* <HeaderMenu /> */}
                <NoticeBoard />
            </div>
        </section>
    );
};

export default Dashboard;
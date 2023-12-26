import React from 'react';
import './ethicPage.css'; // CSS 파일 임포트

const EthicPage = () => {
    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <h1 className="header-title">header</h1>
                <div className="search-box">
                    <input type="text" className="search-input" placeholder="search box" />
                    <button className="search-button">search</button>
                </div>
            </header>

            {/* Main content */}
            <main className="main-content">
                {/* Question section */}
                <section className="question-section">
                    <div className="question-block">
                        <p className="incorrect-note">Incorrect answer note</p>
                        <h2 className="question-title">135. where is the country fight with russia?</h2>
                        <div className="answer-block">
                            <p className="answer-text">answer: Ukraine</p>
                            <p className="input-text">input: Uzbekistan</p>
                            <p className="correct-rate">Correct rate: 86%</p>
                        </div>
                    </div>
                    <div className="pagination">
                        <button className="pagination-button">prev</button>
                        <div>
                            {[1, 2, 3, 4, 5].map(num => (
                                <button key={num} className={`pagination-button ${num === 1 ? 'active' : ''}`}>{num}</button>
                            ))}
                        </div>
                        <button className="pagination-button">next</button>
                    </div>
                </section>

                {/* Other questions section */}
                <aside className="other-questions">
                    <h3 className="other-questions-title">other question</h3>
                    <ul className="questions-list">
                        {[1, 2, 3, 4].map(num => (
                            <li key={num} className="question-item"><a href="#" className="question-link">12{num + 4}. title {num} (link)</a></li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
};

export default EthicPage;

import React from 'react';
import './ethicPage.css'; // CSS 파일 임포트

const EthicPage = () => {
    return (
        <div className="container mx-auto px-4 bg-gray-50 font-sans font-normal text-gray-800">
            {/* Header */}
            <header className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-semibold">header</h1>
                <div className="relative">
                    <input type="text" className="border border-gray-300 rounded-md py-2 px-4" placeholder="search box" />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">search</button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex justify-between">
                {/* Question section */}
                <section className="w-2/3">
                    <div className="mb-4">
                        <p className="text-red-500">Incorrect answer note</p>
                        <h2 className="text-xl font-semibold mb-2">135. where is the country fight with russia?</h2>
                        <div className="border border-gray-300 rounded-md p-4">
                            <p className="mb-2">answer: Ukraine</p>
                            <p className="mb-2">input: Uzbekistan</p>
                            <p>Correct rate: 86%</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button className="border border-gray-300 rounded-md px-4 py-2">prev</button>
                        <div>
                            {/* Pagination buttons */}
                            {[1, 2, 3, 4, 5].map(num => (
                                <button key={num} className={`border border-gray-300 rounded-md px-4 py-2 mr-1 ${num === 1 ? 'pagination-active' : ''}`}>{num}</button>
                            ))}
                        </div>
                        <button className="border border-gray-300 rounded-md px-4 py-2">next</button>
                    </div>
                </section>

                {/* Other questions section */}
                <aside className="w-1/3 pl-4">
                    <h3 className="text-lg font-semibold mb-2">other question</h3>
                    <ul>
                        {/* Links */}
                        {[1, 2, 3, 4].map(num => (
                            <li key={num} className="mb-2"><a href="#" className="link-style">12{num + 4}. title {num} (link)</a></li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
};

export default EthicPage;

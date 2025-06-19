'use client';
import React from 'react';

interface PageNavigationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-lg shadow-md bg-white">
                {/* Previous Button */}
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`py-3 px-5 border border-gray-200 bg-white rounded-l-lg text-gray-700 font-medium transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                >
                    Trước
                </button>

                {/* Page Numbers */}
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`py-3 px-5 border-t border-b border-gray-200 font-medium transition duration-200 ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`py-3 px-5 border border-gray-200 bg-white rounded-r-lg text-gray-700 font-medium transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                >
                    Tiếp
                </button>
            </nav>
        </div>
    );
};

export default PageNavigation;
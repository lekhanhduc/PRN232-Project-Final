'use client'
import React from 'react';

interface TabContentProps {
    children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
    return (
        <div className="p-8">
            {children}
        </div>
    );
};
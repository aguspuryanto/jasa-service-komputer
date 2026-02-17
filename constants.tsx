
import React from 'react';

export const BRANDS = ['Asus', 'Lenovo', 'Acer', 'HP', 'Dell', 'Apple'];

export const CATEGORIES = [
  { 
    id: 'Laptop', 
    title: 'Laptop', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20.25a.75.75 0 01-1.5 0l-.75-3.25m11.25 0l-.75 3.25a.75.75 0 01-1.5 0L14.25 17m-4.5 0h4.5m-4.5 0a1.125 1.125 0 01-1.125-1.125V4.125c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v11.75c0 .621-.504 1.125-1.125 1.125m-4.5 0h4.5" />
      </svg>
    )
  },
  { 
    id: 'Printer', 
    title: 'Printer', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z" />
      </svg>
    )
  },
  { 
    id: 'Komputer', 
    title: 'Komputer', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    )
  },
];

export const MOCK_PROMOS = [
  { id: 1, title: 'Diskon 20%', subtitle: 'Servis Laptop Pertama', color: 'bg-blue-600' },
  { id: 2, title: 'Cek Gratis', subtitle: 'Hingga Akhir Bulan', color: 'bg-indigo-600' },
];

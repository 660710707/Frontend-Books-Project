import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Books from './pages/Books';
import About from './pages/About';
import BookDetail from './pages/BookDetail';
import NotFound from './pages/NotFound';
import Playground from './pages/Playground';
import Wishlist from './pages/Wishlist';

import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  // 1. สร้าง State สำหรับเก็บรายการโปรด และเซฟลง localStorage อัตโนมัติ
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist_data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist_data', JSON.stringify(wishlist));
  }, [wishlist]);

  // 2. ฟังก์ชันเพิ่ม/ลบหนังสือออกจากรายการโปรด
  const handleToggleWishlist = (bookOrId) => {
    setWishlist((prev) => {
      const targetId = typeof bookOrId === 'object' ? (bookOrId.id || bookOrId.isbn) : bookOrId;
      
      const exists = prev.some((item) => {
        const itemId = typeof item === 'object' ? (item.id || item.isbn) : item;
        return String(itemId) === String(targetId);
      });

      if (exists) {
        // ถ้ามีอยู่แล้วให้เอาออก
        return prev.filter((item) => {
          const itemId = typeof item === 'object' ? (item.id || item.isbn) : item;
          return String(itemId) !== String(targetId);
        });
      } else {
        // ถ้ายังไม่มีและส่งมาเป็น Object ให้เพิ่มเข้าไป
        if (typeof bookOrId === 'object') {
          return [...prev, bookOrId];
        }
        return prev;
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* ส่งจำนวน wishlist ไปแสดงที่ Navbar */}
      <Navbar wishlistCount={wishlist.length} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about" element={<About />} />
          
          {/* ส่ง props ไปที่หน้า BookDetail */}
          <Route 
            path="/books/:id" 
            element={
              <BookDetail 
                wishlist={wishlist} 
                onToggleWishlist={handleToggleWishlist} 
              />
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/playground" element={<Playground />} />
          
          {/* ส่ง props ไปที่หน้า Wishlist */}
          <Route 
            path="/wishlist" 
            element={
              <Wishlist 
                wishlist={wishlist} 
                onToggleWishlist={handleToggleWishlist} 
              />
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
        
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
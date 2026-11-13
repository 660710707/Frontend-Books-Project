
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

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
import Admin from './pages/Admin';

function AdminRoute() {
  const { member, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (member?.role !== 'admin') {
    return <Home />;
  }

  return <Admin />;
}

function AppContent() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist_data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist_data', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (bookOrId) => {
    setWishlist((prev) => {
      const targetId =
        typeof bookOrId === 'object'
          ? (bookOrId.id || bookOrId.isbn)
          : bookOrId;

      const exists = prev.some((item) => {
        const itemId =
          typeof item === 'object'
            ? (item.id || item.isbn)
            : item;

        return String(itemId) === String(targetId);
      });

      if (exists) {
        return prev.filter((item) => {
          const itemId =
            typeof item === 'object'
              ? (item.id || item.isbn)
              : item;

          return String(itemId) !== String(targetId);
        });
      }

      if (typeof bookOrId === 'object' && bookOrId !== null) {
        return [...prev, bookOrId];
      }

      return prev;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar wishlistCount={wishlist.length} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about" element={<About />} />

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

          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />

          <Route path="/admin" element={<AdminRoute />} />

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

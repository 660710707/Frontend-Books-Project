import React from 'react';
import { Link } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';

function Wishlist({ books = [], wishlist = [], onToggleWishlist }) {
  // แปลงรายการใน wishlist ให้เป็น Object หนังสือที่พร้อมแสดงผล
  const savedBooks = wishlist
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        return item;
      }
      return books.find((b) => String(b.id || b.isbn) === String(item));
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F2F7F4] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F6E] bg-emerald-50 px-3 py-1 rounded-full">
              MY WISHLIST
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              รายการหนังสือโปรดของฉัน ({savedBooks.length})
            </h1>
          </div>

          <Link
            to="/books"
            className="inline-flex items-center justify-center rounded-full bg-[#0E9F6E] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + ค้นหาหนังสือเพิ่ม
          </Link>
        </div>

        {/* รายการการ์ดหนังสือ */}
        {savedBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-emerald-100/80">
            <p className="text-5xl">📚</p>
            <h2 className="mt-4 text-xl font-bold text-slate-800">
              ยังไม่มีหนังสือในรายการโปรด
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              ลองเลือกดูหนังสือที่น่าสนใจแล้วกดปุ่มหัวใจเพื่อบันทึกไว้ที่นี่ได้เลย
            </p>
            <Link
              to="/books"
              className="mt-6 inline-block rounded-full bg-[#0E9F6E] px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              ไปหน้าหนังสือทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedBooks.map((book) => (
              <WishlistCard
                key={book.id || book.isbn}
                book={book}
                onRemove={() => onToggleWishlist && onToggleWishlist(book)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;
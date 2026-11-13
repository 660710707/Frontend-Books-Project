import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getBook } from '../api/backend';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext'; // 1. นำเข้า useAuth

function BookDetail({ wishlist = [], onToggleWishlist, onAddReview }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, member } = useAuth(); // 2. ดึงสถานะการเข้าสู่ระบบ

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError('');

        const data = await getBook(id);

        if (isMounted) {
          setBook(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || 'ไม่สามารถโหลดรายละเอียดหนังสือได้'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef5f0] px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          กำลังโหลดรายละเอียดหนังสือ...
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#eef5f0] px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-2xl">📚</p>

          <h2 className="mt-3 text-xl font-bold text-slate-800">
            ไม่พบหนังสือเล่มนี้
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || 'ไม่พบข้อมูลหนังสือที่ต้องการ'}
          </p>

          <Link
            to="/books"
            className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            ← กลับไปหน้าหนังสือทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  // ฟังก์ชันกลางเช็คว่าเป็นหนังสือเล่มเดียวกันหรือไม่
  const isSameBook = (item1, item2) => {
    if (!item1 || !item2) return false;
    const getCode = (x) => {
      if (typeof x === 'object' && x !== null) {
        return String(x.isbn || x.id || x._id || '');
      }
      return String(x);
    };
    const code1 = getCode(item1);
    const code2 = getCode(item2);
    return code1 !== '' && code2 !== '' && code1 === code2;
  };

  const isWishlisted = wishlist.some((item) => isSameBook(item, book));
  const reviewsList = book.reviews || [];

  const bookCover = book.isbn 
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : (book.poster || book.imageUrl || book.imageUrlM || book.imageUrlS || book.cover || book.image || book.thumbnail);

  // ฟังก์ชันกดเพิ่ม/ลบ Wishlist (เช็คสิทธิ์ Login)
  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มหนังสือลงในรายการโปรด');
      navigate('/login');
      return;
    }
    if (onToggleWishlist && book) {
      onToggleWishlist(book);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef5f0] px-4 py-10 text-slate-800 sm:px-6">
      <main className="mx-auto max-w-5xl">

        {/* Back Button */}
        <Link
          to="/books"
          className="mb-6 inline-flex items-center text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
        >
          ← กลับไปหน้าหนังสือทั้งหมด
        </Link>

        {/* Book Information */}
        <section className="grid gap-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-10 md:grid-cols-[280px_1fr]">

          {/* Book Cover */}
          <div className="flex justify-center">
            <div className="flex aspect-[2/3] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#eef5f0] p-4">
              {bookCover ? (
                <img
                  src={bookCover}
                  alt={`ปกหนังสือ ${book.title}`}
                  className="h-full w-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center text-slate-400">
                  <p className="text-6xl">📚</p>
                  <p className="mt-3 text-sm">
                    ไม่มีรูปปกหนังสือ
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-emerald-700">
              MOONY BOOKS
            </p>

            <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
              {book.title}
            </h1>

            <p className="mt-3 text-base text-slate-600">
              โดย {book.author || 'ไม่ระบุผู้แต่ง'}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#dcebe1] px-4 py-2 text-xs font-medium text-emerald-800">
                ปีที่พิมพ์: {book.year || 'ไม่ระบุ'}
              </span>

              {book.publisher && (
                <span className="rounded-full bg-[#dcebe1] px-4 py-2 text-xs font-medium text-emerald-800">
                  {book.publisher}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-amber-400">★</span>

              <span className="font-semibold">
                {Number(book.rating || 0).toFixed(2)}
              </span>

              <span className="text-sm text-slate-400">
                ({book.ratingCount || reviewsList.length || 0} ratings)
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              ISBN: {book.isbn || 'N/A'}
            </p>

            {/* ปุ่มเพิ่ม/ลบรายการโปรด (ตรวจสอบสิทธิ์ Login) */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`rounded-full px-6 py-3 text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm w-fit ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
              >
                <span>{isWishlisted ? '❤️ อยู่ในรายการโปรดแล้ว' : '🤍 เพิ่มลงรายการโปรด'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ส่วนฟอร์มรีวิว และ รายการรีวิว */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ซ้าย: ฟอร์มเขียนรีวิว (เช็คสิทธิ์ ถ้ายังไม่ล็อกอินให้แสดงกล่องชวนเข้าสู่ระบบ) */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <ReviewForm 
                bookId={book.id || book.isbn} 
                onAddReview={onAddReview} 
                currentUser={member?.displayName || member?.name || member?.email}
              />
            ) : (
              <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm text-center space-y-4">
                <p className="text-3xl">🔒</p>
                <h3 className="font-bold text-slate-800">ต้องการเขียนรีวิวใช่ไหม?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็นและให้คะแนนหนังสือเล่มนี้
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full rounded-full bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>

          {/* ขวา: รายการรีวิวจากชุมชน */}
          <div className="lg:col-span-2 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              รีวิวจากชุมชนนักอ่าน ({reviewsList.length})
            </h2>

            {reviewsList.length === 0 ? (
              <div className="text-center py-10 bg-[#eef5f0] rounded-2xl">
                <p className="text-sm font-medium text-slate-600">
                  ยังไม่มีรีวิวสำหรับหนังสือเล่มนี้
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  มาเป็นคนแรกที่แบ่งปันความรู้สึกกันได้เลย!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id || Math.random()}
                    className="p-4 rounded-2xl bg-[#eef5f0]/60 border border-emerald-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                          {rev.user ? rev.user.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{rev.user || 'นักอ่านทั่วไป'}</p>
                          <p className="text-[11px] text-slate-400">{rev.date || 'เร็วๆ นี้'}</p>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-amber-500 border border-amber-100">
                        {'★'.repeat(rev.rating || 5)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>

            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-700">
                ABOUT THIS BOOK
              </p>

              <h2 className="mt-1 text-xl font-bold">
                เรื่องย่อ
              </h2>
            </div>
          </div>

          {book.description ? (
            <div className="mt-6">
              <p className="whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                {book.description}
              </p>

              {book.descriptionSource && (
                <p className="mt-6 border-t border-emerald-50 pt-4 text-xs text-slate-400">
                  แหล่งข้อมูล:{' '}

                  {book.descriptionURL ? (
                    <a
                      href={book.descriptionURL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-700 underline hover:text-emerald-900"
                    >
                      {book.descriptionSource}
                    </a>
                  ) : (
                    book.descriptionSource
                  )}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[#eef5f0] p-6 text-center">
              <p className="text-3xl">🌱</p>

              <p className="mt-3 font-semibold text-slate-700">
                ยังไม่มีเรื่องย่อของหนังสือเล่มนี้
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                ขออภัย เราค้นหาข้อมูลจากแหล่งหนังสือที่เชื่อมต่อแล้ว
                แต่ยังไม่พบเรื่องย่อของหนังสือเล่มนี้
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default BookDetail;
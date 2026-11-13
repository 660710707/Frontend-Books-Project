import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBook } from '../api/backend';

function BookDetail() {
  const { id } = useParams();

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
              {book.poster ? (
                <img
                  src={book.poster}
                  alt={`ปกหนังสือ ${book.title}`}
                  className="h-full w-full object-contain"
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
                ({book.ratingCount || 0} ratings)
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              ISBN: {book.isbn}
            </p>
          </div>
        </section>

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
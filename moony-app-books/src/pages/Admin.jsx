
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../api/backend';

import {
  getAdminStats,
  getAdminMembers,
  updateMemberRole,
  createAdminBook,
  updateAdminBook,
  deleteAdminBook,
  getAdminBook,
} from '../api/admin';

const emptyBook = {
  isbn: '',
  title: '',
  author: '',
  year: '',
  publisher: '',
  description: '',
  imageUrlS: '',
  imageUrlM: '',
  imageUrl: '',
};

const tabs = [
  { id: 'dashboard', label: 'ภาพรวม', icon: '📊' },
  { id: 'books', label: 'จัดการหนังสือ', icon: '📚' },
  { id: 'members', label: 'จัดการสมาชิก', icon: '👥' },
];

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-emerald-800">
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

function Admin() {
  const { member, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showBookForm, setShowBookForm] = useState(false);
  const [editingISBN, setEditingISBN] = useState(null);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [bookSearch, setBookSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || member?.role !== 'admin') {
      return;
    }

    loadCurrentTab('dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, member?.role]);

  async function loadDashboard() {
    const data = await getAdminStats();
    setStats(data);
  }

  async function loadMembers() {
    const data = await getAdminMembers();
    setMembers(data);
  }

  async function loadBooks() {
    const data = await getBooks();
    setBooks(data);
  }

  async function loadCurrentTab(tab) {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (tab === 'dashboard') {
        await loadDashboard();
      } else if (tab === 'members') {
        await loadMembers();
      } else if (tab === 'books') {
        await loadBooks();
      }
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (member?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  function changeTab(tab) {
    setActiveTab(tab);
    loadCurrentTab(tab);
  }

  function openAddBook() {
    setEditingISBN(null);
    setBookForm(emptyBook);
    setShowBookForm(true);
    setError('');
    setSuccess('');
  }

  async function openEditBook(isbn) {
    setError('');
    setSuccess('');

    try {
      const book = await getAdminBook(isbn);

      setEditingISBN(isbn);
      setBookForm({
        isbn: book.isbn || isbn,
        title: book.title || '',
        author: book.author || '',
        year: book.year || '',
        publisher: book.publisher || '',
        description: book.description || '',
        imageUrlS: book.imageUrlS || '',
        imageUrlM: book.imageUrlM || '',
        imageUrl: book.imageUrl || '',
      });

      setShowBookForm(true);
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดรายละเอียดหนังสือได้');
    }
  }

  function handleBookInput(event) {
    const { name, value } = event.target;

    setBookForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleBookSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      year: bookForm.year.trim(),
      publisher: bookForm.publisher.trim(),
      description: bookForm.description.trim(),
      imageUrlS: bookForm.imageUrlS.trim(),
      imageUrlM: bookForm.imageUrlM.trim(),
      imageUrl: bookForm.imageUrl.trim(),
    };

    try {
      if (editingISBN) {
        await updateAdminBook(editingISBN, payload);
        setSuccess('แก้ไขข้อมูลหนังสือเรียบร้อยแล้ว');
      } else {
        await createAdminBook({
          isbn: bookForm.isbn.trim(),
          ...payload,
        });
        setSuccess('เพิ่มหนังสือเรียบร้อยแล้ว');
      }

      setShowBookForm(false);
      setBookForm(emptyBook);
      setEditingISBN(null);

      await loadBooks();
    } catch (err) {
      setError(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBook(isbn, title) {
    const confirmed = window.confirm(
      `ต้องการลบหนังสือ "${title}" ใช่หรือไม่?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await deleteAdminBook(isbn);
      setSuccess('ลบหนังสือเรียบร้อยแล้ว');
      await loadBooks();
    } catch (err) {
      setError(err.message || 'ลบหนังสือไม่สำเร็จ');
    }
  }

  async function handleRoleChange(id, role) {
    setError('');
    setSuccess('');

    try {
      await updateMemberRole(id, role);
      setSuccess('เปลี่ยนสิทธิ์สมาชิกเรียบร้อยแล้ว');
      await loadMembers();
    } catch (err) {
      setError(err.message || 'เปลี่ยนสิทธิ์ไม่สำเร็จ');
    }
  }

  const filteredBooks = books.filter((book) => {
    const keyword = bookSearch.trim().toLowerCase();

    if (!keyword) return true;

    return [book.title, book.author, book.isbn]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  return (
    <div className="min-h-screen bg-[#eef5f0] text-slate-800">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-emerald-700">
              BOOKHUB MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold text-emerald-950">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              ยินดีต้อนรับ, {member?.displayName || member?.email || 'Admin'}
            </p>
          </div>

          <div className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700">
            🛡️ Administrator
          </div>
        </div>

        <div className="mb-7 flex flex-wrap gap-2 rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => changeTab(tab.id)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <section>
                <h2 className="mb-5 text-xl font-bold text-slate-800">
                  ภาพรวมระบบ
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <StatCard icon="📚" label="หนังสือทั้งหมด" value={stats?.books} />
                  <StatCard icon="👥" label="สมาชิกทั้งหมด" value={stats?.members} />
                  <StatCard icon="🛡️" label="ผู้ดูแลระบบ" value={stats?.admins} />
                  <StatCard icon="⭐" label="คะแนนโหวต" value={stats?.votes} />
                  <StatCard icon="❤️" label="รายการ Wishlist" value={stats?.wishlistItems} />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold">สมาชิกใหม่ล่าสุด</h3>

                    {stats?.newestMembers?.length ? (
                      <div className="space-y-3">
                        {stats.newestMembers.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {item.displayName || 'ไม่ระบุชื่อ'}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {item.email}
                              </p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {item.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">ยังไม่มีข้อมูลสมาชิก</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold">หนังสือยอดนิยม</h3>

                    {stats?.topVoted?.length ? (
                      <div className="space-y-4">
                        {stats.topVoted.map((item) => (
                          <div
                            key={item.isbn}
                            className="flex items-center gap-4 border-b border-slate-100 pb-3 last:border-0"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-16 w-12 rounded-lg object-contain"
                              />
                            ) : (
                              <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-emerald-50">
                                📕
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 font-semibold">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                ⭐ {Number(item.voteAverage || 0).toFixed(1)}
                                {' · '}
                                {item.voteCount || 0} คะแนน
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">ยังไม่มีข้อมูลการโหวต</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'books' && (
              <section>
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-bold">จัดการหนังสือ</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      หนังสือทั้งหมด {books.length} เล่ม
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddBook}
                    className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    + เพิ่มหนังสือ
                  </button>
                </div>

                <input
                  type="text"
                  value={bookSearch}
                  onChange={(event) => setBookSearch(event.target.value)}
                  placeholder="ค้นหาชื่อหนังสือ ผู้แต่ง หรือ ISBN..."
                  className="mb-5 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 sm:max-w-md"
                />

                {showBookForm && (
                  <form
                    onSubmit={handleBookSubmit}
                    className="mb-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="mb-5 text-lg font-bold">
                      {editingISBN ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        { name: 'isbn', label: 'ISBN', required: true },
                        { name: 'title', label: 'ชื่อหนังสือ', required: true },
                        { name: 'author', label: 'ผู้แต่ง' },
                        { name: 'year', label: 'ปีที่พิมพ์' },
                        { name: 'publisher', label: 'สำนักพิมพ์' },
                        { name: 'imageUrlS', label: 'URL รูปปกขนาดเล็ก' },
                        { name: 'imageUrlM', label: 'URL รูปปกขนาดกลาง' },
                        { name: 'imageUrl', label: 'URL รูปปกหลัก' },
                      ].map((field) => (
                        <label key={field.name} className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">
                            {field.label}
                          </span>
                          <input
                            name={field.name}
                            value={bookForm[field.name]}
                            onChange={handleBookInput}
                            required={field.required}
                            disabled={field.name === 'isbn' && Boolean(editingISBN)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-100"
                          />
                        </label>
                      ))}
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">
                        เนื้อเรื่องย่อ
                      </span>
                      <textarea
                        name="description"
                        value={bookForm.description}
                        onChange={handleBookInput}
                        rows={6}
                        placeholder="เขียนเนื้อเรื่องย่อของหนังสือที่นี่..."
                        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-emerald-500"
                      />
                      <span className="mt-1 block text-xs text-slate-400">
                        สามารถเว้นบรรทัดเพื่อแบ่งย่อหน้าได้
                      </span>
                    </label>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowBookForm(false)}
                        className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                  {filteredBooks.length ? (
                    <div className="divide-y divide-slate-100">
                      {filteredBooks.map((book) => (
                        <div
                          key={book.isbn}
                          className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                        >
                          {book.poster ? (
                            <img
                              src={book.poster}
                              alt={book.title}
                              className="h-20 w-14 rounded-lg object-contain"
                            />
                          ) : (
                            <div className="flex h-20 w-14 items-center justify-center rounded-lg bg-emerald-50">
                              📕
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-bold">{book.title}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {book.author || 'ไม่ระบุผู้แต่ง'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ISBN: {book.isbn}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditBook(book.isbn)}
                              className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              แก้ไข
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book.isbn, book.title)}
                              className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-8 text-center text-sm text-slate-400">
                      ไม่พบหนังสือ
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'members' && (
              <section>
                <div className="mb-5">
                  <h2 className="text-xl font-bold">จัดการสมาชิก</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    สมาชิกทั้งหมด {members.length} คน
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                  {members.length ? (
                    <div className="divide-y divide-slate-100">
                      {members.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-bold">
                              {item.displayName || 'ไม่ระบุชื่อ'}
                            </p>
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {item.email}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID: {item.id}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.role}
                            </span>

                            <select
                              value={item.role}
                              disabled={item.id === member?.id}
                              onChange={(event) =>
                                handleRoleChange(item.id, event.target.value)
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-8 text-center text-sm text-slate-400">
                      ยังไม่มีข้อมูลสมาชิก
                    </p>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  หมายเหตุ: ไม่สามารถเปลี่ยนสิทธิ์ของบัญชี Admin ที่กำลังใช้งานอยู่ได้
                </p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Admin;

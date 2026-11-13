
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const successMessage = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden bg-[#F3FBE9] px-4 py-12">

      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-[#DCEEDB] shadow-xl shadow-emerald-900/10">

        <div className="grid min-h-[610px] md:grid-cols-2">

          {/* Illustration */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#DCEEDB] px-8 py-12 text-center">

            <div className="absolute left-8 top-8 text-4xl">
              ✨
            </div>

            <div className="absolute right-8 top-12 text-3xl">
              🌿
            </div>

            

            <h1 className="text-4xl font-bold text-emerald-900">
              Welcome Back!
            </h1>

            <p className="mt-4 max-w-xs text-lg text-emerald-800">
              กลับมาค้นพบหนังสือเล่มโปรด
              และเรื่องราวดี ๆ ไปด้วยกันนะ
            </p>

            <div className="mt-10 flex items-end gap-3 text-5xl">
              📖 🌷 📗
            </div>

            <div className="absolute bottom-5 left-5 text-3xl">
              ⭐
            </div>

            <div className="absolute bottom-8 right-8 text-3xl">
              💚
            </div>
          </div>

          {/* Login Form */}
          <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">

            <div className="w-full max-w-md">

              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-emerald-900">
                  Login
                </h2>

                <p className="mt-2 text-slate-500">
                  เข้าสู่ระบบเพื่อใช้งาน BookHub
                </p>
              </div>

              {successMessage && (
                <div className="mb-5 rounded-2xl bg-emerald-50 p-3 text-center text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                    <span className="text-xl">✉️</span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                    <span className="text-xl">🔒</span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-emerald-700"
                      aria-label="แสดงหรือซ่อนรหัสผ่าน"
                    >
                      {showPassword ? 'ซ่อน' : 'แสดง'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-emerald-600 py-4 font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
                </button>

              </form>

              <div className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  ยังไม่มีบัญชีใช่ไหม?
                </p>

                <Link
                  to="/register"
                  className="mt-2 inline-block font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  สมัครสมาชิก BookHub
                </Link>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-sm text-slate-400 hover:text-emerald-700"
                >
                  ← กลับหน้าแรก
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

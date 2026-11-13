
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerMember } from '../api/backend';

function Register() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      await registerMember({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });

      navigate('/login', {
        replace: true,
        state: {
          message: 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ',
        },
      });
    } catch (err) {
      setError(err.message || 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden bg-[#F3FBE9] px-4 py-12">

      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-xl shadow-emerald-900/10 md:grid-cols-2">

        {/* Illustration */}
        <div className="flex flex-col items-center justify-center bg-[#DCEEDB] px-8 py-12 text-center">
          <div className="mb-6 text-8xl">🌷</div>

          <h1 className="text-4xl font-bold text-emerald-900">
            Join BookHub!
          </h1>

          <p className="mt-4 max-w-xs text-lg text-emerald-800">
            มาเป็นส่วนหนึ่งของชุมชนคนรักหนังสือ
            แล้วค้นพบเรื่องราวใหม่ ๆ ไปด้วยกัน
          </p>

          <div className="mt-10 text-5xl">
            📚 💚 📖
          </div>
        </div>

        {/* Register Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-emerald-900">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                สมัครสมาชิกเพื่อเริ่มต้นใช้งาน
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Name
                </label>

                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="ชื่อที่ต้องการแสดง"
                  autoComplete="name"
                  required
                  className="w-full rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-full border border-emerald-100 bg-[#F7FAF4] px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="accent-emerald-600"
                />
                แสดงรหัสผ่าน
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-emerald-600 py-4 font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'กำลังสมัครสมาชิก...' : 'Create Account'}
              </button>

            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                มีบัญชีอยู่แล้ว?
              </p>

              <Link
                to="/login"
                className="mt-2 inline-block font-bold text-emerald-700 hover:underline"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

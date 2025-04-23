'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Login failed');
      }

      const { token } = await res.json();
      document.cookie = `auth_token=${token}; path=/; max-age=${86400}; secure; samesite=lax`;
      router.push('admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 p-6" style={{ 
      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url("/gaming-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="max-w-md w-full rounded-xl overflow-hidden shadow-2xl">
        {/* Header with logo area */}
        <div className="bg-red-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide">LAVA GAMING</h1>
          <p className="text-white text-opacity-80 mt-1">Admin Portal</p>
        </div>
        
        {/* Form container */}
        <div className="bg-gray-900 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">تسجيل الدخول</h2>
            <p className="text-gray-400">أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border-l-4 border-red-600 text-red-100 text-sm rounded">
              <p className="font-medium">خطأ في المصادقة</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" dir='rtl'>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
'use client'

import { useEffect, useState, useRef } from 'react'
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'

export default function UsersDashboardPage() {
  // ─────────── main list state ───────────
  const [users, setUsers]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loadingList, setLoad]  = useState(true)

  // ─────────── modals state ───────────
  const [editUser, setEditUser]   = useState(null)  // object | null
  const [delUser,  setDelUser]    = useState(null)
  const [newUser,  setNewUser]    = useState(null)  // {username:'', password:''}|null

  // modal work flags
  const [saving,   setSaving]     = useState(false) // for edit
  const [deleting, setDeleting]   = useState(false)
  const [creating, setCreating]   = useState(false)

  // show / hide passwords
  const [showPw,        setShowPw]       = useState(false) // edit modal
  const [showNewPw,     setShowNewPw]    = useState(false) // create modal

  // refs to close on outside-click
  const editRef = useRef(null)
  const delRef  = useRef(null)
  const createRef = useRef(null)

  // ─────────── fetch list ───────────
  const loadUsers = async () => {
    setLoad(true)
    try {
      const res = await fetch('/api/admin', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setUsers(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoad(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  // ─────────── search filter ───────────
  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return }
    const q = search.toLowerCase()
    setFiltered(
      users.filter(u =>
        u.username.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      )
    )
  }, [search, users])

  // ─────────── save edit ───────────
  const handleSave = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      const body = { username: editUser.username }
      if (editUser.newPassword) body.password = editUser.newPassword
      const res = await fetch(`/api/admin/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Save failed')
      await loadUsers()
      setEditUser(null)
      setShowPw(false)
    } catch (err) {
      alert(err.message ?? 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  // ─────────── create new ───────────
  const handleCreate = async () => {
    if (!newUser?.username || !newUser?.password) {
      alert('أدخل اسم المستخدم وكلمة المرور')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error('Create failed')
      await loadUsers()
      setNewUser(null)
      setShowNewPw(false)
    } catch (err) {
      alert(err.message ?? 'Could not create')
    } finally {
      setCreating(false)
    }
  }

  // ─────────── delete user ───────────
  const confirmDelete = async () => {
    if (!delUser) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/${delUser.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await loadUsers()
      setDelUser(null)
    } catch (err) {
      alert(err.message ?? 'Could not delete')
    } finally {
      setDeleting(false)
    }
  }

  // ─────────── close modals on outside click ───────────
  useEffect(() => {
    const close = (e) => {
      if (editUser && editRef.current && !editRef.current.contains(e.target))
        setEditUser(null)
      if (delUser  && delRef.current  && !delRef.current.contains(e.target))
        setDelUser(null)
      if (newUser  && createRef.current && !createRef.current.contains(e.target))
        setNewUser(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [editUser, delUser, newUser])

  // ─────────── UI ───────────
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8" dir="rtl">
      {loadingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <FaSpinner className="text-red-500 text-5xl animate-spin" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-red-500">لوحة تحكم المستخدمين</h1>

      {/* search + add */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن المستخدمين..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 shadow-sm"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
        </div>

        <button
          onClick={() => setNewUser({ username: '', password: '' })}
          className="flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
        >
          <FaPlus className="ml-2" />
          إضافة مستخدم
        </button>
      </div>

      {/* table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-black to-red-800 text-white">
                <th className="px-6 py-4 text-right font-medium">المستخدم</th>
                <th className="px-6 py-4 text-right font-medium">تاريخ الإنشاء</th>
                <th className="px-6 py-4 text-center font-medium" width="180">الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {!loadingList && filtered.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                    لا توجد نتائج
                  </td>
                </tr>
              )}

              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(u.createdAt).toLocaleString('ar-IQ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-6">
                      <button
                        onClick={() => { setEditUser({ ...u, newPassword: '' }); setShowPw(false) }}
                        className="flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm"
                      >
                        <FaEdit className="ml-1.5" size={14} />
                        التعديل
                      </button>

                      <button
                        onClick={() => setDelUser(u)}
                        className="flex items-center px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded-lg shadow-sm"
                      >
                        <FaTrash className="ml-1.5" size={14} />
                        الحذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────── create modal ─────────── */}
      {newUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div ref={createRef} className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-green-400">إضافة مستخدم</h2>
              <button onClick={() => setNewUser(null)} className="p-1 hover:bg-gray-800 rounded-full">
                <FaTimes />
              </button>
            </div>

            {/* username */}
            <label className="block text-sm mb-1">اسم المستخدم</label>
            <input
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full px-3 py-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
            />

            {/* password */}
            <label className="block text-sm mb-1">كلمة المرور</label>
            <div className="relative mb-6">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full pr-10 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-white"
                title={showNewPw ? 'إخفاء' : 'إظهار'}
              >
                {showNewPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* actions */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setNewUser(null)}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
              >إلغاء</button>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white flex items-center"
              >
                {creating && <FaSpinner className="animate-spin ml-2" />}
                إنشاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── edit modal ─────────── */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div ref={editRef} className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-orange-400">التعديل</h2>
              <button onClick={() => setEditUser(null)} className="p-1 hover:bg-gray-800 rounded-full">
                <FaTimes />
              </button>
            </div>

            <label className="block text-sm mb-1">اسم المستخدم</label>
            <input
              value={editUser.username}
              onChange={e => setEditUser({ ...editUser, username: e.target.value })}
              className="w-full px-3 py-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
            />

            <label className="block text-sm mb-1">كلمة المرور الجديدة (اختياري)</label>
            <div className="relative mb-6">
              <input
                type={showPw ? 'text' : 'password'}
                value={editUser.newPassword}
                onChange={e => setEditUser({ ...editUser, newPassword: e.target.value })}
                className="w-full pr-10 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-white"
                title={showPw ? 'إخفاء' : 'إظهار'}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
              >إلغاء</button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white flex items-center"
              >
                {saving && <FaSpinner className="animate-spin ml-2" />}
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── delete modal ─────────── */}
      {delUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div ref={delRef} className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-red-500">تأكيد الحذف</h2>
              <button onClick={() => setDelUser(null)} className="p-1 hover:bg-gray-800 rounded-full">
                <FaTimes />
              </button>
            </div>

            <p className="mb-6">هل أنت متأكد من حذف المستخدم <strong>{delUser.username}</strong>؟</p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDelUser(null)}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
              >إلغاء</button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2 bg-red-700 hover:bg-red-800 rounded text-white flex items-center"
              >
                {deleting && <FaSpinner className="animate-spin ml-2" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

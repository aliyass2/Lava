// app/admin/dashboard/news/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import ImagePreview from '../../../global-components/imagePreview.jsx';

export default function NewsManagementPage() {
  // ────────────────────────────── State ──────────────────────────────
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    slug: '',
    title: '',
    description: '',
    category: '',
    date: '',
    content: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);
  const imageInputRef = useRef(null);

  // ─────────────────────────── Helpers ───────────────────────────
  const getCookie = name => {
    if (typeof document === 'undefined') return null;
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  // ─────────────────────────── Fetch News ────────────────────────────
  const fetchNews = async () => {
    setIsLoadingList(true);
    try {
      const token = getCookie('auth_token');
      const res = await fetch('/api/news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ─────────────────────────── Search Filter ──────────────────────────
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFilteredItems(
      items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, items]);

  // ──────────────────── Close Modal on Outside Click ──────────────────
  useEffect(() => {
    function onClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    }
    if (showModal) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showModal]);

  // ───────────────────────── File Change ──────────────────────────────
  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ───────────────────────── Delete Image ────────────────────────────
  const handleImageDelete = () => {
    setImageFile(null);
    setImagePreview('');
    setForm({ ...form, imageUrl: '' });
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // ────────────────────────── Submit Form ─────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const token = getCookie('auth_token');
      const fd = new FormData();
      fd.append('slug', form.slug);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('date', new Date(form.date).toISOString());
      fd.append('content', form.content);

      if (imageFile) {
        fd.append('image', imageFile);
      } else if (form.imageUrl === '') {
        // signal backend to remove existing image
        fd.append('removeImage', 'true');
      }

      const url = editingId ? `/api/news/${editingId}` : '/api/news';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      await fetchNews();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving news:', err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ────────────────────────── Reset Form ─────────────────────────────
  const resetForm = () => {
    setForm({
      slug: '',
      title: '',
      description: '',
      category: '',
      date: '',
      content: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // ────────────────────────── Start Edit ──────────────────────────────
  const startEdit = n => {
    setEditingId(n.id);
    setForm({
      slug: n.slug,
      title: n.title,
      description: n.description,
      category: n.category,
      date: n.date.slice(0, 16), // YYYY-MM-DDThh:mm
      content: n.content,
      imageUrl: n.image,
    });
    setImagePreview(n.image);
    setShowModal(true);
  };

  // ────────────────────────── Start Create ────────────────────────────
  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // ─────────────────────────── Delete Item ────────────────────────────
  const handleDelete = async id => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    try {
      const token = getCookie('auth_token');
      await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchNews();
    } catch (err) {
      console.error('Error deleting news:', err);
    }
  };

  // ────────────────────────────── UI ─────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8" dir="rtl">
      {isLoadingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <FaSpinner className="text-orange-500 text-5xl animate-spin" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-orange-500">إدارة الأخبار</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن الأخبار..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
        </div>
        <button
          onClick={startCreate}
          className="flex items-center px-5 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-shadow"
        >
          <FaPlus className="ml-2" /> إضافة خبر جديد
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-black to-orange-800 text-white">
                <th className="px-6 py-4 text-right">صورة</th>
                <th className="px-6 py-4 text-right">العنوان</th>
                <th className="px-6 py-4 text-right">التصنيف</th>
                <th className="px-6 py-4 text-right">التاريخ</th>
                <th className="px-6 py-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!isLoadingList && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    لا توجد أخبار
                  </td>
                </tr>
              )}
              {filteredItems.map(n => (
                <tr key={n.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    {n.image ? (
                      <ImagePreview src={n.image} thumbnailMode />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{n.title}</td>
                  <td className="px-6 py-4">{n.category}</td>
                  <td className="px-6 py-4">
                    {new Date(n.date).toLocaleDateString('ar-IQ', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-6">
                      <button
                        onClick={() => startEdit(n)}
                        className="flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-white shadow-sm transition-colors"
                      >
                        <FaEdit className="ml-1.5" size={14} /><span className="text-sm">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="flex items-center px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded-lg text-white shadow-sm transition-colors"
                      >
                        <FaTrash className="ml-1.5" size={14} /><span className="text-sm">حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div ref={modalRef} className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-700 to-red-600 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'تعديل خبر' : 'إضافة خبر جديد'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                <FaTimes className="text-white" />
              </button>
            </div>
            {/* Body */}
            <div className="p-8 space-y-6">
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">الوصف المختصر</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">التصنيف</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">التاريخ</label>
                    <input
                      type="datetime-local"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Content */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">المحتوى</label>
                    <textarea
                      value={form.content}
                      onChange={e => setForm({ ...form, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">الصورة</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        اختر صورة
                      </button>
                      {imagePreview && (
                  <div className="relative inline-block">                    
                  <ImagePreview src={imagePreview} thumbnailMode />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="
                        absolute -top-2 -right-2                    
                        bg-red-600 hover:bg-red-700             
                        rounded-full                           
                        p-2                                     
                        text-white                              
                        shadow-lg                              
                        transition-transform transform         
                        hover:scale-110                         
                        focus:outline-none focus:ring-2        
                        focus:ring-red-400                     
                     "
                      title="حذف الصورة"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="flex items-center px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg"
                  >
                    {loadingSubmit && <FaSpinner className="animate-spin ml-2" />}
                    {loadingSubmit ? 'جاري الحفظ...' : (editingId ? 'تحديث' : 'إضافة')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

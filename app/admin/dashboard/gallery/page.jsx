'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaImage,
  FaSpinner
} from 'react-icons/fa';
import ImagePreview from './../../../global-components/imagePreview.jsx';
export default function GalleryManagementPage() {
  /* ──────────────────────────────  State  ────────────────────────────── */
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',               // only used when editing without a new file
  });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ────────────────────────────  Helpers  ───────────────────────────── */
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  const fetchGallery = async () => {
    setIsLoadingList(true);
    try {
      const token = getCookie('auth_token');
      const res   = await fetch('/api/Gallery', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch gallery items');
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  /* ─────────────────────────  Search filter  ────────────────────────── */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFilteredItems(
      items.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, items]);

  /* ───────────────────────  Click‑outside modal  ─────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  /* ───────────────────────────  File input  ─────────────────────────── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ──────────────────────────  Create / Edit  ───────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const token = getCookie('auth_token');
      if (!token) throw new Error('Authentication token not found.');
      let reqInit;

      if (imageFile) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('image', imageFile);
        formData.append('folder', 'galleries');

        reqInit = {
          method: editingId ? 'PUT' : 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        };
      } else {
        const payload = {
          title: form.title,
          description: form.description,
          image: form.image,
        };
        reqInit = {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        };
      }

      const url = editingId ? `/api/Gallery/${editingId}` : '/api/Gallery';
      const res = await fetch(url, reqInit);
      if (!res.ok) {
        const text = await res.text();
        let msg = 'Failed to save gallery item';
        try { msg = JSON.parse(text).message || msg; } catch {}
        throw new Error(msg);
      }

      await fetchGallery();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء حفظ العنصر');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', image: '' });
    setImagePreview('');
    setImageFile(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, image: item.image });
    setImagePreview(item.image);
    setShowModal(true);
  };

  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  /* ──────────────────────────────  Delete  ──────────────────────────── */
  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
      const token = getCookie('auth_token');
      const res   = await fetch(`/api/Gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = 'Failed to delete gallery item';
        try { msg = JSON.parse(text).message || msg; } catch {}
        throw new Error(msg);
      }
      await fetchGallery();
    } catch (err) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء حذف العنصر');
    }
  };

  /* ───────────────────────────  Utilities  ──────────────────────────── */
  const formatDate = (d) =>
    new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(d));

  /* ──────────────────────────────  UI  ──────────────────────────────── */
  return (
    <div className="min-h-screen bg-black p-6 md:p-8" dir="rtl">
      {/* Loading spinner while fetching */}
      {isLoadingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <FaSpinner className="text-red-500 text-5xl animate-spin" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-red-500">إدارة معرض الصور</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث في المعرض..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 shadow-sm"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
        </div>

        <button
          onClick={startCreate}
          className="w-full md:w-auto flex items-center justify-center px-5 py-3 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 cursor-pointer"
        >
          <FaPlus className="ml-2" />
          إضافة صورة جديدة
        </button>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-gray-800 rounded-xl shadow-md p-10 text-center">
            <FaImage className="text-red-400 text-4xl mb-3 mx-auto" />
            <p className="text-gray-400">لا توجد صور في المعرض</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-900 flex items-center justify-center">
                <ImagePreview
                  src={item.image}
                  alt={item.title}
                  thumbnailMode
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                <div className="text-xs text-gray-400 mb-4">
                  تاريخ الإضافة: {formatDate(item.createdAt)}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm cursor-pointer"
                  >
                    <FaEdit className="ml-1.5" size={14} />
                    <span className="text-sm font-medium">تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center px-3 py-1.5 bg-red-800 text-white rounded-lg shadow-sm hover:bg-red-900 cursor-pointer"
                  >
                    <FaTrash className="ml-1.5" size={14} />
                    <span className="text-sm font-medium">حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 p-5">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'تعديل صورة' : 'إضافة صورة جديدة'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5" encType="multipart/form-data">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">الصورة</label>
                <div className="flex flex-col items-center">
                  {imagePreview && (
                    <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-800">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-red-500 hover:bg-gray-800">
                    <FaPlus className="ml-2" />
                    {imagePreview ? 'تغيير الصورة' : 'اختر صورة'}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">العنوان</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 min-h-[100px]"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-700 gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-600 rounded-lg text-white hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loadingSubmit || (!imagePreview && !editingId)}
                  className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 disabled:bg-red-400"
                >
                  {loadingSubmit && <FaSpinner className="animate-spin ml-2" />}
                  {loadingSubmit ? 'جاري الحفظ...' : editingId ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

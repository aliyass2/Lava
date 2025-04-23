// app/admin/dashboard/games/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaSpinner,
  FaEye,
} from 'react-icons/fa';
import ImagePreview from '../../../global-components/imagePreview.jsx';

export default function GamesManagementPage() {
  // ────────────────────────────── State ──────────────────────────────
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    longDescription: '',
    videoUrl: '',
    popular: false,
    features: '',
    imageUrl: ''
  });

  const [systemSpecs, setSystemSpecs] = useState([{ key: '', value: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingView, setLoadingView] = useState(false);

  const modalRef = useRef(null);
  const detailRef = useRef(null);
  const imageInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  // ─────────────────────────── Helpers ───────────────────────────
  const getCookie = name => {
    if (typeof document === 'undefined') return null;
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };




  const handleScreenshotDelete = idx => {
    setScreenshotFiles(fs => fs.filter((_, i) => i !== idx));
    setScreenshotPreviews(ps => ps.filter((_, i) => i !== idx));
  };

  // ─────────────────────────── Fetch Games ────────────────────────────
  const fetchGames = async () => {
    setIsLoadingList(true);
    try {
      const token = getCookie('auth_token');
      const res = await fetch('/api/games', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      setIsLoadingList(false);
    }
  };
  useEffect(fetchGames, []);

  // ─────────────────────────── Search Filter ──────────────────────────
  useEffect(() => {
    if (!searchTerm.trim()) return setFilteredItems(items);
    const q = searchTerm.toLowerCase();
    setFilteredItems(items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    ));
  }, [searchTerm, items]);

  // ──────────────────── Close Modals on Outside Click ──────────────────
  useEffect(() => {
    const handle = e => {
      if (showModal && modalRef.current && !modalRef.current.contains(e.target))
        setShowModal(false);
      if (showDetailModal && detailRef.current && !detailRef.current.contains(e.target))
        setShowDetailModal(false);
    };
    if (showModal || showDetailModal) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showModal, showDetailModal]);

  // ───────────────────────── File Change ──────────────────────────────
  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleScreenshotsChange = e => {
    const files = Array.from(e.target.files || []);
    setScreenshotFiles(files);
    setScreenshotPreviews(files.map(f => URL.createObjectURL(f)));
  };

  // ────────────────────────── Delete Main Image ────────────────────────────
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

      // Basic fields
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('longDescription', form.longDescription);
      fd.append('videoUrl', form.videoUrl);
      fd.append('popular', form.popular);

      // Features array
      fd.append('features', JSON.stringify(
        form.features.split(',').map(f => f.trim()).filter(f => f)
      ));

      // System specs object
      fd.append('gameSpecs', JSON.stringify(
        systemSpecs.reduce((o, s) => {
          if (s.key && s.value) o[s.key] = s.value;
          return o;
        }, {})
      ));

      // Image handling
      if (imageFile) {
        fd.append('image', imageFile);
      } else if (form.imageUrl) {
        fd.append('imageUrl', form.imageUrl);
      } else {
        fd.append('removeImage', 'true');
      }

      // Screenshots
      screenshotFiles.forEach(f => fd.append('screenshots', f));

      const url    = editingId ? `/api/games/${editingId}` : '/api/games';
      const method = editingId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      await fetchGames();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving game:', err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ────────────────────────── Reset Form ─────────────────────────────
  const resetForm = () => {
    setForm({
      title: '',
      category: '',
      description: '',
      longDescription: '',
      videoUrl: '',
      popular: false,
      features: '',
      imageUrl: ''
    });
    setSystemSpecs([{ key: '', value: '' }]);
    setImageFile(null);
    setImagePreview('');
    setScreenshotFiles([]);
    setScreenshotPreviews([]);
    setEditingId(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
  };

  // ────────────────────────── Start Create ────────────────────────────
  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // ────────────────────────── Start Edit ──────────────────────────────
  const startEdit = async id => {
    setLoadingEdit(true);
    try {
      const token = getCookie('auth_token');
      const res = await fetch(`/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      setEditingId(id);
      setForm({
        title:           data.title           || '',
        category:        data.category        || '',
        description:     data.description     || '',
        longDescription: data.longDescription ?? '',
        videoUrl:        data.videoUrl        ?? '',
        popular:         Boolean(data.popular),
        features:        Array.isArray(data.features)
                             ? data.features.join(', ')
                             : '',
        imageUrl:        data.imageUrl || data.image || ''
      });

      setSystemSpecs(
        Object.entries(data.systemSpecs || data.gameSpecs || {})
              .map(([k, v]) => ({ key: k, value: v }))
      );

      setImagePreview(data.imageUrl || data.image || '');
      setScreenshotPreviews(data.screenshots || []);
      setScreenshotFiles([]);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading game:', err);
    } finally {
      setLoadingEdit(false);
    }
  };

  // ─────────────────────────── View Details ───────────────────────────
  const handleView = async id => {
    setLoadingView(true);
    try {
      const token = getCookie('auth_token');
      const res = await fetch(`/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedGame(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error loading details:', err);
    } finally {
      setLoadingView(false);
    }
  };

  // ─────────────────────────── Delete Item ────────────────────────────
  const handleDelete = async id => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
      const token = getCookie('auth_token');
      await fetch(`/api/games/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchGames();
    } catch (err) {
      console.error('Error deleting game:', err);
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

      <h1 className="text-2xl font-bold mb-6 text-orange-500">إدارة الألعاب</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن الألعاب..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 rounded-lg border border-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
        </div>
        <button
          onClick={startCreate}
          className="flex items-center px-5 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg"
        >
          <FaPlus className="ml-2" /> إضافة لعبة جديدة
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
                <th className="px-6 py-4 text-center">شائع</th>
                <th className="px-6 py-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!isLoadingList && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    لا توجد ألعاب
                  </td>
                </tr>
              )}
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4">
                    {(item.imageUrl || item.image) ? (
                      <ImagePreview src={item.imageUrl || item.image} thumbnailMode />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 text-center">{item.popular ? '✔' : '✖'}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleView(item.id)}
                        className="flex items-center px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg text-white shadow-sm"
                      >
                        {loadingView && selectedGame?.id === item.id
                          ? <FaSpinner className="animate-spin ml-1.5" size={14}/>
                          : <FaEye className="ml-1.5" size={14}/>}
                        <span className="text-sm font-medium">عرض</span>
                      </button>
                      <button
                        onClick={() => startEdit(item.id)}
                        className="flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-white shadow-sm"
                      >
                        {loadingEdit && editingId === item.id
                          ? <FaSpinner className="animate-spin ml-1.5" size={14}/>
                          : <FaEdit className="ml-1.5" size={14}/>}
                        <span className="text-sm font-medium">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded-lg text-white shadow-sm"
                      >
                        <FaTrash className="ml-1.5" size={14}/>
                        <span className="text-sm font-medium">حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-up"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-700 to-red-600 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'تعديل لعبة' : 'إضافة لعبة جديدة'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                <FaTimes className="text-white" />
              </button>
            </div>
            {/* Body */}
            <div className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">التصنيف</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white	border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">الوصف المختصر</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-700 text-white	border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  {/* Long Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">الوصف التفصيلي</label>
                    <textarea
                      value={form.longDescription}
                      onChange={e => setForm({ ...form, longDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 text-white	border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">رابط الفيديو</label>
                    <input
                      type="url"
                      value={form.videoUrl}
                      onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white	border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {/* Popular */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={e => setForm({ ...form, popular: e.target.checked })}
                      className="form-checkbox text-orange-500 cursor-pointer"
                    />
                    <label className="text-gray-200 cursor-pointer">شائع</label>
                  </div>
                  {/* Features */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">المميزات (مفصولة بفواصل)</label>
                    <input
                      type="text"
                      value={form.features}
                      onChange={e => setForm({ ...form, features: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 text-white	border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {/* System Specs */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">مواصفات النظام</label>
                    {systemSpecs.map((spec, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          placeholder="مثال: المعالج"
                          value={spec.key}
                          onChange={e => {
                            const arr = [...systemSpecs];
                            arr[i].key = e.target.value;
                            setSystemSpecs(arr);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
                        />
                        <input
                          placeholder="مثال: i5 4500"
                          value={spec.value}
                          onChange={e => {
                            const arr = [...systemSpecs];
                            arr[i].value = e.target.value;
                            setSystemSpecs(arr);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setSystemSpecs(ss => ss.filter((_, j) => j !== i))}
                          className="text-red-500 px-2"
                        >&times;</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSystemSpecs(ss => [...ss, { key: '', value: '' }])}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white"
                    >أضف مواصفة</button>
                  </div>
                  {/* Main Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">صورة رئيسية</label>
                    <div className="flex items-center space-x-4 mb-3">
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
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                      >
                        اختر صورة
                      </button>
                    </div>
                    {imagePreview && (
                      <div className="relative inline-block mt-3">
                        <ImagePreview src={imagePreview} thumbnailMode />
                        <button
                          type="button"
                          onClick={handleImageDelete}
                          className="
                            absolute -top-2 -right-2
                            bg-red-600 hover:bg-red-700
                            rounded-full p-2 text-white
                            shadow-lg transition-transform transform hover:scale-110
                            focus:outline-none focus:ring-2 focus:ring-red-400
                          "
                          title="حذف الصورة"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Screenshots Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">صور المعاينة</label>
                    <div className="flex items-center space-x-4 mb-3">
                      <input
                        type="file"
                        ref={screenshotInputRef}
                        onChange={handleScreenshotsChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => screenshotInputRef.current.click()}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                      >اختر معاينات</button>
                    </div>
                    {screenshotPreviews.length > 0 && (
  <div className="flex gap-2 overflow-x-auto">
    {screenshotPreviews.map((src, idx) => (
     <div key={idx} className="relative inline-block group">
       <ImagePreview src={src} thumbnailMode />
       <button
         type="button"
         onClick={() => handleScreenshotDelete(idx)}
         className="
           absolute top-1 right-1
           bg-red-500 hover:bg-red-600
           rounded-full
           p-2
           text-white
           shadow-lg
          transition
           transform
           group-hover:scale-105
           focus:outline-none focus:ring-2 focus:ring-red-400
         "
        title="حذف المعاينة"
       >
         <FaTimes size={14}/>
       </button>
     </div>
    ))}
  </div>
)}
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

      {/* View Details Modal */}
      {showDetailModal && selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={detailRef}
            className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">تفاصيل اللعبة</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-800 rounded-full">
                <FaTimes />
              </button>
            </div>
            {selectedGame.imageUrl || selectedGame.image ? (
              <ImagePreview
                src={selectedGame.imageUrl || selectedGame.image}
                alt={selectedGame.title}
                thumbnailMode
              />
            ) : null}
            <h3 className="text-lg font-semibold mt-4">{selectedGame.title}</h3>
            <p className="text-gray-300">{selectedGame.description}</p>
            {selectedGame.longDescription && (
              <p className="text-gray-300 mt-2 whitespace-pre-wrap">{selectedGame.longDescription}</p>
            )}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>التصنيف:</strong> {selectedGame.category}</div>
              <div><strong>شائع:</strong> {selectedGame.popular ? '✔' : '✖'}</div>
              {selectedGame.videoUrl && (
                <div>
                  <strong>فيديو:</strong>{' '}
                  <a href={selectedGame.videoUrl} target="_blank" className="text-blue-400 underline">
                    عرض
                  </a>
                </div>
              )}
            </div>

            {/* Features */}
            {Array.isArray(selectedGame.features) && selectedGame.features.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-orange-400">المميزات</h4>
                <ul className="list-disc list-inside">
                  {selectedGame.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* System Specs */}
            {selectedGame.systemSpecs && Object.keys(selectedGame.systemSpecs).length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-orange-400">مواصفات النظام</h4>
                <ul className="list-disc list-inside">
                  {Object.entries(selectedGame.systemSpecs).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Screenshots */}
            {Array.isArray(selectedGame.screenshots) && selectedGame.screenshots.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-orange-400">صور المعاينة</h4>
                <div className="flex gap-2 overflow-x-auto mt-2">
                  {selectedGame.screenshots.map((src, i) => (
                    <ImagePreview key={i} src={src} thumbnailMode />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

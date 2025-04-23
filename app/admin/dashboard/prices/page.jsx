// app/admin/dashboard/prices/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaUpload,
  FaStar,
  FaSpinner
} from 'react-icons/fa';
import ImagePreview from './../../../global-components/imagePreview.jsx';

export default function PricesDashboardPage() {
  // ────────────────────────────── State ──────────────────────────────
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    productName: '',
    time: '',
    price: '',
    discountRate: '',
    features: '',
    mostused: false,
    image: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  // loading indicators
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // showModal must come before any effect that uses it
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // ─────────────────────────── Fetch Prices ───────────────────────────
  const fetchPrices = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch('/api/prices');
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching prices:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // ─────────────────────────── Search Filter ──────────────────────────
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFilteredItems(
      items.filter(item =>
        item.productName.toLowerCase().includes(q) ||
        item.finalPrice.toString().includes(q) ||
        (item.features || []).some(f => f.toLowerCase().includes(q))
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
    if (showModal) {
      document.addEventListener('mousedown', onClickOutside);
    } else {
      document.removeEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [showModal]);

  // ───────────────────────── File Change ──────────────────────────────
  const handleFileChange = (e) => {
    const sel = e.target.files[0];
    if (!sel) return;
    setFile(sel);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(sel);
  };

  // ────────────────────────── Delete Image ────────────────────────────
  const handleImageDelete = () => {
    setFile(null);
    setImagePreview('');
    setForm({ ...form, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ────────────────────────── Submit Form ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const fd = new FormData();
      fd.append('productName', form.productName);
      fd.append('time', Number(form.time));
      fd.append('price', Number(form.price));
      fd.append('discountRate', Number(form.discountRate));
      const feats = form.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
      fd.append('features', JSON.stringify(feats));
      fd.append('mostused', Boolean(form.mostused));

      if (file) {
        fd.append('image', file);
      } else if (form.image) {
        // keep existing image
        fd.append('imageUrl', form.image);
      } else {
        // user cleared the image → tell backend to remove it
        fd.append('removeImage', 'true');
      }

      const url = editingId ? `/api/prices/${editingId}` : '/api/prices';
      const method = editingId ? 'PUT' : 'POST';
      await fetch(url, { method, body: fd });

      await fetchPrices();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving price:', err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ────────────────────────── Reset Form ─────────────────────────────
  const resetForm = () => {
    setForm({
      productName: '',
      time: '',
      price: '',
      discountRate: '',
      features: '',
      mostused: false,
      image: '',
    });
    setFile(null);
    setImagePreview('');
    setEditingId(null);
  };

  // ────────────────────────── Start Edit ──────────────────────────────
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      productName: item.productName,
      time: item.time,
      price: item.price,
      discountRate: item.discountRate,
      features: (item.features || []).join(', '),
      mostused: item.mostused,
      image: item.image || '',
    });
    setImagePreview(item.image || '');
    setFile(null);
    setShowModal(true);
  };

  // ────────────────────────── Start Create ────────────────────────────
  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // ─────────────────────────── Delete Item ────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
      await fetch(`/api/prices/${id}`, { method: 'DELETE' });
      await fetchPrices();
    } catch (err) {
      console.error('Error deleting price:', err);
    }
  };

  // ─────────────────── Trigger Hidden File Input ───────────────────────
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ───────────────────────── Format Price ─────────────────────────────
  const formatPrice = (price) =>
    `${new Intl.NumberFormat('ar-IQ').format(price)} د.ع`;

  // ────────────────────────────── UI ─────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8" dir="rtl">
      {/* Spinner overlay while loading list */}
      {isLoadingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <FaSpinner className="text-red-500 text-5xl animate-spin" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-red-500">لوحة تحكم الأسعار</h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 shadow-sm"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
        </div>
        <button
          onClick={startCreate}
          className="flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <FaPlus className="ml-2" />
          إضافة سعر جديد
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-black to-red-800 text-white">
                <th className="px-6 py-4 text-right font-medium">المنتج</th>
                <th className="px-6 py-4 text-right font-medium">المدة</th>
                <th className="px-6 py-4 text-right font-medium">السعر</th>
                <th className="px-6 py-4 text-right font-medium">الخصم</th>
                <th className="px-6 py-4 text-right font-medium">السعر النهائي</th>
                <th className="px-6 py-4 text-center font-medium" width="200">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!isLoadingList && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-700 text-4xl mb-3" />
                      <p>لا توجد نتائج للبحث</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.image ? (
                        <div className="ml-3">
                          <ImagePreview
                            src={item.image}
                            alt={item.productName}
                            thumbnailMode
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center ml-3">
                          <span className="text-gray-500 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        {item.mostused && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            <FaStar className="ml-1 text-orange-500" size={10} />
                            الأكثر استخداماً
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{item.time}</span>
                    <span className="text-gray-500 mr-1">ساعة</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-orange-500">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {item.discountRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-orange-500">
                    {formatPrice(item.finalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-6">
                      <button
                        onClick={() => startEdit(item)}
                        className="flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-white shadow-sm transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <FaEdit className="ml-1.5" size={14} />
                        <span className="text-sm font-medium">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded-lg text-white shadow-sm transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <FaTrash className="ml-1.5" size={14} />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-40 p-4">
          <div
            ref={modalRef}
            className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-800 p-5">
              <h2 className="text-xl font-bold">
                {editingId ? 'تعديل السعر' : 'إضافة سعر جديد'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5" encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={e => setForm({ ...form, productName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                {/* Time */}
                <div>
                  <label className="block text-sm mb-1">المدة (ساعات)</label>
                  <input
                    type="number"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm mb-1">السعر (د.ع)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}                 className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                {/* Discount */}
                <div>
                  <label className="block text-sm mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={form.discountRate}
                    onChange={e => setForm({ ...form, discountRate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">المميزات (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={form.features}
                    onChange={e => setForm({ ...form, features: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">صورة المنتج</label>
                  <div className="flex items-center space-x-4 mb-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                    >
                      <FaUpload className="ml-2" />
                      اختر صورة
                    </button>
                    {file && (
                      <span className="text-gray-300 truncate max-w-xs">{file.name}</span>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative inline-block mt-3">
                      <ImagePreview src={imagePreview} alt="معاينة الصورة" thumbnailMode />
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
                {/* Most Used */}
                <div className="md:col-span-2">
                  <label className="inline-flex items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.mostused}
                      onChange={e => setForm({ ...form, mostused: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-orange-500"
                    />
                    <span className="mr-2">الأكثر استخداماً</span>
                    <FaStar className="text-orange-500" />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-8 mt-8 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 rounded-lg flex items-center"
                >
                  {loadingSubmit ? (
                    <FaSpinner className="animate-spin text-white mr-2" />
                  ) : (
                    editingId ? 'تحديث' : 'إضافة'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

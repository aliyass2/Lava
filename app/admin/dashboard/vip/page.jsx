// app/(admin)/vip/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaCrown,
  FaPlaystation,
  FaXbox,
  FaDesktop,
  FaMobile,
  FaSpinner
} from 'react-icons/fa';

export default function VipManagementPage() {
  // ────────────────────────────── State ──────────────────────────────
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    platform: 'play',
  });
  const [editingId, setEditingId] = useState(null);

  // loading indicators
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // showModal must come before useEffect that references it
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);

  // ─────────────────────────── Fetch VIPs ────────────────────────────
  const fetchVips = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch('/api/vips');
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching VIP packages:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchVips();
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
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.finalPrice.toString().includes(q) ||
        item.platform.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, items]);

  // ──────────── Close Modal on Outside Click ──────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  // ────────────────────────── Submit Form ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : null,
        platform: form.platform,
      };

      const url = editingId ? `/api/vips/${editingId}` : '/api/vips';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await fetchVips();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving VIP package:', err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ────────────────────────── Reset Form ─────────────────────────────
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      discount: '',
      platform: 'play',
    });
    setEditingId(null);
  };

  // ─────────────────────────── Start Edit ─────────────────────────────
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      discount: item.discount || '',
      platform: item.platform,
    });
    setShowModal(true);
  };

  // ───────────────────────── Start Create ─────────────────────────────
  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // ─────────────────────────── Delete Item ────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    try {
      await fetch(`/api/vips/${id}`, { method: 'DELETE' });
      await fetchVips();
    } catch (err) {
      console.error('Error deleting VIP package:', err);
    }
  };

  // ───────────────────────── Format Price ─────────────────────────────
  const formatPrice = (price) =>
    `${new Intl.NumberFormat('ar-IQ').format(price)} د.ع`;

  // ───────────────────── Get Platform Icon ────────────────────────────
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'play':    return <FaPlaystation className="text-red-500" />;
      case 'xbox':    return <FaXbox className="text-red-500" />;
      case 'pc':      return <FaDesktop className="text-red-500" />;
      case 'mobile':  return <FaMobile className="text-red-500" />;
      default:        return <FaDesktop className="text-red-500" />;
    }
  };

  // ─────────────────────────────── UI ─────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8" dir="rtl">
      {/* Spinner overlay while list loads */}
      {isLoadingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <FaSpinner className="text-red-500 text-5xl animate-spin" />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-red-500">
        إدارة العروض المميزة (VIP)
      </h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن الباقات..."
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
          إضافة باقة VIP جديدة
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-black to-red-800 text-white">
                <th className="px-6 py-4 text-right font-medium">الباقة</th>
                <th className="px-6 py-4 text-right font-medium">المنصة</th>
                <th className="px-6 py-4 text-right font-medium">السعر</th>
                <th className="px-6 py-4 text-right font-medium">الخصم</th>
                <th className="px-6 py-4 text-right font-medium">السعر النهائي</th>
                <th className="px-6 py-4 text-center font-medium" width="200">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!isLoadingList && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 ">
                    <div className="flex flex-col items-center">
                      <FaCrown className="text-gray-700 text-4xl mb-3" />
                      <p>لا توجد باقات VIP</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center ml-3">
                        <FaCrown className="text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getPlatformIcon(item.platform)}
                      <span className="mr-2 font-medium capitalize">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-red-500">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    {item.discount ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-800 text-white">
                        {item.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-red-500">
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
                {editingId ? 'تعديل باقة VIP' : 'إضافة باقة VIP جديدة'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm mb-1">اسم الباقة</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white	border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                {/* Platform */}
                <div>
                  <label className="block text-sm mb-1">المنصة</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white	border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="play">PlayStation</option>
                    <option value="xbox">Xbox</option>
                    <option value="pc">PC</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm mb-1">السعر (د.ع)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white	border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                    required min="0"
                  />
                </div>
                {/* Discount */}
                <div>
                  <label className="block text-sm mb-1">
                    نسبة الخصم (%) <span className="text-gray-500 text-xs">- اختياري</span>
                  </label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white	border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500"
                    min="0" max="100"
                  />
                </div>
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">الوصف</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white	border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 min-h-[100px]"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-10 pt-4 border-t border-gray-800">
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
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg flex items-center justify-center"
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

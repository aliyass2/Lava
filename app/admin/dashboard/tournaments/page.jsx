// app/(admin)/tournaments/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaTrophy,
  FaSpinner,
  FaEye,
} from 'react-icons/fa';
import ImagePreview from '../../../global-components/imagePreview.jsx';

export default function TournamentsManagementPage() {
  // ────────────────────────────── State ──────────────────────────────
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'جارية',
    startDate: '',
    endDate: '',
    prize: '',
  });

  const [rules, setRules] = useState([{ key: '', value: '' }]);
  const [times, setTimes] = useState([{ key: '', value: '' }]);
  const [administrators, setAdministrators] = useState([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [prizes, setPrizes] = useState([{ position: 1, award: '' }]);

  const [imageFile, setImageFile] = useState(null);
  const [initialImageUrl, setInitialImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const formModalRef = useRef(null);
  const detailModalRef = useRef(null);
  const fileInputRef = useRef(null);

  // ───────────────────────────── Fetch ─────────────────────────────
  const fetchTournaments = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingList(false);
    }
  };

   useEffect(() => {
       async function loadTournaments() {
         await fetchTournaments();
       }
       loadTournaments();
     }, []);

  // ───────────────────── Search Filter ─────────────────────────────
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredItems(
        items.filter(item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
        )
      );
    }
  }, [searchTerm, items]);

  // ────────── Close modals on outside click ─────────────────────────
  useEffect(() => {
    const handleOutside = e => {
      if (showFormModal && formModalRef.current && !formModalRef.current.contains(e.target)) {
        setShowFormModal(false);
      }
      if (showDetailModal && detailModalRef.current && !detailModalRef.current.contains(e.target)) {
        setShowDetailModal(false);
      }
    };
    if (showFormModal || showDetailModal) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showFormModal, showDetailModal]);

  // ─────────────────────── Form Submit ─────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      fd.append('administrators', JSON.stringify(administrators));
      fd.append('rules', JSON.stringify(
        rules.reduce((o, r) => { if (r.key && r.value) o[r.key] = r.value; return o; }, {})
      ));
      fd.append('times', JSON.stringify(
        times.reduce((o, t) => { if (t.key && t.value) o[t.key] = t.value; return o; }, {})
      ));
      fd.append('prizes', JSON.stringify(prizes));

      const url = editingId ? `/api/tournaments/${editingId}` : '/api/tournaments';
      const method = editingId ? 'PUT' : 'POST';
      await fetch(url, { method, body: fd });

      await fetchTournaments();
      resetForm();
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ─────────────────────────── Reset Form ────────────────────────────
  const resetForm = () => {
    setForm({ title: '', description: '', status: 'جارية', startDate: '', endDate: '', prize: '' });
    setRules([{ key: '', value: '' }]);
    setTimes([{ key: '', value: '' }]);
    setAdministrators([]);
    setNewAdmin('');
    setPrizes([{ position: 1, award: '' }]);
    setImageFile(null);
    setInitialImageUrl(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─────────────────────────── Edit/Create ──────────────────────────
  const startEdit = item => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      status: item.status,
      startDate: item.startDate.slice(0, 16),
      endDate: item.endDate.slice(0, 16),
      prize: item.prize,
    });
    setAdministrators(item.administrators || []);
    setRules(Object.entries(item.rules || {}).map(([k, v]) => ({ key: k, value: v })));
    setTimes(Object.entries(item.times || {}).map(([k, v]) => ({ key: k, value: v })));
    setPrizes(item.prizes?.length ? item.prizes : [{ position: 1, award: '' }]);
    setInitialImageUrl(item.image || null);
    setShowFormModal(true);
  };
  const startCreate = () => { resetForm(); setShowFormModal(true); };

  // ───────────────────────── Delete ────────────────────────────────
  const handleDelete = async id => {
    if (!confirm('هل أنت متأكد من حذف هذا التورنامنت؟')) return;
    try {
      await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
      await fetchTournaments();
    } catch (err) {
      console.error(err);
    }
  };

  // ───────────────────────────────── Helpers ─────────────────────────────────
  const formatDate = iso => new Date(iso).toLocaleString('ar-IQ');

  const parseRules = raw => {
    const out = [];
    if (!Array.isArray(raw)) return out;
    raw.forEach(str => {
      try {
        const outer = JSON.parse(str);
        Object.entries(outer).forEach(([k, v]) => {
          let val = v;
          try {
            const inner = JSON.parse(v);
            if (typeof inner === 'object') {
              Object.entries(inner).forEach(([k2, v2]) => out.push([k2, v2]));
              return;
            }
            val = inner;
          } catch {}
          out.push([k, val]);
        });
      } catch {}
    });
    return out;
  };

  // ───────────────────────────────── UI ─────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8" dir="rtl">
      {isLoadingList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <FaSpinner className="text-red-500 text-5xl animate-spin" />
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-red-500">إدارة البطولات</h1>

      {/* Search & Add */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="بحث عن البطولات..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-gray-900 rounded-lg border border-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-red-500"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
        </div>
        <button
          onClick={startCreate}
          className="flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <FaPlus className="ml-2" /> إضافة بطولة جديدة
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-black to-red-800 text-white">
                <th className="px-6 py-4 text-right">البطولة</th>
                <th className="px-6 py-4 text-right">الحالة</th>
                <th className="px-6 py-4 text-right">من</th>
                <th className="px-6 py-4 text-right">إلى</th>
                <th className="px-6 py-4 text-right">الجائزة</th>
                <th className="px-6 py-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {!isLoadingList && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    لا توجد بطولات
                  </td>
                </tr>
              )}
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">{formatDate(item.startDate)}</td>
                  <td className="px-6 py-4">{formatDate(item.endDate)}</td>
                  <td className="px-6 py-4">{item.prize}</td>
                  <td className="px-6 py-4">
  <div className="flex justify-center space-x-4">
    <button
      onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}
      className="flex items-center px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg text-white shadow-sm transition-colors cursor-pointer"
      title="عرض"
    >
      <FaEye className="ml-1.5" size={14} />
      <span className="text-sm font-medium">عرض</span>
    </button>

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

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40 p-4">
          <div ref={formModalRef} className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-800 p-5">
              <h2 className="text-xl font-bold">{editingId ? 'تعديل بطولة' : 'إضافة بطولة جديدة'}</h2>
              <button onClick={() => setShowFormModal(false)} className="p-1 hover:bg-gray-800 rounded-full">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div>
                  <label className="block mb-1">عنوان البطولة</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    required
                  />
                </div>
                {/* Status */}
                <div>
                  <label className="block mb-1">الحالة</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    required
                  >
                    <option value="JARIYA">جارية</option>
                    <option value="INTAHAT">منتهية</option>
                    <option value="MULGHA">ملغاة</option>
                    <option value="MO2AJALA">مؤجلة</option>
                    <option value="QADAMA">قادمة</option>



                  </select>



                </div>
                {/* Dates */}
                <div>
                  <label className="block mb-1">تاريخ البدء</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">تاريخ الانتهاء</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    required
                  />
                </div>
                {/* Prize */}
                <div>
                  <label className="block mb-1">الجائزة</label>
                  <input
                    type="text"
                    value={form.prize}
                    onChange={e => setForm(f => ({ ...f, prize: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                  />
                </div>
                {/* Image Upload */}
                <div>
                  <label className="block mb-1">صورة البطولة</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={e => {
                      setImageFile(e.target.files?.[0] || null);
                      setInitialImageUrl(null);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                  />
                </div>
                {(imageFile || initialImageUrl) && (
                  <div className="mt-4 w-32 h-32">
                    <ImagePreview
                      src={imageFile ? URL.createObjectURL(imageFile) : initialImageUrl}
                      alt="معاينة الصورة"
                      thumbnailMode
                    />
                  </div>
                )}

                {/* Administrators */}
                <div className="md:col-span-2">
                  <label className="block mb-1">المدراء</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {administrators.map((a, i) => (
                      <span key={i} className="px-2 py-1 bg-red-600 rounded-full flex items-center">
                        {a}
                        <button
                          onClick={() => setAdministrators(as => as.filter((_, j) => j !== i))}
                          className="ml-1"
                        >&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newAdmin}
                      onChange={e => setNewAdmin(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newAdmin.trim()) {
                          e.preventDefault();
                          setAdministrators(as => [...as, newAdmin.trim()]);
                          setNewAdmin('');
                        }
                      }}
                      placeholder="أضف مدير واكبس Enter"
                      className="flex-1 px-4 py-2 bg-gray-800 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        if (!newAdmin.trim()) return;
                        setAdministrators(as => [...as, newAdmin.trim()]);
                        setNewAdmin('');
                      }}
                      className="px-4 py-2 bg-red-600 rounded-lg"
                    >إضافة</button>
                  </div>
                </div>

                {/* Rules */}
                <div className="md:col-span-2">
                  <label className="block mb-1">القوانين</label>
                  {rules.map((r, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        placeholder="المفتاح"
                        value={r.key}
                        onChange={e => {
                          const arr = [...rules]; arr[i].key = e.target.value; setRules(arr);
                        }}
                        className="w-1/2 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <input
                        placeholder="القيمة"
                        value={r.value}
                        onChange={e => {
                          const arr = [...rules]; arr[i].value = e.target.value; setRules(arr);
                        }}
                        className="w-1/2 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <button onClick={() => setRules(rs => rs.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                    </div>
                  ))}
                  <button onClick={() => setRules(rs => [...rs, { key: '', value: '' }])} className="px-4 py-2 bg-red-600 rounded-lg">أضف قانون</button>
                </div>

                {/* Times */}
                <div className="md:col-span-2">
                  <label className="block mb-1">الاوقات</label>
                  {times.map((t, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        placeholder="المفتاح"
                        value={t.key}
                        onChange={e => {
                          const arr = [...times]; arr[i].key = e.target.value; setTimes(arr);
                        }}
                        className="w-1/2 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <input
                        placeholder="القيمة"
                        value={t.value}
                        onChange={e => {
                          const arr = [...times]; arr[i].value = e.target.value; setTimes(arr);
                        }}
                        className="w-1/2 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <button onClick={() => setTimes(ts => ts.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                    </div>
                  ))}
                  <button onClick={() => setTimes(ts => [...ts, { key: '', value: '' }])} className="px-4 py-2 bg-red-600 rounded-lg">أضف مواصفة</button>
                </div>

                {/* Prizes */}
                <div className="md:col-span-2">
                  <label className="block mb-1">جوائز المراكز</label>
                  {prizes.map((p, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="المركز"
                        value={p.position}
                        onChange={e => {
                          const arr = [...prizes]; arr[i].position = +e.target.value; setPrizes(arr);
                        }}
                        className="w-20 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <input
                        placeholder="الجائزة"
                        value={p.award}
                        onChange={e => {
                          const arr = [...prizes]; arr[i].award = e.target.value; setPrizes(arr);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-800 rounded-lg"
                      />
                      <button onClick={() => setPrizes(ps => ps.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                    </div>
                  ))}
                  <button onClick={() => setPrizes(ps => [...ps, { position: ps.length + 1, award: '' }])} className="px-4 py-2 bg-red-600 rounded-lg">أضف جائزة</button>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block mb-1">الوصف</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg min-h-[100px]"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                <button onClick={() => setShowFormModal(false)} className="px-5 py-2 border border-gray-700 rounded-lg">إلغاء</button>
                <button type="submit" disabled={loadingSubmit} className="px-6 py-2 bg-red-600 rounded-lg flex items-center">
                  {loadingSubmit ? <FaSpinner className="animate-spin ml-2" /> : (editingId ? 'تحديث' : 'إضافة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40 p-4">
          <div ref={detailModalRef} className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-800 p-5">
              <h2 className="text-xl font-bold">تفاصيل البطولة</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-800 rounded-full"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-4">
              {selectedItem.image && (
                <div className="w-full max-h-60">
                  <ImagePreview src={selectedItem.image} alt={selectedItem.title} thumbnailMode />
                </div>
              )}
              <h3 className="text-lg font-semibold text-red-500">{selectedItem.title}</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>الحالة:</strong> {selectedItem.status}</div>
                <div><strong>من:</strong> {formatDate(selectedItem.startDate)}</div>
                <div><strong>إلى:</strong> {formatDate(selectedItem.endDate)}</div>
                <div><strong>الجائزة:</strong> {selectedItem.prize}</div>
              </div>
              {/* Rules */}
              {(() => {
                const parsed = parseRules(selectedItem.rules);
                if (!parsed.length) return null;
                return (
                  <div>
                    <h4 className="text-red-500 font-medium">القوانين</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {parsed.map(([k,v],i) => <li key={i}><strong>{k}:</strong> {v}</li>)}
                    </ul>
                  </div>
                );
              })()}
              {/* Times */}
              {selectedItem.times && Object.keys(selectedItem.times).length > 0 && (
                <div>
                  <h4 className="text-red-500 font-medium">الاوقات</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(selectedItem.times).map(([k,v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}
                  </ul>
                </div>
              )}
              {/* Admins */}
              {selectedItem.administrators?.length > 0 && (
                <div>
                  <h4 className="text-red-500 font-medium">المدراء</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedItem.administrators.map(a => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
              {/* Prizes */}
              {selectedItem.prizes?.length > 0 && (
                <div>
                  <h4 className="text-red-500 font-medium">جوائز المراكز</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedItem.prizes.map((p,i) => <li key={i}>المركز {p.position}: {p.award}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

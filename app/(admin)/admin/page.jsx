// app/admin/page.js
export default function AdminDashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">مرحباً بك في لوحة التحكم</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-2">إجمالي المستخدمين</h2>
            <p className="text-3xl font-bold text-blue-600">1,245</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-2">إجمالي الحجوزات</h2>
            <p className="text-3xl font-bold text-green-600">523</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-2">البطولات النشطة</h2>
            <p className="text-3xl font-bold text-purple-600">12</p>
          </div>
        </div>
        
        {/* More dashboard content would go here */}
      </div>
    );
  }
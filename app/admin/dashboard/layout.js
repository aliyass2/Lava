// app/admin/dashboard/layout.jsx
import AdminNavbar from './AdminNavbar.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import "./../../(site)/globals.css";

export const metadata = {
  title: 'Admin Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" dir="rtl">
      <body className="min-h-screen bg-black text-white ">
        <div className="flex flex-col min-h-screen">
          
          {/* Navbar container */}
          <div className="bg-gray-900 border-b border-gray-700">
            <AdminNavbar />
          </div>
          
          <div className="flex flex-1">
            {/* Sidebar container */}
            <div className="bg-gray-900">
              <AdminSidebar />
            </div>
            
            {/* Main content area */} 
            <main className="flex-1 p-6 bg-black ">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

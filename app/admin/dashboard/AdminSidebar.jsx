'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTrophy, FaNewspaper, FaUsers, FaCog, FaGamepad } from 'react-icons/fa';
import { IoMdImages } from 'react-icons/io';
import { MdPriceChange } from 'react-icons/md';
import { RiVipCrownFill } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax";
    try { localStorage.removeItem("adminData"); } catch {}
    router.push("/admin");
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-800 to-black text-red-300 shadow-2xl border-r border-red-900 flex flex-col relative z-10">
      {/* Logo or Brand Section */}

      <nav className="flex-1 px-2 pt-4 overflow-y-auto">
        <ul>
          {/* البطولات */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/tournaments"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/tournaments")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <FaTrophy
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/tournaments")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>البطولات</span>
              {isActive("/admin/dashboard/tournaments") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>

          {/* الاخبار */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/news"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/news")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <FaNewspaper
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/news")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>الاخبار</span>
              {isActive("/admin/dashboard/news") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>

          {/* المستخدمين */}
          <li className="mb-2">
            <Link
              href="/users"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/users")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <FaUsers
                className={
                  `text-xl ml-3 ` +
                  (isActive("/users")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>المستخدمين</span>
              {isActive("/users") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>



          {/* الالعاب */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/games"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/games")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <FaGamepad
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/games")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>الالعاب</span>
              {isActive("/games") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>

          {/* الصور */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/gallery"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/gallery")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <IoMdImages
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/gallery")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>الصور</span>
              {isActive("/admin/dashboard/gallery") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>

          {/* الاسعار */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/prices"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/prices")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <MdPriceChange
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/prices")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>الاسعار</span>
              {isActive("/admin/dashboard/prices") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>

          {/* VIP */}
          <li className="mb-2">
            <Link
              href="/admin/dashboard/vip"
              className={
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ` +
                (isActive("/admin/dashboard/vip")
                  ? "bg-gradient-to-r from-red-800 to-red-700 text-white shadow-md"
                  : "text-red-300 hover:bg-red-900 hover:text-white group")
              }
            >
              <RiVipCrownFill
                className={
                  `text-xl ml-3 ` +
                  (isActive("/admin/dashboard/vip")
                    ? "text-red-300"
                    : "text-red-500 group-hover:text-red-300")
                }
              />
              <span>VIP</span>
              {isActive("/admin/dashboard/vip") && (
                <span className="mr-auto w-1.5 h-6 rounded-full bg-red-400"></span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-red-900 mt-auto bg-gray-900">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-gradient-to-r from-red-700 to-red-600 rounded-lg hover:from-red-800 hover:to-red-700 transition-colors duration-200 shadow-md"
        >
          <FiLogOut className="ml-2 text-lg" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
import "./../../(site)/globals.css"
export default function AdminLoginLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center min-h-screen bg-gray-50">
        <main className="w-full ">
          {children}
        </main>
      </body>
    </html>
  );
}

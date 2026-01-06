import "./globals.css";

export const metadata = {
  title: "AI Mock Interview",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PDF.js CDN (NO BUILD INVOLVEMENT) */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          defer
        ></script>
      </head>
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}

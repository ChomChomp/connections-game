// app/layout.js - Root Layout
import './globals.css';
export const metadata = {
  title: 'Custom Connections Game',
  description: 'Create and share your own connections puzzles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
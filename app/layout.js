import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Custom Connections Game',
  description: 'Create and share your own connections puzzles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
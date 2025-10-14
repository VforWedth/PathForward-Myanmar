import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PathForward Myanmar',
  description: 'Connecting Myanmar\'s Youth to Their Future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

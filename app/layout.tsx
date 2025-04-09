import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ffraid plan',
  description: 'used to create animated raidplans',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}

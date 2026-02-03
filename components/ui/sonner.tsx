'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-[#C17A3F]/30 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:font-bold group-[.toaster]:backdrop-blur-sm',
          description: 'group-[.toast]:text-black/70',
          actionButton: 'group-[.toast]:bg-[#C17A3F] group-[.toast]:text-white group-[.toast]:hover:bg-[#A05A2E]',
          cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-black group-[.toast]:hover:bg-gray-200',
          success: 'group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-[#2D8659]/50 group-[.toaster]:shadow-xl',
          error: 'group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-red-600/50 group-[.toaster]:shadow-xl',
          warning: 'group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-[#D4AF37]/50 group-[.toaster]:shadow-xl',
          info: 'group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-[#C17A3F]/50 group-[.toaster]:shadow-xl',
        },
        style: {
          background: '#FFF8E7',
          border: '2px solid rgba(193, 122, 63, 0.3)',
        },
      }}
      position="top-right"
      richColors
      closeButton
      duration={4000}
      {...props}
    />
  )
}

export { Toaster }

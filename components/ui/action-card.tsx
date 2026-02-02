'use client'

import { Badge } from './badge-custom'
import { Button } from './button'
import { Heart, Flame, MapPin, ArrowUpRight, Users } from 'lucide-react'
import Link from 'next/link'

interface ActionCardProps {
  id: string
  title: string
  description?: string
  city: string
  category: string
  status: 'open' | 'completed' | 'in_progress'
  volunteers: number
  image?: string
}

export function ActionCard({
  id,
  title,
  description,
  city,
  category,
  status,
  volunteers,
}: ActionCardProps) {
  return (
    <Link href={`/actions/${id}`}>
      <div className="group relative overflow-hidden rounded-3xl border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-3 h-full flex flex-col cursor-pointer">
        {/* Moroccan Zellige Pattern Background */}
        <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />

        {/* Decorative Corner Elements - Moroccan Style */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C17A3F]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#2D8659]/20 to-transparent rounded-tr-full transform -rotate-45 -translate-x-6 translate-y-6 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Top Decorative Border - Moroccan Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#C17A3F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#C17A3F]/30 rounded-lg transform rotate-45" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-[#2D8659]/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative p-6 flex-1 flex flex-col z-10">
          {/* Category Badge - Moroccan Style */}
          <div className="mb-4 inline-flex w-fit">
            <div className="px-4 py-1.5 bg-gradient-to-r from-[#C17A3F]/10 to-[#2D8659]/10 border-2 border-[#C17A3F]/40 rounded-full">
              <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] group-hover:text-[#A05A2E] transition-colors">
                {category}
              </span>
            </div>
          </div>

          {/* Title with Moroccan Typography */}
          <h3 className="font-serif text-xl font-black text-black leading-tight mb-3 text-balance group-hover:text-[#C17A3F] transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-black/70 leading-relaxed mb-4 line-clamp-2 flex-grow group-hover:text-black/90 transition-colors">
              {description}
            </p>
          )}

          {/* Moroccan Style Divider */}
          <div className="my-4 relative">
            <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Footer Info - Enhanced with Moroccan Colors */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF8E7] rounded-lg border border-[#C17A3F]/20 group-hover:bg-[#C17A3F]/10 group-hover:border-[#C17A3F]/40 transition-all">
              <MapPin className="h-4 w-4 text-[#C17A3F] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-black text-xs">{city}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2D8659]/10 rounded-lg border border-[#2D8659]/20 group-hover:bg-[#2D8659]/20 group-hover:border-[#2D8659]/40 transition-all">
              <Users className="h-4 w-4 text-[#2D8659] group-hover:animate-pulse" />
              <span className="font-black text-[#2D8659] text-xs">{volunteers}</span>
            </div>
          </div>

          {/* Status Badge - Moroccan Style */}
          <div className="mb-4 inline-flex w-fit">
            {status === 'open' ? (
              <div className="px-3 py-1 bg-green-100 border-2 border-green-600 rounded-full">
                <span className="text-xs font-black uppercase tracking-wider text-green-600">Ouvert</span>
              </div>
            ) : status === 'completed' ? (
              <div className="px-3 py-1 bg-gray-100 border-2 border-gray-400 rounded-full">
                <span className="text-xs font-black uppercase tracking-wider text-gray-600">Complet</span>
              </div>
            ) : (
              <div className="px-3 py-1 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-full">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">En Cours</span>
              </div>
            )}
          </div>

          {/* Moroccan Style CTA Button */}
          <Button 
            className="w-full mt-auto bg-gradient-to-r from-[#C17A3F] to-[#A05A2E] hover:from-[#A05A2E] hover:to-[#8B4A1F] text-white font-black rounded-xl group/btn transition-all duration-300 hover:shadow-xl hover:shadow-[#C17A3F]/30 hover:scale-[1.02] border-2 border-[#D4AF37]/30"
            size="sm"
          >
            <span className="group-hover/btn:translate-x-1 transition-transform duration-300 inline-flex items-center gap-2">
              Je Participe
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all duration-300" />
            </span>
          </Button>
        </div>

        {/* Bottom Moroccan Pattern Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  )
}

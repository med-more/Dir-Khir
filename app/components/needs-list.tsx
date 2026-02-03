'use client';

import { useState, useEffect } from 'react';
import { ActionCard } from '@/components/ui/action-card';
import { getNeeds, participateInNeed } from '@/lib/actions/needs';
import { Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/utils/toast';

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  whatsapp: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  status: 'open' | 'completed' | 'cancelled';
  volunteersCount: number;
}

interface NeedsListProps {
  initialNeeds: Need[];
  selectedCategory: string;
  selectedCity: string;
}

export function NeedsList({ initialNeeds, selectedCategory, selectedCity }: NeedsListProps) {
  const [needs, setNeeds] = useState<Need[]>(initialNeeds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participating, setParticipating] = useState<Set<string>>(new Set());

  // Mettre à jour les besoins quand initialNeeds change
  useEffect(() => {
    console.log('=== NEEDSLIST: initialNeeds changed ===', initialNeeds.length, 'needs');
    // Si aucun filtre n'est actif, utiliser directement initialNeeds
    if (selectedCategory === 'Tout' && selectedCity === 'Tout') {
      setNeeds(initialNeeds);
    }
  }, [initialNeeds, selectedCategory, selectedCity]);

  useEffect(() => {
    const fetchNeeds = async () => {
      setLoading(true);
      setError(null);
      
      console.log('=== NEEDSLIST: Fetching needs with filters ===', { selectedCategory, selectedCity });
      
      const filters: { city?: string; category?: string } = {};
      if (selectedCity !== 'Tout') {
        filters.city = selectedCity;
      }
      if (selectedCategory !== 'Tout') {
        filters.category = selectedCategory;
      }

      const result = await getNeeds(filters);
      
      console.log('=== NEEDSLIST: Fetch result ===', result);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        console.log('=== NEEDSLIST: Setting needs ===', result.data.length, 'needs');
        setNeeds(result.data);
      }
      
      setLoading(false);
    };

    // Toujours récupérer les besoins avec les filtres actuels
    fetchNeeds();
  }, [selectedCategory, selectedCity]);

  const handleParticipate = async (needId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (participating.has(needId)) return;
    
    setParticipating(prev => new Set(prev).add(needId));
    
    const result = await participateInNeed(needId);
    
    if (result.error) {
      toast.error('Erreur', result.error);
      setParticipating(prev => {
        const newSet = new Set(prev);
        newSet.delete(needId);
        return newSet;
      });
    } else {
      toast.success('Participation enregistrée !', 'Merci pour votre engagement dans la communauté.')
      // Mettre à jour le compteur localement
      setNeeds(prevNeeds =>
        prevNeeds.map(need =>
          need.id === needId
            ? { ...need, volunteersCount: need.volunteersCount + 1 }
            : need
        )
      );
    }
    
    setParticipating(prev => {
      const newSet = new Set(prev);
      newSet.delete(needId);
      return newSet;
    });
  };

  const handleWhatsApp = (whatsapp: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nettoyer le numéro pour WhatsApp
    const cleaned = whatsapp.replace(/[\s\-()]/g, '');
    const whatsappNumber = cleaned.startsWith('+') ? cleaned : `+212${cleaned.slice(1)}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (needs.length === 0) {
    console.log('=== NEEDSLIST: No needs to display ===', { selectedCategory, selectedCity, initialNeedsLength: initialNeeds.length });
    return (
      <div className="text-center py-12">
        <p className="text-black text-lg font-bold">Aucun besoin trouvé pour ces critères.</p>
        <p className="text-black/60 mt-2">Essayez de modifier vos filtres.</p>
      </div>
    );
  }

  console.log('=== NEEDSLIST: Rendering needs ===', needs.length, 'needs');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {needs.map((need) => (
        <div key={need.id} className="group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border-2 sm:border-3 md:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-3 h-full flex flex-col cursor-pointer">
          {/* Moroccan Zellige Pattern Background */}
          <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C17A3F]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#2D8659]/20 to-transparent rounded-tr-full transform -rotate-45 -translate-x-6 translate-y-6 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Content */}
          <div className="relative p-4 sm:p-5 md:p-6 flex-1 flex flex-col z-10">
            {/* Category Badge */}
            <div className="mb-3 sm:mb-4 inline-flex w-fit">
              <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#C17A3F]/10 to-[#2D8659]/10 border-2 border-[#C17A3F]/40 rounded-full">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#C17A3F]">
                  {need.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg sm:text-xl font-black text-black leading-tight mb-2 sm:mb-3 text-balance">
              {need.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-black/70 leading-relaxed mb-3 sm:mb-4 line-clamp-2 flex-grow">
              {need.description}
            </p>

            {/* Divider */}
            <div className="my-3 sm:my-4 relative">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent" />
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#FFF8E7] rounded-lg border border-[#C17A3F]/20">
                <span className="text-[10px] sm:text-xs">📍</span>
                <span className="font-bold text-black text-[10px] sm:text-xs">{need.city}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#2D8659]/10 rounded-lg border border-[#2D8659]/20">
                <span className="text-[10px] sm:text-xs">👥</span>
                <span className="font-black text-[#2D8659] text-[10px] sm:text-xs">{need.volunteersCount}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-3 sm:mb-4 inline-flex w-fit">
              <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 border-2 border-green-600 rounded-full">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-green-600">Ouvert</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={(e) => handleParticipate(need.id, e)}
                disabled={participating.has(need.id)}
                className="flex-1 bg-gradient-to-r from-[#C17A3F] to-[#A05A2E] hover:from-[#A05A2E] hover:to-[#8B4A1F] text-white font-black rounded-xl transition-all duration-300 hover:shadow-xl border-2 border-[#D4AF37]/30 cursor-pointer"
                size="sm"
              >
                {participating.has(need.id) ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    En cours...
                  </span>
                ) : (
                  'Je Participe'
                )}
              </Button>
              <Button
                onClick={(e) => handleWhatsApp(need.whatsapp, e)}
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-black rounded-xl transition-all cursor-pointer"
                size="sm"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
    </div>
  );
}

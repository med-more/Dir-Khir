'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-custom';
import { Heart, MessageSquare, Clock, CheckCircle, Plus, LogOut, MapPin, Flame, FileText, Users, TrendingUp, HandHeart, ArrowUpRight, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserNeeds, getUserParticipations, markNeedAsResolved } from '@/lib/actions/needs';
import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/actions';
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
  createdAt: Date;
}

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'requests' | 'missions'>('requests');
  const [userNeeds, setUserNeeds] = useState<Need[]>([]);
  const [userParticipations, setUserParticipations] = useState<Need[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger la session utilisateur
        const session = await getSession();
        console.log('Session received:', session); // Debug log
        
        if (!session || !session.user) {
          router.push('/auth/login');
          return;
        }
        setUser(session.user);

        // Charger les besoins de l'utilisateur
        const needsResult = await getUserNeeds();
        if (needsResult.error) {
          setError(needsResult.error);
        } else if (needsResult.data) {
          setUserNeeds(needsResult.data);
        }

        // Charger les participations de l'utilisateur
        const participationsResult = await getUserParticipations();
        if (participationsResult.error) {
          setError(participationsResult.error);
        } else if (participationsResult.data) {
          setUserParticipations(participationsResult.data);
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      toast.info('Déconnexion...', 'À bientôt !');
      await signOut();
      // signOut will redirect, but we can also do a client-side redirect as fallback
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion', 'Veuillez réessayer.');
      // Force redirect even on error
      router.push('/');
    }
  };

  const handleMarkResolved = async (needId: string) => {
    if (resolving.has(needId)) return;

    setResolving(prev => new Set(prev).add(needId));

    const result = await markNeedAsResolved(needId);

    if (result.error) {
      toast.error('Erreur', result.error);
    } else {
      toast.success('Besoin marqué comme résolu !', 'Merci pour votre contribution à la communauté.')
      // Mettre à jour le statut localement
      setUserNeeds(prevNeeds =>
        prevNeeds.map(need =>
          need.id === needId ? { ...need, status: 'completed' as const } : need
        )
      );
    }

    setResolving(prev => {
      const newSet = new Set(prev);
      newSet.delete(needId);
      return newSet;
    });
  };

  const handleWhatsApp = (whatsapp: string) => {
    const cleaned = whatsapp.replace(/[\s\-()]/g, '');
    const whatsappNumber = cleaned.startsWith('+') ? cleaned : `+212${cleaned.slice(1)}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C17A3F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black font-bold">Chargement...</p>
        </div>
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

  const stats = {
    needsPosted: userNeeds.length,
    missionsJoined: userParticipations.length,
    helpersFound: userNeeds.reduce((sum, need) => sum + need.volunteersCount, 0),
    impact: `${userNeeds.reduce((sum, need) => sum + need.volunteersCount, 0)} personnes aidées`,
  };

  return (
    <main className="min-h-screen bg-[#FFF8E7] relative overflow-hidden">
      {/* Traditional Moroccan Background */}
      <div className="fixed inset-0 -z-10 zellige-pattern opacity-[0.03]" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl shadow-lg">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/logo.svg"
                  alt="Dir-Khir Logo"
                  width={56}
                  height={56}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl md:text-2xl font-black text-black group-hover:text-red-600 transition-colors leading-none">
                  Dir-Khir
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-[0.15em] hidden sm:block">
                  Mon Espace
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-black hover:text-red-600 hover:bg-[#FFF8E7] transition-all duration-300 cursor-pointer p-2"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Profile Header */}
          <div className="mb-6 sm:mb-8 md:mb-12 group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2">
            <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C17A3F]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#2D8659]/20 to-transparent rounded-tr-full transform -rotate-45 -translate-x-6 translate-y-6 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                <div>
                  <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
                    <div className="absolute inset-0 border-2 border-[#C17A3F]">
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
                    </div>
                    <HandHeart className="w-4 h-4 text-[#C17A3F] relative z-10" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Bienvenue</span>
                  </div>
                  
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black mb-2 sm:mb-3">
                    Bon retour, <span className="text-red-600">{user?.name || user?.email || 'Utilisateur'}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-black font-bold text-sm sm:text-base">
                    {user?.email && (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                        <span className="break-all">{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link href="/post-need" className="w-full md:w-auto">
                  <Button size="lg" className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black shadow-xl hover:shadow-2xl transition-all duration-300 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base rounded-xl border-2 border-[#D4AF37]/30 cursor-pointer w-full md:w-auto">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Publier un Besoin
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2 cursor-pointer">
                  <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                  <div className="relative p-4 sm:p-5 md:p-6 z-10">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 sm:mb-2 text-red-600">Besoins Publiés</p>
                    <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-black group-hover:text-red-600 group-hover:scale-110 transition-all duration-300">
                      {stats.needsPosted}
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2 cursor-pointer">
                  <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                  <div className="relative p-4 sm:p-5 md:p-6 z-10">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 sm:mb-2 text-green-600">Missions Rejointes</p>
                    <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-black group-hover:text-green-600 group-hover:scale-110 transition-all duration-300">
                      {stats.missionsJoined}
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2 cursor-pointer">
                  <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                  <div className="relative p-4 sm:p-5 md:p-6 z-10">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 sm:mb-2 text-red-600">Bénévoles Trouvés</p>
                    <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-black group-hover:text-red-600 group-hover:scale-110 transition-all duration-300">
                      {stats.helpersFound}
                    </p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2 cursor-pointer">
                  <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                  <div className="relative p-4 sm:p-5 md:p-6 z-10">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 sm:mb-2 text-green-600">Impact Communautaire</p>
                    <p className="font-serif text-sm sm:text-base md:text-xl font-black text-green-600 group-hover:scale-110 transition-all duration-300">
                      {stats.impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 sm:mb-8 flex gap-2 sm:gap-4 border-b-2 sm:border-b-4 border-[#C17A3F] overflow-x-auto">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer border-b-2 sm:border-b-4 whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-black hover:text-red-600'
              }`}
            >
              Mes Demandes
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer border-b-2 sm:border-b-4 whitespace-nowrap ${
                activeTab === 'missions'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-black hover:text-green-600'
              }`}
            >
              Mes Engagements
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'requests' ? (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {userNeeds.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <p className="text-black text-base sm:text-lg font-bold mb-3 sm:mb-4">Aucun besoin publié</p>
                  <Link href="/post-need">
                    <Button className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black cursor-pointer text-sm sm:text-base">
                      Publier votre premier besoin
                    </Button>
                  </Link>
                </div>
              ) : (
                userNeeds.map((need) => (
                  <div key={need.id} className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F]">
                    <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                    <div className="relative p-4 sm:p-5 md:p-6 z-10">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-xl sm:text-2xl font-black text-black mb-2 break-words">{need.title}</h3>
                          <p className="text-black/70 mb-3 sm:mb-4 text-sm sm:text-base break-words">{need.description}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                            <span className="px-2 sm:px-3 py-1 bg-[#C17A3F]/10 border-2 border-[#C17A3F]/40 rounded-full text-[10px] sm:text-xs font-black text-[#C17A3F]">
                              {need.category}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-[#FFF8E7] border border-[#C17A3F]/20 rounded-lg text-[10px] sm:text-xs font-bold text-black">
                              📍 {need.city}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-[#2D8659]/10 border border-[#2D8659]/20 rounded-lg text-[10px] sm:text-xs font-bold text-[#2D8659]">
                              👥 {need.volunteersCount} bénévoles
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          {need.status === 'open' && (
                            <Button
                              onClick={() => handleMarkResolved(need.id)}
                              disabled={resolving.has(need.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white font-black cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
                            >
                              {resolving.has(need.id) ? '...' : 'Marquer Résolu'}
                            </Button>
                          )}
                          <Button
                            onClick={() => handleWhatsApp(need.whatsapp)}
                            size="sm"
                            variant="outline"
                            className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                          >
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {userParticipations.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <p className="text-black text-base sm:text-lg font-bold mb-3 sm:mb-4">Aucune participation</p>
                  <Link href="/">
                    <Button className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black cursor-pointer text-sm sm:text-base">
                      Découvrir les missions
                    </Button>
                  </Link>
                </div>
              ) : (
                userParticipations.map((need) => (
                  <div key={need.id} className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F]">
                    <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                    <div className="relative p-4 sm:p-5 md:p-6 z-10">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-xl sm:text-2xl font-black text-black mb-2 break-words">{need.title}</h3>
                          <p className="text-black/70 mb-3 sm:mb-4 text-sm sm:text-base break-words">{need.description}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                            <span className="px-2 sm:px-3 py-1 bg-[#C17A3F]/10 border-2 border-[#C17A3F]/40 rounded-full text-[10px] sm:text-xs font-black text-[#C17A3F]">
                              {need.category}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-[#FFF8E7] border border-[#C17A3F]/20 rounded-lg text-[10px] sm:text-xs font-bold text-black">
                              📍 {need.city}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-[#2D8659]/10 border border-[#2D8659]/20 rounded-lg text-[10px] sm:text-xs font-bold text-[#2D8659]">
                              👥 {need.volunteersCount} bénévoles
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleWhatsApp(need.whatsapp)}
                          size="sm"
                          variant="outline"
                          className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

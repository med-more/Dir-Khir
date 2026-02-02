'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight, MapPin, Users, Flame, ChevronRight, HandHeart, Sparkles, Star, Heart, MessageCircle, Phone, Clock, CheckCircle2, Menu, X, FileText, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { NeedsList } from '@/app/components/needs-list';
import { getNeeds } from '@/lib/actions/needs';

const testimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'Leader Communautaire',
    text: 'Dir-Khir a transformé la façon dont notre quartier s\'entraide. Plateforme incroyable.',
    city: 'Marrakech',
    avatar: '👩‍💼',
  },
  {
    name: 'Mohamed Rashid',
    role: 'Bénévole',
    text: 'Trouver des moyens significatifs de contribuer n\'a jamais été aussi facile. Communauté formidable.',
    city: 'Casablanca',
    avatar: '👨‍💻',
  },
  {
    name: 'Fatima Alami',
    role: 'Organisatrice',
    text: 'Grâce à Dir-Khir, nous avons pu coordonner des actions qui touchent vraiment notre communauté.',
    city: 'Fez',
    avatar: '👩‍🏫',
  },
];

const faqItems = [
  {
    question: 'Comment publier une mission ou un besoin ?',
    answer: 'Cliquez sur "Publier un Besoin" et remplissez le formulaire. Il suffit de 5 minutes pour décrire votre besoin et vous connecter avec des bénévoles.',
  },
  {
    question: 'Dir-Khir est-il complètement gratuit ?',
    answer: 'Oui ! Dir-Khir est une plateforme communautaire. Toutes les fonctionnalités sont gratuites.',
  },
  {
    question: 'Comment les bénévoles sont-ils vérifiés ?',
    answer: 'Nous utilisons des avis communautaires et une vérification de base pour assurer un environnement sûr pour tous.',
  },
  {
    question: 'Puis-je participer à plusieurs missions ?',
    answer: 'Absolument ! Rejoignez autant de missions que vous le souhaitez et créez un impact dans toute la communauté.',
  },
];

const categories = ['Tout', 'Environnement', 'Éducation', 'Social', 'Alimentation', 'Santé', 'Autre'];
const cities = ['Casablanca', 'Marrakech', 'Fez', 'Rabat', 'Agadir', 'Tanger', 'Meknes', 'Oujda'];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedCity, setSelectedCity] = useState('Tout');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialNeeds, setInitialNeeds] = useState<any[]>([]);

  // Charger les besoins initiaux
  const loadNeeds = async () => {
    console.log('=== HOMEPAGE: Loading needs ===');
    const result = await getNeeds();
    console.log('=== HOMEPAGE: Needs result ===', result);
    if (result.data) {
      console.log('=== HOMEPAGE: Setting needs ===', result.data.length, 'needs');
      setInitialNeeds(result.data);
    } else if (result.error) {
      console.error('=== HOMEPAGE: Error loading needs ===', result.error);
    }
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  // Recharger les besoins périodiquement et quand la page redevient visible
  useEffect(() => {
    const handleFocus = () => {
      console.log('=== HOMEPAGE: Window focused, reloading needs ===');
      loadNeeds();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('=== HOMEPAGE: Page visible, reloading needs ===');
        loadNeeds();
      }
    };

    // Recharger toutes les 30 secondes pour avoir les nouveaux besoins
    const interval = setInterval(() => {
      console.log('=== HOMEPAGE: Periodic reload ===');
      loadNeeds();
    }, 30000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E7] relative overflow-x-hidden">
      {/* Traditional Moroccan Background Pattern */}
      <div className="fixed inset-0 -z-10 zellige-pattern opacity-[0.03]" />
      
      {/* Top Gold Bar - Traditional Design */}
      <div className="bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] border-b-2 border-[#B8941F] shadow-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 py-2 sm:py-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-black font-bold">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base">🇲🇦</span>
                <span className="text-xs sm:text-sm">Solidarité Locale</span>
              </span>
              <span className="hidden sm:inline text-black/70">|</span>
              <span className="hidden md:inline text-black/80 text-xs sm:text-sm">De Tanger à Lagouira</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Social Links */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 cursor-pointer p-1 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} style={{ stroke: '#000000', color: '#000000' }} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 cursor-pointer p-1 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} style={{ stroke: '#000000', color: '#000000' }} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-300 cursor-pointer p-1 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} style={{ stroke: '#000000', color: '#000000' }} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Moroccan Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl shadow-lg">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 sm:gap-3">
              <div className="relative group-hover:scale-105 transition-transform duration-300">
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
                <span className="font-serif font-black text-lg sm:text-xl md:text-2xl text-black group-hover:text-red-600 transition-colors leading-none">
                  Dir-Khir
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-[0.15em] hidden sm:block">
                  Entraide Citoyenne
                </span>
              </div>
          </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '#accueil', label: 'Accueil' },
                { href: '#missions', label: 'Missions' },
                { href: '#comment-ca-marche', label: 'Comment ça marche' },
                { href: '#temoignages', label: 'Témoignages' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-black hover:text-red-600 transition-colors rounded-lg hover:bg-[#FFF8E7] relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
            </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/auth/login" 
                className="hidden sm:block text-xs sm:text-sm font-bold text-black hover:text-red-600 transition-colors px-3 sm:px-4 py-2"
              >
                Connexion
              </Link>
              <Button 
                size="default" 
                className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border-2 border-[#D4AF37]/30" 
                asChild
              >
                <Link href="/auth/register">
                  <span className="hidden sm:inline">Rejoindre</span>
                  <span className="sm:hidden">+</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
                </Link>
            </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-black hover:text-red-600 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#C17A3F] bg-white py-3 sm:py-4">
            <nav className="flex flex-col gap-1 px-3 sm:px-4">
              {[
                { href: '#accueil', label: 'Accueil' },
                { href: '#missions', label: 'Missions' },
                { href: '#comment-ca-marche', label: 'Comment ça marche' },
                { href: '#temoignages', label: 'Témoignages' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-black hover:bg-[#FFF8E7] rounded-lg font-bold border-l-4 border-transparent hover:border-red-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
        )}
      </header>

      {/* HERO SECTION - Traditional Split Design */}
      <section id="accueil" className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFF8E7] z-10">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-3 sm:h-4 z-20">
          <div className="h-full bg-[#C17A3F] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-0.5 sm:gap-1">
              <div className="w-0.5 sm:w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-0.5 sm:w-1 h-full bg-[#2D8659]"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-0.5 sm:w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-0.5 sm:w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-0.5 sm:w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 -right-10 sm:-right-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-[#C17A3F]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 sm:bottom-20 -left-10 sm:-left-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-[#2D8659]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 zellige-pattern opacity-[0.02]" />
              </div>

        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 w-full py-6 sm:py-8 md:py-10 lg:py-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-2 sm:space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-100 border-2 border-red-600 rounded-full">
                <HandHeart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-red-600">Plateforme d'Entraide</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-black">
                L'Entraide de
                  <br />
                <span className="text-red-600">Quartier</span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-green-600">De Tanger à Lagouira</span>
                </h1>

              <p className="text-xs sm:text-sm text-black leading-relaxed max-w-xl font-bold">
                Rejoignez votre communauté. Publiez vos besoins, trouvez de l'aide, et créez un véritable changement ensemble à travers le Maroc.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-1">
                <Button 
                  size="lg" 
                  className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#D4AF37]/30 cursor-pointer w-full sm:w-auto"
                >
                  Commencer Maintenant
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl cursor-pointer w-full sm:w-auto"
                >
                  En Savoir Plus
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t-2 border-red-600/30">
                <div>
                  <p className="text-lg sm:text-xl font-black text-black mb-0.5">2.8K</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-black/70 uppercase tracking-wide">Missions</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-red-600 mb-0.5">12K+</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-red-600/70 uppercase tracking-wide">Citoyens</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-green-600 mb-0.5">50K+</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-green-600/70 uppercase tracking-wide">Heures</p>
                </div>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="relative z-10 mt-6 lg:mt-0">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C17A3F]/20 via-[#D4AF37]/10 to-[#2D8659]/20 rounded-2xl sm:rounded-3xl blur-2xl scale-110"></div>
              
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-[#C17A3F]/30 shadow-2xl group hover:border-[#C17A3F] hover:shadow-[#C17A3F]/30 hover:scale-[1.02] transition-all duration-500 h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px]">
                {/* Traditional Moroccan Pattern Overlay */}
                <div className="absolute inset-0 zellige-pattern opacity-5 z-10 pointer-events-none"></div>
                
                {/* Decorative corners - outer */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#C17A3F] rotate-45 z-30 shadow-lg"></div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#C17A3F] rotate-45 z-30 shadow-lg"></div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-[#C17A3F] rotate-45 z-30 shadow-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#C17A3F] rotate-45 z-30 shadow-lg"></div>
                
                {/* Inner gold corners */}
                <div className="absolute top-0 left-0 w-5 h-5 border-l-3 border-t-3 border-[#D4AF37] z-30 shadow-md"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-r-3 border-t-3 border-[#D4AF37] z-30 shadow-md"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l-3 border-b-3 border-[#D4AF37] z-30 shadow-md"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r-3 border-b-3 border-[#D4AF37] z-30 shadow-md"></div>
                
                {/* Decorative geometric patterns */}
                <div className="absolute top-4 left-4 w-3 h-3 border-2 border-[#D4AF37]/50 rotate-45 z-20"></div>
                <div className="absolute top-4 right-4 w-3 h-3 border-2 border-[#D4AF37]/50 rotate-45 z-20"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#D4AF37]/50 rounded-full z-20"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#D4AF37]/50 rounded-full z-20"></div>
                
                {/* Video Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover min-w-full min-h-full"
                    style={{ objectFit: 'cover' }}
                    onLoadedData={(e) => {
                      // Ensure video plays completely
                      const video = e.target as HTMLVideoElement;
                      video.currentTime = 0;
                    }}
                  >
                    <source src={encodeURI("/assets/Moroccan Culture 🇲🇦.mp4")} type="video/mp4" />
                  </video>
                  
                  {/* Elegant overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C17A3F]/5 via-transparent to-[#2D8659]/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
            </div>
              
              {/* Decorative side elements */}
              <div className="absolute -z-10 top-1/2 -left-6 w-3 h-32 bg-gradient-to-b from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-40 rounded-full"></div>
              <div className="absolute -z-10 top-1/2 -right-6 w-3 h-32 bg-gradient-to-b from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-40 rounded-full"></div>
              
              {/* Floating decorative dots */}
              <div className="absolute -top-2 left-1/4 w-2 h-2 bg-[#D4AF37] rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-2 right-1/4 w-2 h-2 bg-[#2D8659] rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED MISSIONS SECTION - Traditional Dark */}
      <section id="missions" className="relative bg-white text-black py-24 overflow-hidden z-10">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#D4AF37] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        {/* Bottom element of image aligned with this section */}
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-flex items-center gap-2 px-6 py-2.5 mb-6">
              {/* Traditional Moroccan Border Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
              {/* Main border with traditional pattern */}
              <div className="absolute inset-0 border-2 border-[#C17A3F]">
                {/* Corner decorative elements */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                {/* Inner gold corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
              </div>
              {/* Decorative geometric pattern on sides */}
              <div className="absolute top-1/2 -left-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <Flame className="w-4 h-4 text-[#C17A3F] relative z-10" />
              <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Missions Actives</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight">
              Des Missions
              <br />
              <span className="text-green-600">Qui Comptent</span>
            </h2>
            <p className="text-black text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-bold px-4">
              Rejoignez des initiatives locales qui font la différence dans nos quartiers
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedCity('Tout')}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 font-black text-xs sm:text-sm rounded-lg transition-all cursor-pointer border-2 ${
                  selectedCity === 'Tout'
                    ? 'bg-green-600 text-white border-green-600 shadow-lg'
                    : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                }`}
              >
                Toutes les Villes
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 font-black text-xs sm:text-sm rounded-lg transition-all cursor-pointer border-2 ${
                    selectedCity === city
                      ? 'bg-green-600 text-white border-green-600 shadow-lg'
                      : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                  }`}
                >
                  {city}
                </button>
              ))}
                  </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 font-black text-xs sm:text-sm rounded-lg transition-all cursor-pointer border-2 ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white border-red-600 shadow-lg'
                      : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
            ))}
          </div>
                </div>

          {/* Missions Grid */}
          <NeedsList 
            initialNeeds={initialNeeds} 
            selectedCategory={selectedCategory}
            selectedCity={selectedCity}
          />
        </div>
      </section>

      {/* HOW IT WORKS - Simple Cards Design */}
      <section id="comment-ca-marche" className="relative bg-white text-black py-24 overflow-hidden z-40">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#2D8659] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#C17A3F]"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6">
              {/* Traditional Moroccan Border Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
              {/* Main border with traditional pattern */}
              <div className="absolute inset-0 border-2 border-[#C17A3F]">
                {/* Corner decorative elements */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                {/* Inner gold corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
              </div>
              {/* Decorative geometric pattern on sides */}
              <div className="absolute top-1/2 -left-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <Sparkles className="w-4 h-4 text-[#C17A3F] relative z-10" />
              <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Processus Simple</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight">
              Comment Ça
              <br />
              <span className="text-green-600">Fonctionne</span>
            </h2>
            <p className="text-black text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-bold px-4">
              Trois étapes simples pour créer un impact réel dans votre communauté
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1 */}
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
                {/* Step Badge */}
                <div className="mb-4 inline-flex w-fit">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-[#C17A3F]/10 to-[#2D8659]/10 border-2 border-[#C17A3F]/40 rounded-full">
                    <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] group-hover:text-[#A05A2E] transition-colors">
                      Étape 01
                  </span>
                </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-black text-black leading-tight mb-3 text-balance group-hover:text-[#C17A3F] transition-colors duration-300">
                  Publier ou Trouver
                </h3>

                {/* Description */}
                <p className="text-sm text-black/70 leading-relaxed mb-4 line-clamp-3 flex-grow group-hover:text-black/90 transition-colors">
                  Partagez votre besoin ou parcourez les missions disponibles dans votre ville. Notre plateforme vous permet de décrire précisément ce dont vous avez besoin.
                </p>

                {/* Moroccan Style Divider */}
                <div className="my-4 relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  {['Formulaire simple et rapide', 'Catégorisation automatique', 'Recherche par ville'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D8659] flex-shrink-0" />
                      <span className="text-xs text-black/70 font-bold group-hover:text-black/90 transition-colors">{item}</span>
              </div>
            ))}
          </div>

                {/* Icon */}
                <div className="mt-auto flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#C17A3F]/10 border-2 border-[#C17A3F]/30 flex items-center justify-center group-hover:bg-[#C17A3F]/20 group-hover:border-[#C17A3F] transition-all">
                    <FileText className="w-8 h-8 text-[#C17A3F]" />
        </div>
                </div>
              </div>

              {/* Bottom Moroccan Pattern Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Step 2 */}
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
                {/* Step Badge */}
                <div className="mb-4 inline-flex w-fit">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-[#C17A3F]/10 to-[#2D8659]/10 border-2 border-[#C17A3F]/40 rounded-full">
                    <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] group-hover:text-[#A05A2E] transition-colors">
                      Étape 02
                  </span>
                </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-black text-black leading-tight mb-3 text-balance group-hover:text-[#C17A3F] transition-colors duration-300">
                  Se Connecter
                </h3>

                {/* Description */}
                <p className="text-sm text-black/70 leading-relaxed mb-4 line-clamp-3 flex-grow group-hover:text-black/90 transition-colors">
                  Trouvez des bénévoles dans votre communauté locale et coordonnez l'aide. Notre système de matching vous met en relation avec les bonnes personnes.
                </p>

                {/* Moroccan Style Divider */}
                <div className="my-4 relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  {['Matching intelligent', 'Communication WhatsApp', 'Suivi en temps réel'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D8659] flex-shrink-0" />
                      <span className="text-xs text-black/70 font-bold group-hover:text-black/90 transition-colors">{item}</span>
              </div>
            ))}
          </div>

                {/* Icon */}
                <div className="mt-auto flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#2D8659]/10 border-2 border-[#2D8659]/30 flex items-center justify-center group-hover:bg-[#2D8659]/20 group-hover:border-[#2D8659] transition-all">
                    <Users className="w-8 h-8 text-[#2D8659]" />
        </div>
            </div>
          </div>

              {/* Bottom Moroccan Pattern Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Step 3 */}
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
                {/* Step Badge */}
                <div className="mb-4 inline-flex w-fit">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-[#C17A3F]/10 to-[#2D8659]/10 border-2 border-[#C17A3F]/40 rounded-full">
                    <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] group-hover:text-[#A05A2E] transition-colors">
                      Étape 03
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-black text-black leading-tight mb-3 text-balance group-hover:text-[#C17A3F] transition-colors duration-300">
                  Créer un Impact
                </h3>

                {/* Description */}
                <p className="text-sm text-black/70 leading-relaxed mb-4 line-clamp-3 flex-grow group-hover:text-black/90 transition-colors">
                  Travaillez ensemble et créez un véritable changement dans votre quartier. Chaque action compte et fait la différence.
                </p>

                {/* Moroccan Style Divider */}
                <div className="my-4 relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  {['Suivi des résultats', 'Statistiques d\'impact', 'Communauté grandissante'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D8659] flex-shrink-0" />
                      <span className="text-xs text-black/70 font-bold group-hover:text-black/90 transition-colors">{item}</span>
                    </div>
            ))}
          </div>

                {/* Icon */}
                <div className="mt-auto flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#C17A3F]/10 border-2 border-[#C17A3F]/30 flex items-center justify-center group-hover:bg-[#C17A3F]/20 group-hover:border-[#C17A3F] transition-all">
                    <Heart className="w-8 h-8 text-[#C17A3F]" />
        </div>
                </div>
              </div>

              {/* Bottom Moroccan Pattern Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="temoignages" className="relative bg-white text-black py-24 overflow-hidden z-10">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#C17A3F] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6">
              {/* Traditional Moroccan Border Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
              {/* Main border with traditional pattern */}
              <div className="absolute inset-0 border-2 border-[#C17A3F]">
                {/* Corner decorative elements */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                {/* Inner gold corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
              </div>
              {/* Decorative geometric pattern on sides */}
              <div className="absolute top-1/2 -left-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#C17A3F] relative z-10" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Témoignages</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight">
              Ce Que Dit
              <br />
              <span className="text-green-600">La Communauté</span>
            </h2>
            <p className="text-black text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-bold px-4">
              Découvrez ce que nos membres disent de leur expérience avec Dir-Khir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-3xl border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-3 h-full flex flex-col cursor-pointer"
              >
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
                  {/* Quote Icon */}
                  <div className="text-4xl mb-4 opacity-20 group-hover:opacity-30 transition-opacity text-[#C17A3F]">"</div>

                  {/* Testimonial Text */}
                  <p className="text-sm text-black/70 leading-relaxed mb-4 flex-grow group-hover:text-black/90 transition-colors italic">
                    "{testimonial.text}"
                  </p>

                  {/* Moroccan Style Divider */}
                  <div className="my-4 relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C17A3F]/10 to-[#2D8659]/10 flex items-center justify-center text-2xl border-2 border-[#C17A3F]/30 group-hover:border-[#C17A3F] transition-all">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-black group-hover:text-[#C17A3F] transition-colors">{testimonial.name}</p>
                      <p className="text-xs text-[#2D8659] font-bold">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#C17A3F]" />
                        <span className="text-xs text-black/70 font-bold">{testimonial.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Moroccan Pattern Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-white text-black py-24 overflow-hidden z-10">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#C17A3F] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6">
              {/* Traditional Moroccan Border Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
              {/* Main border with traditional pattern */}
              <div className="absolute inset-0 border-2 border-[#C17A3F]">
                {/* Corner decorative elements */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                {/* Inner gold corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
              </div>
              {/* Decorative geometric pattern on sides */}
              <div className="absolute top-1/2 -left-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-6 bg-[#D4AF37]"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <MessageCircle className="w-4 h-4 text-[#C17A3F] relative z-10" />
              <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Questions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 leading-tight">
              Questions
              <br />
              <span className="text-red-600">Fréquentes</span>
            </h2>
            <p className="text-black text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-bold px-4">
              Trouvez les réponses aux questions les plus courantes sur Dir-Khir
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-1 cursor-pointer"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedFaq(expandedFaq === idx ? null : idx);
                  }
                }}
              >
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
                <div className="relative py-5 px-6 flex items-center justify-between z-10">
                  <h3 className="font-bold text-lg pr-6 group-hover:text-[#C17A3F] transition-colors text-black">
                    {item.question}
                  </h3>
                  <ChevronRight
                    className={`w-5 h-5 flex-shrink-0 text-[#C17A3F] transition-all duration-300 ${
                      expandedFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                
                {expandedFaq === idx && (
                  <>
                    {/* Moroccan Style Divider */}
                    <div className="relative mx-6 mb-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent" />
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full" />
                    </div>
                    <div className="pb-5 px-6 text-black leading-relaxed font-bold relative z-10 text-sm">
                    {item.answer}
                  </div>
                  </>
                )}

                {/* Bottom Moroccan Pattern Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative bg-white text-black py-24 overflow-hidden z-10">
        {/* Traditional Moroccan Border */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#D4AF37] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-1 h-full bg-[#C17A3F]"></div>
              <div className="w-2 h-2 bg-[#C17A3F] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] hover:-translate-y-2 cursor-pointer">
              {/* Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                <Image
                  src="/assets/bg.png"
                  alt="Background"
                  fill
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-white/60"></div>
              </div>
              {/* Moroccan Zellige Pattern Background */}
              <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 z-[1]" />

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
              <div className="relative p-6 sm:p-8 md:p-12 flex flex-col items-center text-center z-10">
                {/* Badge */}
                <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6">
                  {/* Traditional Moroccan Border Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C17A3F]/10 via-[#D4AF37]/10 to-[#2D8659]/10"></div>
                  {/* Main border with traditional pattern */}
                  <div className="absolute inset-0 border-2 border-[#C17A3F]">
                    {/* Corner decorative elements */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C17A3F] rotate-45"></div>
                    {/* Inner gold corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#D4AF37]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#D4AF37]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#D4AF37]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#D4AF37]"></div>
                  </div>
                  {/* Decorative geometric pattern on sides */}
                  <div className="absolute top-1/2 -left-2 w-1 h-6 bg-[#D4AF37]"></div>
                  <div className="absolute top-1/2 -right-2 w-1 h-6 bg-[#D4AF37]"></div>
                  <div className="absolute top-1/2 left-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                  <div className="absolute top-1/2 right-1 w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                  <HandHeart className="w-4 h-4 text-[#C17A3F] relative z-10" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Prêt à Faire la Différence ?</span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 leading-tight px-4">
                  Commencez Votre
              <br />
                  <span className="text-green-600">Mission</span>
              <br />
                  Aujourd'hui
            </h2>

                {/* Moroccan Style Divider */}
                <div className="my-4 sm:my-6 w-full max-w-md relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent group-hover:via-[#C17A3F] transition-all duration-500" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Description */}
                <p className="text-black text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-bold mb-6 sm:mb-8 px-4">
                  Rejoignez des milliers de citoyens qui créent un véritable impact. Publiez votre besoin ou trouvez une façon d'aider.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full px-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#C17A3F] to-[#A05A2E] hover:from-[#A05A2E] hover:to-[#8B4A1F] text-white font-black text-sm sm:text-base px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#D4AF37]/30 cursor-pointer w-full sm:w-auto"
                  >
                    Publier un Besoin
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base rounded-xl cursor-pointer w-full sm:w-auto"
                  >
                    Explorer les Missions
              </Button>
                </div>
              </div>

              {/* Bottom Moroccan Pattern Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFF8E7] py-20 overflow-hidden">
        {/* Traditional Moroccan Border */}
        <div className="absolute top-0 left-0 right-0 h-4 z-20">
          <div className="h-full bg-[#C17A3F] relative overflow-hidden">
            {/* Traditional geometric pattern */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#2D8659] rotate-45"></div>
              <div className="w-1 h-full bg-[#D4AF37]"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-full bg-[#2D8659]"></div>
            </div>
          </div>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C17A3F]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2D8659]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Top Section - Logo and Description */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              {/* Logo Section */}
              <div className="flex items-center gap-4">
                <Link href="/" className="group flex items-center gap-3">
                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/assets/logo.svg"
                      alt="Dir-Khir Logo"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-3xl text-black group-hover:text-[#C17A3F] transition-colors leading-none">
                      Dir-Khir
                    </span>
                    <span className="text-xs text-green-600 font-bold uppercase tracking-[0.2em]">
                      Entraide Citoyenne
                    </span>
                  </div>
                </Link>
              </div>

              {/* Description */}
              <div className="max-w-md">
                <p className="text-black text-base leading-relaxed font-bold">
                  L'Entraide de Quartier. De Tanger à Lagouira, nous créons un véritable changement ensemble.
                </p>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="relative">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full" />
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
            {/* Plateforme */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#C17A3F] to-transparent opacity-30" />
              <h4 className="font-black uppercase text-sm tracking-wider mb-6 text-red-600 relative">
                Plateforme
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-600" />
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#missions" className="hover:text-red-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full group-hover:bg-red-600 transition-colors" />
                    Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/post-need" className="hover:text-red-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full group-hover:bg-red-600 transition-colors" />
                    Publier
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-red-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full group-hover:bg-red-600 transition-colors" />
                    Tableau de Bord
                  </Link>
                </li>
              </ul>
            </div>

            {/* Communauté */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#2D8659] to-transparent opacity-30" />
              <h4 className="font-black uppercase text-sm tracking-wider mb-6 text-green-600 relative">
                Communauté
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-600" />
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#temoignages" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link href="#missions" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    Impact
                  </Link>
                </li>
                <li>
                  <Link href="#temoignages" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#C17A3F] to-transparent opacity-30" />
              <h4 className="font-black uppercase text-sm tracking-wider mb-6 text-red-600 relative">
                Légal
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-600" />
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-red-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full group-hover:bg-red-600 transition-colors" />
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-red-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full group-hover:bg-red-600 transition-colors" />
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#2D8659] to-transparent opacity-30" />
              <h4 className="font-black uppercase text-sm tracking-wider mb-6 text-green-600 relative">
                Social
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-600" />
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600 transition-colors font-bold text-black/70 hover:text-black flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-green-600/30 rounded-full group-hover:bg-green-600 transition-colors" />
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="relative">
            {/* Decorative Divider */}
            <div className="relative mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C17A3F]/30 to-transparent" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <p className="font-bold text-black/70 text-center sm:text-left">
                &copy; 2024 Dir-Khir. Impact communautaire, alimenté par les citoyens.
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-black/70">Fait avec</span>
                <span className="text-red-600 text-base sm:text-lg">❤️</span>
                <span className="font-bold text-black/70">pour le Maroc</span>
                <span className="text-lg sm:text-xl">🇲🇦</span>
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-30" />
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client'

import React from "react"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ChevronRight, ArrowLeft, Check, FileText, MapPin, MessageSquare, Phone, CheckCircle2, Sparkles, ArrowUpRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createNeed } from '@/lib/actions/needs'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: 'Informations de Base', icon: '1', color: 'red' },
  { id: 2, title: 'Détails', icon: '2', color: 'green' },
  { id: 3, title: 'Contact', icon: '3', color: 'red' },
  { id: 4, title: 'Révision', icon: '4', color: 'green' },
]

// Zod Schema
const formSchema = z.object({
  title: z.string().min(10, 'Le titre doit contenir au moins 10 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  city: z.string().min(1, 'Veuillez sélectionner votre ville'),
  whatsapp: z.string()
    .min(1, 'Le numéro WhatsApp est requis')
    .refine((val) => {
      // Remove spaces, dashes, and parentheses for validation
      const cleaned = val.replace(/[\s\-()]/g, '')
      // Check for Moroccan format: +212 followed by 9 digits starting with 5, 6, or 7, OR 0 followed by 9 digits starting with 5, 6, or 7
      return /^(\+212[5-7]\d{8}|0[5-7]\d{8})$/.test(cleaned)
    }, { message: 'Numéro WhatsApp invalide. Format: +212 6XX XXX XXX ou 06XX XXX XXX' }),
  urgencyLevel: z.enum(['low', 'medium', 'high']),
})

type FormData = z.infer<typeof formSchema>

// Step-specific schemas for validation
const stepSchemas = {
  1: z.object({
    title: formSchema.shape.title,
    category: formSchema.shape.category,
  }),
  2: z.object({
    description: formSchema.shape.description,
    urgencyLevel: formSchema.shape.urgencyLevel,
  }),
  3: z.object({
    city: formSchema.shape.city,
    whatsapp: formSchema.shape.whatsapp,
  }),
  4: formSchema,
}

export default function PostNeedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      city: '',
      whatsapp: '',
      urgencyLevel: 'medium',
    },
  })

  const handleNext = async () => {
    const currentStepSchema = stepSchemas[currentStep as keyof typeof stepSchemas]
    const fieldsToValidate = currentStep === 1 
      ? ['title', 'category'] 
      : currentStep === 2 
      ? ['description', 'urgencyLevel'] 
      : ['city', 'whatsapp']
    
    const isValid = await trigger(fieldsToValidate as any)
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    const result = await createNeed({
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      whatsapp: data.whatsapp,
      urgencyLevel: data.urgencyLevel,
    })

    if (result.error) {
      setSubmitError(result.error)
      setIsSubmitting(false)
    } else {
      console.log('=== POSTNEED: Need created successfully, redirecting ===');
      // Revalider le cache et rediriger vers la page d'accueil pour voir le nouveau besoin
      router.refresh()
      // Rediriger vers la page d'accueil pour voir le nouveau besoin
      // Utiliser window.location pour forcer un rechargement complet
      window.location.href = '/'
    }
  }

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
                  Publier un Besoin
                </span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            {/* Badge */}
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
              <Sparkles className="w-4 h-4 text-[#C17A3F] relative z-10" />
              <span className="text-xs font-black uppercase tracking-wider text-[#C17A3F] relative z-10">Publier un Besoin</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black mb-3 sm:mb-4 px-4">
              Partagez Votre <span className="text-red-600">Besoin</span>
            </h1>
            <p className="text-black text-sm sm:text-base md:text-lg font-bold max-w-2xl mx-auto px-4">
              Aidez votre communauté à comprendre ce dont vous avez besoin. Remplissez quelques détails et laissez les voisins vous aider.
            </p>
          </div>

          {/* Progress Steps - Traditional Style */}
          <div className="mb-8 sm:mb-10 md:mb-12 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max sm:min-w-0">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className="relative">
                    {step.color === 'red' ? (
                      <div className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all duration-500 ${
                        currentStep >= step.id
                          ? 'border-red-600 bg-white shadow-2xl scale-110' 
                          : 'border-[#C17A3F]/30 bg-white'
                      }`} style={{ width: '50px', height: '50px' }} className="sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]">
                        <div className="absolute inset-0 zellige-pattern opacity-[0.03]"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#C17A3F]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-4 -translate-y-4" />
                        </div>
                        <div className="relative flex items-center justify-center h-full z-10">
                          {currentStep > step.id ? (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600" />
                          ) : (
                            <span className={`text-lg sm:text-xl md:text-2xl font-black ${currentStep >= step.id ? 'text-red-600' : 'text-black'}`}>
                              {step.icon}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all duration-500 ${
                        currentStep >= step.id
                          ? 'border-green-600 bg-white shadow-2xl scale-110' 
                          : 'border-[#C17A3F]/30 bg-white'
                      }`} style={{ width: '50px', height: '50px' }} className="sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]">
                        <div className="absolute inset-0 zellige-pattern opacity-[0.03]"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#2D8659]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-4 -translate-y-4" />
                        </div>
                        <div className="relative flex items-center justify-center h-full z-10">
                          {currentStep > step.id ? (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                          ) : (
                            <span className={`text-lg sm:text-xl md:text-2xl font-black ${currentStep >= step.id ? 'text-green-600' : 'text-black'}`}>
                              {step.icon}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 md:w-28 text-center">
                      <p className={`text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wide ${
                        currentStep >= step.id 
                          ? step.color === 'red' ? 'text-red-600' : 'text-green-600'
                          : 'text-black/40'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1.5 sm:h-2 mx-2 sm:mx-3 md:mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.id 
                        ? step.color === 'red' 
                          ? 'bg-gradient-to-r from-red-600 to-green-600' 
                          : 'bg-gradient-to-r from-green-600 to-red-600'
                        : 'bg-[#C17A3F]/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content - Traditional Card */}
          <div className="group relative overflow-hidden rounded-3xl border-4 border-[#C17A3F]/30 bg-white transition-all duration-500 hover:shadow-2xl hover:border-[#C17A3F] mb-8">
            {/* Moroccan Zellige Pattern Background */}
            <div className="absolute inset-0 zellige-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C17A3F]/20 to-transparent rounded-bl-full transform rotate-45 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#2D8659]/20 to-transparent rounded-tr-full transform -rotate-45 -translate-x-6 translate-y-6 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Top Decorative Border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#C17A3F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#C17A3F]/30 rounded-lg transform rotate-45" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-[#2D8659]/30 rounded-full" />
            </div>

            <form id="post-need-form" onSubmit={handleSubmit(onSubmit)} className="relative p-4 sm:p-6 md:p-8 lg:p-10 z-10">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-black">Informations de Base</h2>
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      De quoi avez-vous besoin ?
                    </label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="ex: Aide alimentaire, Réparations à domicile, Garde d'enfants..."
                      {...register('title')}
                      className={`w-full py-4 sm:py-5 md:py-6 border-2 rounded-xl text-sm sm:text-base md:text-lg font-bold text-black ${
                        errors.title ? 'border-red-600' : 'border-red-600/30 focus:border-red-600'
                      }`}
                    />
                    {errors.title && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.title.message}</span>
                      </div>
                    )}
                    <p className="text-[10px] sm:text-xs text-black/70 mt-2 font-bold">
                      Soyez clair et spécifique. C'est la première chose que les gens voient.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      Catégorie
                    </label>
                    <select
                      id="category"
                      {...register('category')}
                      className={`w-full py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-bold text-sm sm:text-base md:text-lg focus:outline-none px-3 sm:px-4 cursor-pointer ${
                        errors.category ? 'border-red-600' : 'border-red-600/30 focus:border-red-600'
                      }`}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="Environnement">Environnement</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Social">Social</option>
                      <option value="Alimentation">Alimentation</option>
                      <option value="Santé">Santé</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.category && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.category.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-black">Détails</h2>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      Décrivez votre besoin en détail
                    </label>
                    <textarea
                      id="description"
                      placeholder="Fournissez plus de contexte sur ce dont vous avez besoin et pourquoi. Incluez toute exigence spécifique ou délai."
                      {...register('description')}
                      rows={5}
                      className={`w-full py-3 sm:py-4 px-3 sm:px-4 border-2 rounded-xl bg-white text-black font-bold text-sm sm:text-base md:text-lg focus:outline-none resize-none ${
                        errors.description ? 'border-red-600' : 'border-green-600/30 focus:border-green-600'
                      }`}
                    />
                    {errors.description && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.description.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="urgencyLevel" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      Niveau d'Urgence
                    </label>
                    <select
                      id="urgencyLevel"
                      {...register('urgencyLevel')}
                      className={`w-full py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-bold text-sm sm:text-base md:text-lg focus:outline-none px-3 sm:px-4 cursor-pointer ${
                        errors.urgencyLevel ? 'border-red-600' : 'border-green-600/30 focus:border-green-600'
                      }`}
                    >
                      <option value="low">Faible - Peut attendre quelques semaines</option>
                      <option value="medium">Moyen - Nécessaire dans 1-2 semaines</option>
                      <option value="high">Élevé - Nécessaire ASAP</option>
                    </select>
                    {errors.urgencyLevel && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.urgencyLevel.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Location & Contact */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-black">Localisation & Contact</h2>
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      Dans quelle ville êtes-vous ?
                    </label>
                    <select
                      id="city"
                      {...register('city')}
                      className={`w-full py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-bold text-sm sm:text-base md:text-lg focus:outline-none px-3 sm:px-4 cursor-pointer ${
                        errors.city ? 'border-red-600' : 'border-red-600/30 focus:border-red-600'
                      }`}
                    >
                      <option value="">Sélectionnez votre ville</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Fez">Fez</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Agadir">Agadir</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Meknes">Meknes</option>
                      <option value="Oujda">Oujda</option>
                    </select>
                    {errors.city && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.city.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-xs sm:text-sm font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                      Numéro WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+212 6XX XXX XXX ou 06XX XXX XXX"
                        {...register('whatsapp')}
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 md:py-6 border-2 rounded-xl text-sm sm:text-base md:text-lg font-bold text-black ${
                          errors.whatsapp ? 'border-red-600' : 'border-red-600/30 focus:border-red-600'
                        }`}
                      />
                    </div>
                    {errors.whatsapp && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm font-bold">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.whatsapp.message}</span>
                      </div>
                    )}
                    <p className="text-[10px] sm:text-xs text-black/70 mt-2 font-bold">
                      Les membres de la communauté utiliseront ce numéro pour vous contacter. Votre numéro est gardé privé.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h2 className="font-serif text-2xl font-black text-black">Révision</h2>
                  </div>
                  
                  {/* Review Card */}
                  <div className="group relative overflow-hidden rounded-3xl border-4 border-[#C17A3F]/30 bg-white">
                    <div className="absolute inset-0 zellige-pattern opacity-[0.03]" />
                    <div className="relative p-8">
                      <h3 className="font-black text-black mb-6 text-xl">Vérifiez Votre Demande</h3>
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">Titre</p>
                          <p className="text-lg font-bold text-black">{getValues('title') || '(Non fourni)'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">Catégorie</p>
                          <p className="text-lg font-bold text-black">{getValues('category') || '(Non fourni)'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">Ville</p>
                          <p className="text-lg font-bold text-black">{getValues('city') || '(Non fourni)'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">Urgence</p>
                          <p className="text-lg font-bold text-black capitalize">
                            {getValues('urgencyLevel') === 'low' ? 'Faible' : getValues('urgencyLevel') === 'medium' ? 'Moyen' : 'Élevé'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">Description</p>
                          <p className="text-lg font-bold text-black line-clamp-3">
                            {getValues('description') || '(Non fourni)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-red-600 mb-1">WhatsApp</p>
                          <p className="text-lg font-bold text-black">{getValues('whatsapp') || '(Non fourni)'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Note Card */}
                  <div className="group relative overflow-hidden rounded-3xl border-4 border-green-600/30 bg-white">
                    <div className="absolute inset-0 zellige-pattern opacity-[0.03]" />
                    <div className="relative p-6">
                      <p className="text-base font-bold text-black">
                        <span className="text-red-600">Note :</span> Votre besoin sera visible par la communauté. Veuillez vous assurer que toutes les informations sont exactes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Bottom Moroccan Pattern Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C17A3F] to-[#2D8659] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 disabled:opacity-50 bg-white rounded-xl cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Retour
            </Button>

            {currentStep === 4 ? (
              <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto">
                {submitError && (
                  <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600 font-medium">{submitError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  form="post-need-form"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-[#D4AF37]/30 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Publication...
                    </>
                  ) : (
                    <>
                      Publier Votre Besoin
                      <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#C17A3F] hover:bg-[#A05A2E] text-white font-black px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-[#D4AF37]/30 cursor-pointer w-full sm:w-auto"
              >
                Étape Suivante
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

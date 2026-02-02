'use client'

import React from "react"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, User, Mail, MapPin, Lock, HandHeart, Shield, CheckCircle2, AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { signUp, signIn } from '@/lib/auth/actions'
import { useRouter } from 'next/navigation'

// Zod Schema for Register
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  city: z
    .string()
    .min(1, 'Veuillez sélectionner votre ville'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z
    .string()
    .min(1, 'Veuillez confirmer le mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null)
    setIsLoading(true)
    
    try {
      console.log('=== CLIENT: Starting signup ===')
      const result = await signUp(data.name, data.email, data.password)
      console.log('=== CLIENT: Signup result ===', result)
      
      if (result.error) {
        setSubmitError(result.error)
        setIsLoading(false)
      } else {
        // Rediriger vers login après inscription réussie
        // L'utilisateur devra se connecter manuellement
        setSubmitError(null)
        alert('Compte créé avec succès ! Redirection vers la page de connexion...')
        router.push('/auth/login?registered=true')
      }
    } catch (error) {
      console.error('=== CLIENT: Registration error ===', error)
      setSubmitError('Une erreur est survenue lors de l\'inscription')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] grid md:grid-cols-2 relative overflow-hidden">
      {/* Traditional Moroccan Background */}
      <div className="fixed inset-0 -z-10 zellige-pattern opacity-15" />
      
      {/* Left side - Enhanced Design with Background Image */}
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden p-8 lg:p-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/register.png"
            alt="Register Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 z-0" />
        </div>

        <div className="relative z-10 text-center max-w-md w-full my-12">
          {/* Back to Home Button - Desktop */}
          <Link 
            href="/" 
            className="hidden md:inline-flex items-center gap-2 text-white hover:text-green-400 font-bold mb-6 transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Retour à l'accueil</span>
          </Link>

          {/* Branding */}
          <h2 className="font-serif text-4xl font-black text-white mb-3 drop-shadow-lg">
            Créer un Impact
          </h2>
          <p className="text-white text-lg leading-relaxed font-medium mb-8 drop-shadow-md">
            Rejoignez notre communauté et commencez à faire la différence dès aujourd'hui.
          </p>

          <div className="flex items-center justify-center gap-2 text-white">
            <HandHeart className="w-4 h-4" />
            <span className="font-bold text-sm">Ensemble pour le Maroc</span>
            <span className="text-lg">🇲🇦</span>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Register Form */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 md:py-0 relative z-10 bg-white md:bg-transparent overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden mb-6 sm:mb-8 md:mb-10 text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Image
                src="/assets/logo.svg"
                alt="Dir-Khir Logo"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                priority
              />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-black mb-2">Dir-Khir</h1>
            <p className="text-green-600 font-bold text-xs sm:text-sm">Entraide Citoyenne</p>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border-l-4 border-green-600 bg-green-100 rounded-r-xl mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-black">Inscription</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-black mb-2 sm:mb-3">
              Rejoindre la Communauté
            </h1>
            <p className="text-black text-sm sm:text-base md:text-lg font-medium">
              Créez votre compte en 2 minutes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Nom Complet <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <Input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                {...register('name')}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-medium text-sm sm:text-base transition-all ${
                  errors.name ? 'border-red-500' : 'border-red-600/30 focus:border-red-600'
                }`}
              />
              </div>
              {errors.name && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Adresse Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                {...register('email')}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-medium text-sm sm:text-base transition-all ${
                  errors.email ? 'border-red-500' : 'border-red-600/30 focus:border-red-600'
                }`}
              />
              </div>
              {errors.email && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Ville <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600 pointer-events-none" />
              <select
                id="city"
                {...register('city')}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-medium text-sm sm:text-base focus:outline-none transition-all ${
                  errors.city ? 'border-red-500' : 'border-red-600/30 focus:border-red-600'
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
              </div>
              {errors.city && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Mot de Passe <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Au moins 8 caractères"
                {...register('password')}
                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-medium text-sm sm:text-base transition-all ${
                  errors.password ? 'border-red-500' : 'border-red-600/30 focus:border-red-600'
                }`}
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.password.message}
                </p>
              )}
              {!errors.password && password && password.length >= 8 && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Mot de passe valide
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Confirmer le Mot de Passe <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                {...register('confirmPassword')}
                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-4 sm:py-5 md:py-6 border-2 rounded-xl bg-white text-black font-medium text-sm sm:text-base transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-green-600/30 focus:border-green-600'
                }`}
              />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
              {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Les mots de passe correspondent
                </p>
              )}
            </div>

            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer mt-4 sm:mt-6 p-3 sm:p-4 bg-[#FFF8E7] rounded-xl border-2 border-red-600/20 hover:border-red-600/40 transition-all">
              <input 
                type="checkbox" 
                className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-red-600/30 text-red-600 focus:ring-red-600 focus:ring-2 transition-all flex-shrink-0" 
                required 
              />
              <span className="text-xs sm:text-sm text-black font-medium">
                J'accepte les{' '}
                <Link href="#" className="text-red-600 hover:text-red-700 font-bold underline-offset-2 hover:underline">
                  Conditions d'Utilisation
                </Link>{' '}
                et la{' '}
                <Link href="#" className="text-red-600 hover:text-red-700 font-bold underline-offset-2 hover:underline">
                  Politique de Confidentialité
                </Link>
              </span>
            </label>

            {submitError && (
              <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-red-600 font-medium">{submitError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 sm:h-14 mt-4 sm:mt-6 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création du compte...
                </span>
              ) : (
                <>
                  Créer un Compte
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 sm:mt-8 md:mt-10 text-center text-xs sm:text-sm text-black font-medium">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/login" className="text-red-600 hover:text-red-700 font-black transition-colors underline-offset-2 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

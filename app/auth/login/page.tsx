'use client'

import React from "react"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Mail, Lock, HandHeart, Shield, Users, Heart, Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from '@/lib/auth/actions'
import { useRouter } from 'next/navigation'

// Zod Schema for Login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)
    
    const result = await signIn(data.email, data.password)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] grid md:grid-cols-2 relative overflow-hidden">
      {/* Traditional Moroccan Background */}
      <div className="fixed inset-0 -z-10 zellige-pattern opacity-15" />
      
      {/* Left side - Enhanced Design with Background Image */}
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden p-8 lg:p-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/login.png"
            alt="Login Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
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
            Dir-Khir
          </h2>
          <p className="text-white text-lg leading-relaxed font-medium mb-8 drop-shadow-md">
            Rejoignez des milliers de citoyens qui font une vraie différence dans leurs communautés.
          </p>

          <div className="flex items-center justify-center gap-2 text-white">
            <HandHeart className="w-4 h-4" />
            <span className="font-bold text-sm">Solidarité Locale</span>
            <span className="text-lg">🇲🇦</span>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Login Form */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 md:py-0 relative z-10 bg-white md:bg-transparent">
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
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border-l-4 border-red-600 bg-red-100 rounded-r-xl mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-black">Connexion</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-black mb-2 sm:mb-3">
              Bienvenue
            </h1>
            <p className="text-black text-sm sm:text-base md:text-lg font-medium">
              Connectez-vous pour continuer à aider votre communauté
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Adresse Email
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
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-red-600/30 text-red-600 focus:ring-red-600 focus:ring-2 transition-all" 
                />
                <span className="text-black font-medium group-hover:text-red-600 transition-colors">Se souvenir de moi</span>
              </label>
              <Link href="#" className="text-red-600 hover:text-red-700 font-bold transition-colors text-xs sm:text-sm">
                Mot de passe oublié ?
              </Link>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                <>
                  Se Connecter
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-red-600/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white md:bg-transparent text-black font-bold">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="border-2 border-red-600/30 hover:border-red-600 hover:bg-red-50 bg-white text-black font-bold h-10 sm:h-12 rounded-xl transition-all text-xs sm:text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="hidden sm:inline">Google</span>
              <span className="sm:hidden">G</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-green-600/30 hover:border-green-600 hover:bg-green-50 bg-white text-black font-bold h-10 sm:h-12 rounded-xl transition-all text-xs sm:text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
              <span className="sm:hidden">GH</span>
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 sm:mt-8 md:mt-10 text-center text-xs sm:text-sm text-black font-medium">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-red-600 hover:text-red-700 font-black transition-colors underline-offset-2 hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

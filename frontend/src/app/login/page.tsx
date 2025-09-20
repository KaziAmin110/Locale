'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import GoogleAuth from '../components/auth/GoogleAuth'
import SignInForm from '../components/auth/SignInForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl mb-4">
            <Heart size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your CityMate account</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <GoogleAuth />
          
          <div className="flex w-full mt-6 items-center">
            <span className="bg-gray-300 h-[1px] w-1/2"></span>
            <span className="text-xs mx-2 text-gray-500 font-bold">OR</span>
            <span className="bg-gray-300 h-[1px] w-1/2"></span>
          </div>
          
          <SignInForm />
          
          <div className="flex justify-center w-full mt-6 items-center gap-2">
            <p className="text-gray-600">New to CityMate?</p>
            <Link
              href="/register"
               className="text-red-500 hover:text-red-600 font-medium"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
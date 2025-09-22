'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MoveRight } from 'lucide-react'
import { motion } from 'framer-motion'
import GoogleAuth from '../components/auth/GoogleAuth'
import SignInForm from '../components/auth/SignInForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="w-full h-full bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 opacity-30"
          style={{ backgroundSize: '400% 400%' }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg border border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Left Panel - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center p-12 bg-black/20 text-center border-r border-white/10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl mb-6 shadow-lg">
                <Heart size={40} className="text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white"
            >
              Find your CityMate.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-300 mt-4 max-w-sm"
            >
              Connect with people who share your passion for the city. Welcome
              back to the community.
            </motion.p>
          </div>

          {/* Right Panel - Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="text-left mb-8">
              <h2 className="text-3xl font-bold text-white">Sign In</h2>
              <p className="text-gray-400 mt-2">
                Enter your credentials to continue.
              </p>
            </div>

            <div className="space-y-6">
              <GoogleAuth />

              <div className="flex w-full items-center">
                <span className="bg-gray-600 h-[1px] w-full"></span>
                <span className="text-xs mx-4 text-gray-400 font-bold uppercase">
                  OR
                </span>
                <span className="bg-gray-600 h-[1px] w-full"></span>
              </div>

              <SignInForm />
            </div>

            <div className="text-center mt-8">
              <Link
                href="/register"
                className="group text-sm text-gray-300 hover:text-white transition-colors duration-300"
              >
                New to CityMate?{' '}
                <span className="font-semibold text-red-400 group-hover:underline">
                  Create an account
                </span>
                <MoveRight className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase'
import ChangeLanguage from '../components/ChangeLanguage'
import { useTranslation } from 'react-i18next'
import Input from '../components/Input'

const PageRegister = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    document.body.classList.add('bg-app')
    return () => {
      document.body.classList.remove('bg-app')
    }
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/Home')
    } catch (err) {
      console.log('Регистрация не удалась', err)
      setError(true)
    }
  }

  return (
    <div>
      <div className='absolute top-4 left-4'>
        <ChangeLanguage />
      </div>
      <div className='min-h-screen flex items-center justify-center px-4 py-12'>
        <form
          onSubmit={handleRegister}
          className='backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-3xl shadow-2xl w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 max-w-md space-y-6 text-white'
        >
          <h2 className='text-3xl text-black/80 font-extrabold text-center drop-shadow-sm'>
            {t('registerWelcome')}
          </h2>
          <p className='text-sm text-center text-white/80'>
            {t('registerSubtitle')}
          </p>

          <div>
            <label className='block text-sm mb-1 text-white/80'>
              {t('email')}
            </label>
            <div className='flex items-center bg-white/10 border border-white/30 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-300 transition-all'>
              <svg
                className='w-5 h-5 mr-2 text-white/60'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  d='M16 12l-4 4m0 0l-4-4m4 4V8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <Input
                value={email}
                name='email'
                placeholder='you@example.com'
                onChange={e => setEmail(e.target.value)}
                className='w-full bg-transparent text-white placeholder-white/50 outline-none'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm mb-1 text-white/80'>
              {t('password')}
            </label>
            <div className='flex items-center border border-white/30 bg-white/10 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition relative'>
              <svg
                className='w-5 h-5 mr-2 text-white/60'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path d='M12 11c0-.55.45-1 1-1h.01c.56 0 .99.45.99 1s-.43 1-.99 1h-.01c-.55 0-1-.45-1-1z' />
                <path d='M17 11V7a5 5 0 10-10 0v4m1 4h8a2 2 0 002-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 002 2z' />
              </svg>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                name='password'
                placeholder='••••••••'
                onChange={e => setPassword(e.target.value)}
                className='w-full outline-none text-white bg-transparent placeholder-white/50'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 text-sm text-blue-200 hover:underline'
              >
                {showPassword ? t('hide') : t('show')}
              </button>
            </div>
          </div>

          {error && (
            <div className='text-red-200 bg-red-500/20 p-2 text-sm rounded-xl text-center'>
              {t('registerError')}
            </div>
          )}

          <button
            type='submit'
            className='w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold hover:brightness-110 shadow-lg transition-all'
          >
            {t('register')}
          </button>

          <p className='text-center text-sm text-white/80'>
            {t('alreadyHaveAccount')}{' '}
            <Link to='/' className='underline text-white hover:text-blue-200'>
              {t('loginButton')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default PageRegister

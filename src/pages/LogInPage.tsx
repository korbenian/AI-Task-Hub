import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase'
import Input from '../../components/Input'

const LogInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    document.body.classList.add('bg-app')
    return () => {
      document.body.classList.remove('bg-app')
    }
  }, [])
  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/Home')
    } catch (err) {
      console.log('Не удалось войти', err)
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <form
        onSubmit={handleLogIn}
        className=' bg-gradient-to-br from-blue-500 via-purple-500 to-pin-500 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6'
      >
        <h2 className='text-2xl font-bold text-gray-800 text-center'>
          Вход в аккаунт
        </h2>

        <div>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
            name='email'
            className='w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Пароль'
            type='password'
            name='password'
            className='w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {error && (
          <div className='text-red-600 text-sm text-center'>
            Не удалось войти
          </div>
        )}

        <button
          type='submit'
          className='w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold hover:brightness-110 shadow-lg transition-all'
        >
          Войти
        </button>

        <p className='text-center text-sm text-gray-600'>
          У вас нет аккаунта?{' '}
          <Link
            to='/registerPage'
            className='underline text-white hover:text-blue-200e'
          >
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  )
}
export default LogInPage

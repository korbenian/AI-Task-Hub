import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
const ThemeButton = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved == 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <div className='flex'>
      <button
        onClick={toggleTheme}
        className='p-2 rounded-full bg-white-300 dark:bg-white text-black dark:text-white hover:scale-110 transition duration-300'
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  )
}
export default ThemeButton

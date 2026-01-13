import { useEffect, useState } from 'react'
import { useChatLogic } from '../components/useChatLogic'
import ThemeButton from '../components/ThemeButton'
import ChatInput from '../components/ChatInput'
import ChatList from './sidebar'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChangeLanguage from '../components/ChangeLanguage'

export default function Home () {
  // Импортируем логику отправки запроса и получения ответа из кастомного хука useChatLogic()
  // Import request/response logic from custom useChatLogic hook
  const { input, setInput, messages, loading, handleSend, LoadChat } =
    useChatLogic()
  const [showSidebar, setShowSidebar] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    const savedChatId = localStorage.getItem('chatId')
    if (savedChatId) {
      LoadChat(savedChatId)
    }
  }, [])

  return (
    <div className='flex h-screen bg-white dark:bg-[#1e1e2f] text-black dark:text-white overflow-hidden'>
      {/* Сайдбар */}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1e1e2f] shadow-lg transition-transform duration-300 z-40
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ChatList onSelect={LoadChat} />
      </div>

      {/* Контент */}
      {/* Main content area */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Шапка */}
        {/* Header */}
        <div className='fixed top-0 left-0 w-full z-50 flex items-center px-4 py-2 bg-white dark:bg-[#1e1e2f] shadow-md'>
          <button
            onClick={() => setShowSidebar(prev => !prev)}
            className='bg-gradient-to-r ml-[2vh] from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:brightness-110 hover:scale-105 transition duration-300'
          >
            {showSidebar ? t('close') : t('history')}
          </button>

          <Link
            to='/Board'
            className='bg-white-300 dark:bg-white text-black dark:text-white hover:text-blue-500 ml-4'
          >
            {t('boardLink')}
          </Link>
          <div className='ml-[5vh]'>
            <ChangeLanguage />
          </div>
          <div className=' ml-[5vh]'>
            <ThemeButton />
          </div>
        </div>

        {/* Основной чат */}
        {/* Main chat area */}
        <div className='flex-1 overflow-y-auto pt-[60px] pb-[140px] px-4'>
          <div className='flex flex-col max-w-3xl mx-auto space-y-4'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.role === 'user'
                    ? 'bg-blue-100 self-end text-black'
                    : 'bg-gray-200 self-start text-black'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className='self-center'>
                <div className='w-7 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
            {!loading && messages.length === 0 && (
              <div className='text-center text-gray-400 pt-20'>
                {t('startPrompt')}
              </div>
            )}
          </div>
        </div>
        {/* Поле ввода */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          placeholder={t('askPlaceholder')}
        />
      </div>
    </div>
  )
}

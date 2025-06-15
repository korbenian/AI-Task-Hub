import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../Firebase'
import ThemeButton from '../../components/ThemeButton'
import ChatList from './sidebar'

export default function Home () {
  const [input, setInput] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  )
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const user = getAuth().currentUser
    if (!user) return

    const userMessages = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessages])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        message: input
      })
      const reply = res.data.choices[0].message.content
      const assistantMessages = { role: 'assistant', content: reply }

      let activeChatId = chatId
      if (!chatId) {
        const newChatRef = await addDoc(
          collection(db, 'users', user.uid, 'chats'),
          {
            createdAt: serverTimestamp()
          }
        )
        activeChatId = newChatRef.id
        setChatId(activeChatId)
      }

      await addDoc(
        collection(db, 'users', user.uid, 'chats', activeChatId!, 'messages'),
        {
          role: 'user',
          content: input,
          createdAt: serverTimestamp()
        }
      )
      await addDoc(
        collection(db, 'users', user.uid, 'chats', activeChatId!, 'messages'),
        {
          role: 'assistant',
          content: reply,
          createdAt: serverTimestamp()
        }
      )

      setMessages(prev => [...prev, assistantMessages])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const LoadChat = async (chatId: string) => {
    const user = getAuth().currentUser
    if (!user) return

    const MessagesSnapShot = await getDocs(
      collection(db, 'users', user.uid, 'chats', chatId, 'messages')
    )

    const ChatUserList = MessagesSnapShot.docs.map(doc => {
      const data = doc.data()
      return {
        role: data.role as string,
        content: data.content as string
      }
    })

    setMessages(ChatUserList)
    setChatId(chatId)
    localStorage.setItem('chatId', chatId)
  }

  // Загрузка истории из localStorage
  useEffect(() => {
    const savedChatId = localStorage.getItem('chatId')
    if (savedChatId) {
      LoadChat(savedChatId)
    }
  }, [])

  return (
    <div
      transition-colors
      duration-500
      ease-in-out
      className='flex h-screen bg-white dark:bg-[#1e1e2f] text-black dark:text-white overflow-hidden'
    >
      {/* Сайдбар */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1e1e2f] shadow-lg transition-transform duration-300 z-40
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <ChatList onSelect={LoadChat} />
      </div>

      {/* Контент */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Шапка */}
        <div className='fixed top-0  left-0 w-full z-50 flex  items-center px-4 py-2 bg-white dark:bg-[#1e1e2f] shadow-md'>
          <button
            onClick={() => setShowSidebar(prev => !prev)}
            className='bg-gradient-to-r ml-[2vh] from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:brightness-110 hover:scale-105 transition duration-300'
          >
            {showSidebar ? 'Закрыть' : 'История'}
          </button>
          <ThemeButton />
        </div>

        {/* Основной чат */}
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
                <div className='w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
            {!loading && messages.length === 0 && (
              <div className='text-center text-gray-400 pt-20'>
                Готовы создавать?
              </div>
            )}
          </div>
        </div>

        {/* Поле ввода */}
        <div className='fixed bottom-0 left-0 w-full bg-white dark:bg-[#1e1e2f] p-4 shadow-md z-50'>
          <div className='relative max-w-3xl mx-auto'>
            <textarea
              className='bg-gray-100 dark:bg-gray-700 text-black dark:text-white w-full rounded-md px-3 py-2 pr-16 resize-none h-[12vh] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Задайте Ваш вопрос'
              onChange={e => setInput(e.target.value)}
              value={input}
            />
            <button
              className='absolute bottom-2 right-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
              onClick={handleSend}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

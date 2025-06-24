// hooks/useChatLogic.ts
import { useState } from 'react'
import axios from 'axios'
import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs
} from 'firebase/firestore'
import { db } from '../Firebase'

//
export function useChatLogic () {
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  )
  const [loading, setLoading] = useState(false)

  // Загрузка сохранённого чата
  // Load previously saved chat from localStorage
  const LoadChat = async (chatId: string) => {
    const user = getAuth().currentUser
    if (!user) return
    // Получаем сообщения из коллекции chats
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
  // Фукнция отправки и получения запроса от OpenRouter
  const handleSend = async () => {
    if (!input.trim()) return
    const user = getAuth().currentUser
    if (!user) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        message: input
      })

      const reply = res.data.choices[0].message.content
      const assistantMessage = { role: 'assistant', content: reply }

      let activeChatId = chatId
      if (!chatId) {
        const newChatRef = await addDoc(
          collection(db, 'users', user.uid, 'chats'),
          { createdAt: serverTimestamp() }
        )
        activeChatId = newChatRef.id
        setChatId(activeChatId)
      }
      // Сохраняем в коллекцию запрос под ролью user
      await addDoc(
        collection(db, 'users', user.uid, 'chats', activeChatId!, 'messages'),
        {
          role: 'user',
          content: userMessage.content,
          createdAt: serverTimestamp()
        }
      )
      // Сохраняем в коллекцию ответ нейросети под ролью assistant
      await addDoc(
        collection(db, 'users', user.uid, 'chats', activeChatId!, 'messages'),
        {
          role: 'assistant',
          content: assistantMessage.content,
          createdAt: serverTimestamp()
        }
      )

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    input,
    setInput,
    messages,
    loading,
    handleSend,
    LoadChat
  }
}

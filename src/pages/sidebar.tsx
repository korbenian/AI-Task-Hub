import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import {
  getDocs,
  collection,
  serverTimestamp,
  addDoc,
  doc
} from 'firebase/firestore'
import { db } from '../Firebase'
import { data } from 'react-router-dom'
import ThemeButton from '../../components/ThemeButton'

type ChatListProps = {
  onSelect: (id: string) => void
}

const ChatList = ({ onSelect }: ChatListProps) => {
  const [chats, setChats] = useState<{ id: string; createdAt?: any }[]>([])
  useEffect(() => {
    const FetchChats = async () => {
      const user = getAuth().currentUser
      if (!user) return
      const userdata = await getDocs(collection(db, 'users', user.uid, 'chats'))
      const dataUser = userdata.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setChats(dataUser)
    }
    FetchChats()
  }, [])
  return (
    <div className=''>
      {chats.map(chat => (
        <li
          key={chat.id}
          className='ml-[3%] cursor-pointer mb-2 text-blue-700 dark:text-blue-300'
          onClick={() => onSelect(chat.id)}
        >
          Чат : chat.id
        </li>
      ))}
    </div>
  )
}
export default ChatList

import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { getDocs, collection, Timestamp } from 'firebase/firestore'
import { db } from '../Firebase'

type Chat = {
  id: string
  createdAt?: Timestamp
}

const ChatList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const FetchChats = async () => {
      const user = getAuth().currentUser
      if (!user) return
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'chats'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[]
      setChats(data)
    }
    FetchChats()
  }, [])

  return (
    <ul className='ml-4'>
      {chats.map(chat => (
        <li
          key={chat.id}
          className='cursor-pointer mb-2 text-blue-700 dark:text-blue-300'
          onClick={() => onSelect(chat.id)}
        >
          Чат: {chat.id} <br />
          {chat.createdAt && (
            <span className='text-sm text-gray-500'>
              {chat.createdAt.toDate().toLocaleString()}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ChatList

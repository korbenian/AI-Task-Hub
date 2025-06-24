// src/components/chat/ChatInput.tsx
// Компонент содержащий в себе трекстовое поле для ввода запроса пользователем и кнопку отправки запроса
// A reusable component that renders the text input field and send button for the user prompt
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ChatInputProps {
  input: string
  setInput: (val: string) => void
  onSend: () => void
  placeholder?: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  input, //input: Current text value entered by the user.
  setInput, //setInput: Function to update the input state.
  onSend, //onSend: Function to trigger when the send button is clicked.
  placeholder // placeholder: Optional placeholder text for the textarea.
}) => {
  const { t } = useTranslation()
  return (
    // Container holding the textarea and send button, centered horizontally
    <div className='flex justify-center relative width-[80%] '>
      <textarea
        className=' bg-gray-100 dark:bg-gray-700 text-black dark:text-white w-[50%] rounded-md px-3 py-2 pr-16 resize-none h-[12vh] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder={placeholder}
        onChange={e => setInput(e.target.value)}
        value={input}
      />
      <button
        className='absolute bottom-2 ml-[38%] bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        onClick={onSend}
      >
        {t('send')}
      </button>
    </div>
  )
}

export default ChatInput

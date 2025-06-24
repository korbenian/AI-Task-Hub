import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ChangeLanguage = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const storedLang = localStorage.getItem('lang')
    if (storedLang) {
      i18n.changeLanguage(storedLang)
    }
  }, [i18n])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
  }

  return (
    <button onClick={toggleLanguage}>
      {i18n.language === 'en' ? 'EN' : 'RU'}
    </button>
  )
}

export default ChangeLanguage

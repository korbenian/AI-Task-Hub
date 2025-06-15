import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  console.log('📩 Message from client:', message)

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Task Hub'
        }
      }
    )
    res.json(response.data)
  } catch (err) {
    console.error('❌ Ошибка от OpenRouter:', err.response?.data || err.message)
    res.status(500).json({
      error: 'Ошибка при запросе к OpenRouter',
      details: err.response?.data || err.message
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))

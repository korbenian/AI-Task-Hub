import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import ThemeButton from '../components/ThemeButton'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


type Task = {
  id: string
  title: string
  description: string
}
type column = {
  id: string
  title: string
  tasks: Task[]
}

const Board = () => {
  const { t } = useTranslation()
  const [columns, setColumns] = useState<column[]>([])
  const user = getAuth().currentUser
  const boardId = 'default-board'

  useEffect(() => {
    const FetchUser = async () => {
      //Закружаем карточки из Firestore
      const data = doc(db, 'boards', boardId)
      const snap = await getDoc(data)
      if (!snap.exists()) return console.log(t('dataNotFound')) //Если данных нет вывести в консоль dataNotFound

      const boardData = snap.data()
      if (!boardData.columns || !Array.isArray(boardData.columns)) {
        console.log(t('invalidColumnFormat'))
        return
      }
      setColumns(boardData.columns)
    }
    FetchUser()
  }, [])

  function handleTaskChange (
    columnId: string,
    taskId: string,
    field: keyof Task,
    value: string
  ) {
    const updatedCols = columns.map(col => {
      //обновляем карточку на Firestore
      if (col.id !== columnId) return col

      const updatedTasks = col.tasks.map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
      )

      return { ...col, tasks: updatedTasks }
    })

    setColumns(updatedCols)

    updateDoc(doc(db, 'boards', boardId), {
      columns: updatedCols
    }).catch(err => console.error(t('updateError'), err))
  }

  async function handleDeleteTask (
    boardId: string,
    columnId: string,
    taskId: string
  ) {
    try {
      const boardRef = doc(db, 'boards', boardId)
      const snap = await getDoc(boardRef)
      if (!snap.exists()) return
      const board = snap.data()
      const UpdatedColumns = board.columns.map((col: any) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.filter((task: Task) => task.id !== taskId)
            }
          : col
      )
      await updateDoc(boardRef, { columns: UpdatedColumns })
      setColumns(UpdatedColumns)
    } catch (err) {
      console.log('Ошибка удаления данных:', err)
    }
  }

  async function AddTask (boardId: string, columnId: string, task: any) {
    //Фукнкция добавления карточки в доску
    if (!user) return console.log(t('userNotAuthorized'))
    try {
      const boardRef = doc(db, 'boards', boardId)
      const snap = await getDoc(boardRef)
      if (!snap.exists()) return

      const board = snap.data()
      const updatedColumns = board.columns.map((col: any) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      )
      await updateDoc(boardRef, { columns: updatedColumns })
      setColumns(updatedColumns)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='bg-white border-white-800 dark:bg-[#1e1e2f] min-h-screen p-6 transition-colors duration-300'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg shadow px-4 py-2 w-fit gap-4'>
          <Link
            to='/Home'
            className='text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline'
          >
            ← {t('back')}
          </Link>
          <ThemeButton />
        </div>
      </div>

      <div className='flex flex-wrap justify-center gap-8'>
        {columns.map(column => (
          <div
            key={column.id}
            className='bg-white dark:bg-[#2a2a3d] text-black dark:text-white p-4 rounded-2xl shadow-md w-72 transition-colors duration-300 border-2 border-white-800'
          >
            <h2 className='font-bold text-blue-500 text-xl mb-3'>
              {column.title}
            </h2>

            <button
              className=' text-sm text-blue-600 dark:text-blue-400 underline mb-4'
              onClick={() =>
                AddTask('default-board', column.id, {
                  id: Date.now().toString(),
                  title: "newTask",
description: "description"

                })
              }
            >
              + {t('addTask')}
            </button>

            <div className='space-y-3'>
              {column.tasks?.map(task => (
                <div
                  key={task.id}
                  className='bg-gray-100 p-3 rounded-xl shadow-sm'
                >
                  <input
                    className='w-full p-2 rounded-md mb-[1vh] bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={t(task.title)}

                    onChange={e =>
                      handleTaskChange(
                        column.id,
                        task.id,
                        'title',
                        e.target.value
                      )
                    }
                  />
                  <textarea
                    className='w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={t(task.description)}
                    onChange={e =>
                      handleTaskChange(
                        column.id,
                        task.id,
                        'description',
                        e.target.value
                      )
                    }
                  />{' '}
                  <button
                    onClick={() =>
                      handleDeleteTask(boardId, column.id, task.id)
                    }
                    className='text-red-600 text-xs mt-1 hover:underline'
                  >
                   {t('remove')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Board

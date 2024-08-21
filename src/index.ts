import fs from 'node:fs/promises'
import type { ArticleData, Data } from './types'

export async function getArticles(user_id: string, cursor: string = '0') {
  const resp = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      cursor,
      sort_type: 2,
    }),
  })
  if (!resp.ok)
    throw new Error(`HTTP error! status: ${resp.status}`)
  const data = await resp.json() as Data
  if (data.err_no !== 0)
    throw new Error(`Service error! err_no: ${data.err_no}, err_msg: ${data.err_msg}`)
  return data
}

export async function multipleArticles(user_id: string, cursor: string = '0', maxDepth: number = 3) {
  const depth = 0
  const fetchData = async (currentCursor: string, currentDepth: number): Promise<ArticleData[]> => {
    if (currentDepth > maxDepth)
      return []

    return new Promise<ArticleData[]>((resolve) => {
      getArticles(user_id, currentCursor).then(async (data) => {
        if (data.has_more) {
          const nextCursor = data.cursor
          const nextData = await fetchData(nextCursor, currentDepth + 1)
          resolve([...data.data, ...nextData])
        }
        else {
          resolve(data.data)
        }
      })
    })
  }
  return fetchData(cursor, depth)
}

async function starter() {
  const data = await multipleArticles('3966693685871694', '0', 2)
  fs.writeFile('data.json', JSON.stringify(data))
}

starter()

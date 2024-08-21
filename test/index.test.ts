import { describe, expect, it } from 'vitest'
import { getArticles, multipleArticles } from '../src'

describe('should', () => {
  it('get articles when cursor is 0', async () => {
    const articles = await getArticles('3966693685871694', '0')
    expect(articles.data.length).toEqual(10)
  })

  it('get all articles', async () => {
    const articles = await multipleArticles('3966693685871694', '0', 2)
    expect(articles.length).toEqual(30)
  })
})

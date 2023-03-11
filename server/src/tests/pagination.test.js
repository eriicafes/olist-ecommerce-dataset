const { parsePaginationParams } = require('../utils')

describe('parse pagination params', () => {
  it('should return default options when no params is provided', () => {
    const page = parsePaginationParams()

    expect(page).toStrictEqual({ offset: 0, skip: 0, limit: 20, sort: null })
  })

  it('should constraint limit range', () => {
    const results = [parsePaginationParams({ limit: 10 }), parsePaginationParams({ limit: 200 })]

    for (const result of results) {
      expect(result.limit).toBeGreaterThanOrEqual(20)
      expect(result.limit).toBeLessThanOrEqual(100)
    }
  })

  it('should ignore unspecified sort fields', () => {
    const result = parsePaginationParams({ sort: 'time' }, ['date'])

    expect(result.sort).toBeNull()
  })

  it('should negate sort order', () => {
    const result = parsePaginationParams({ sort: '-date' }, { sortFields: ['date'] })

    expect(result.sort.field).toBe('date')
    expect(result.sort.order).toBe(-1)
  })

  it('should return expected options when valid params are provided', () => {
    const page = parsePaginationParams({ offset: 1, limit: 30, sort: 'date' }, { sortFields: ['date', 'price'] })

    expect(page.offset).toBe(1)
    expect(page.skip).toBe(30)
    expect(page.limit).toBe(30)
    expect(page.sort).toStrictEqual({ field: 'date', order: 1 })
  })
})

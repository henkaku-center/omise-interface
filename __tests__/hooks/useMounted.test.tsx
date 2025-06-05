import { renderHook } from '@testing-library/react'
import { useMounted } from '@/hooks/useMounted'

describe('useMounted', () => {
  it('returns true after component mounts', () => {
    const { result } = renderHook(() => useMounted())
    expect(result.current).toBe(true)
  })
})

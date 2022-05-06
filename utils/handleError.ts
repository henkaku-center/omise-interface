export const getErrorMessageFromRaw = (error: Error): string => {
  const regexp = /execution reverted: ([a-zA-Z :]+)/
  const result = regexp.exec(error.message)
  return result && result.length > 1 ? result[1] : ''
}

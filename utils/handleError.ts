type ErrorWithData = Error & { data: { code: number; message: string } }

export const getErrorMessageFromRaw = (error: Error): string => {
  const e = error as ErrorWithData
  const regexp =
    /Error: VM Exception while processing transaction: reverted with reason string '([a-zA-Z :]+)'/
  const result = regexp.exec(e.data.message)
  return result && result.length > 1 ? result[1] : ''
}

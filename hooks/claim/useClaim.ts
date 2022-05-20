import { useToast } from '@/hooks/useToast'
import { useClaimToken } from '@/hooks/useClaimToken'
import { useCallback } from 'react'
import { useGetError } from '@/hooks/useGetError'

export const useClaim = () => {
  const { toast } = useToast()
  const { getError } = useGetError()
  const { claim, isClaiming } = useClaimToken({
    onError(error) {
      toast({
        title: 'Error',
        description: handleErrorMessage(error),
        status: 'error'
      })
    },
    onSuccess() {
      toast({
        title: 'Submitted',
        description: 'You got $HENKAKU', // TODO: Show the actual amount of henkaku earned
        status: 'success'
      })
    }
  })

  const handleErrorMessage = useCallback(
    (error: Error): string => {
      switch (getError(error)) {
        case 'INSUFFICIENT AMOUNT':
          return "You don't own a claimable point."
        case 'INSUFFICIENT FOUND':
          return 'Currently unable to claim.'
        case 'TX FAILED':
          return 'Transaction failed.'
        default:
          return 'Unknown Server Error'
      }
    },
    [getError]
  )

  return { claim, isClaiming }
}

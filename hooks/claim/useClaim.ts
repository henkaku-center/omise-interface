import { useToast } from '@/hooks/useToast'
import { useClaimToken } from '@/hooks/useClaimToken'
import { useCallback } from 'react'
import { useGetError } from '@/hooks/useGetError'
import useTranslation from 'next-translate/useTranslation'

export const useClaim = () => {
  const { toast } = useToast()
  const { t } = useTranslation('common')
  const { getError } = useGetError()
  const { claim, isClaiming } = useClaimToken({
    onError(error) {
      toast({
        title: t('claim.toast.error'),
        description: handleErrorMessage(error),
        status: 'error'
      })
    },
    onSuccess() {
      toast({
        title: t('claim.toast.submitted'),
        description: t('claim.toast.success'), // TODO: Show the actual amount of henkaku earned
        status: 'success'
      })
    }
  })

  const handleErrorMessage = useCallback(
    (error: Error): string => {
      switch (getError(error)) {
        case 'INSUFFICIENT AMOUNT':
          return t('claim.toast.insufficientAmount')
        case 'INSUFFICIENT FOUND':
          return t('claim.toast.insufficientFound')
        case 'TX FAILED':
          return t('claim.toast.txFailed')
        default:
          return t('claim.toast.defaultError')
      }
    },
    [getError, t]
  )

  return { claim, isClaiming }
}

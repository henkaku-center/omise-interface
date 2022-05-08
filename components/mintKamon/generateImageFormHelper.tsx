interface ErorrMessage {
  [key: string]: string
}

interface formType {
  name?: string
  imageFile?: string
  imageFileObject: any
}

const httpErrorMessages: ErorrMessage = {
  error4: 'There was a problem with the request',
  error400: 'There probably was an error with the data you submitted.',
  error403: 'The server did not allow the request.',
  error404: 'The server did not know what to do with the request.',
  error413:
    'The request payload was too large. Please choose an image below 4 megabytes.',
  error5: 'The server could not fulfill the request. Please try again later.',
  error500:
    'The server crashed and could not fulfill the request. Please try again later.'
}

const formError = (form: formType) => {
  const nameDescription = form.name ? '' : 'Please Enter your name'
  const fileDescription = form.imageFile
    ? ''
    : 'Please choose a profile picture'
  const fileImageObject = form.imageFileObject
    ? ''
    : 'Your profile picture could not be correctly processed.'
  const toastDescription = nameDescription + fileDescription + fileImageObject
  return toastDescription
}

const blobToBase64 = (blob: any): Promise<string> => {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result == 'string') {
        resolve(reader.result)
      } else {
        resolve('')
      }
    }
    reader.readAsDataURL(blob)
  })
}

export { formError, blobToBase64, httpErrorMessages }

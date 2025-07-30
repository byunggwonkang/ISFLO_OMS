import CryptoJS from 'crypto-js'

export function encrypt(text: string): string {
  const config = useRuntimeConfig()
  const key = CryptoJS.enc.Utf8.parse(config.public.aesKey)
  const iv = CryptoJS.enc.Utf8.parse(config.public.aesIv)

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

export function decrypt(base64CipherText: string): string {
  const config = useRuntimeConfig()
  const key = CryptoJS.enc.Utf8.parse(config.public.aesKey)
  const iv = CryptoJS.enc.Utf8.parse(config.public.aesIv)

  const decrypted = CryptoJS.AES.decrypt(base64CipherText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
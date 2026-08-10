// TOTP 2FA Code Generator Utility (RFC 6238 / RFC 4226)

function base32ToBytes(base32) {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  const cleanBase32 = base32.toUpperCase().replace(/[\s=-]/g, '')
  
  for (let i = 0; i < cleanBase32.length; i++) {
    const val = base32chars.indexOf(cleanBase32.charAt(i))
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }

  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2))
  }
  return new Uint8Array(bytes)
}

export async function generateTOTP(secret, timeStepSeconds = 30) {
  try {
    if (!secret || secret.trim().length < 8) return null

    const keyBytes = base32ToBytes(secret)
    if (keyBytes.length === 0) return null

    const epoch = Math.floor(Date.now() / 1000)
    const timeCounter = Math.floor(epoch / timeStepSeconds)

    // Convert time counter to 8-byte big-endian buffer
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setUint32(0, 0, false)
    view.setUint32(4, timeCounter, false)

    // HMAC-SHA1 using Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, buffer)
    const sigBytes = new Uint8Array(signature)

    const offset = sigBytes[sigBytes.length - 1] & 0xf
    const binary =
      ((sigBytes[offset] & 0x7f) << 24) |
      ((sigBytes[offset + 1] & 0xff) << 16) |
      ((sigBytes[offset + 2] & 0xff) << 8) |
      (sigBytes[offset + 3] & 0xff)

    const otp = binary % 1000000
    return otp.toString().padStart(6, '0')
  } catch (err) {
    console.error('TOTP generation error:', err)
    return null
  }
}

export function getSecondsRemaining(timeStepSeconds = 30) {
  const epoch = Math.floor(Date.now() / 1000)
  return timeStepSeconds - (epoch % timeStepSeconds)
}

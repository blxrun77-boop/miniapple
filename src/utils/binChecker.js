// BIN Checker Utility & Media Buying Cards Database

export const KNOWN_BINS = [
  { bin: '415609', bank: 'PST.NET (Ultima)', brand: 'VISA', type: 'Credit', country: 'US', countryName: 'USA', flag: '🇺🇸', rating: '★★★★★', fb: true, google: true, tiktok: true },
  { bin: '559900', bank: 'Brocard Ads (Mastercard)', brand: 'MASTERCARD', type: 'Debit', country: 'EE', countryName: 'Estonia', flag: '🇪🇪', rating: '★★★★★', fb: true, google: true, tiktok: true },
  { bin: '485932', bank: 'Capitalist Cards', brand: 'VISA', type: 'Prepaid', country: 'UK', countryName: 'United Kingdom', flag: '🇬🇧', rating: '★★★★☆', fb: true, google: false, tiktok: true },
  { bin: '532959', bank: 'Wallester Business', brand: 'MASTERCARD', type: 'Debit', country: 'EE', countryName: 'Estonia', flag: '🇪🇪', rating: '★★★★★', fb: true, google: true, tiktok: true },
  { bin: '440802', bank: 'EPN.net (Universal)', brand: 'VISA', type: 'Credit', country: 'US', countryName: 'USA', flag: '🇺🇸', rating: '★★★★★', fb: true, google: true, tiktok: true },
  { bin: '524937', bank: 'FlexCard (Commercial)', brand: 'MASTERCARD', type: 'Debit', country: 'UK', countryName: 'United Kingdom', flag: '🇬🇧', rating: '★★★★☆', fb: true, google: true, tiktok: false },
  { bin: '454313', bank: 'Leading Cards', brand: 'VISA', type: 'Credit', country: 'US', countryName: 'USA', flag: '🇺🇸', rating: '★★★★★', fb: true, google: true, tiktok: true },
  { bin: '516088', bank: 'AnyBill Ads', brand: 'MASTERCARD', type: 'Credit', country: 'GB', countryName: 'United Kingdom', flag: '🇬🇧', rating: '★★★★☆', fb: true, google: true, tiktok: true },
]

export function checkBinInfo(binInput) {
  const cleanBin = binInput.replace(/\D/g, '').substring(0, 6)
  if (cleanBin.length < 6) return null

  const match = KNOWN_BINS.find((b) => b.bin === cleanBin)
  if (match) return match

  // Fallback heuristic estimation for generic BINs
  const isVisa = cleanBin.startsWith('4')
  const isMastercard = cleanBin.startsWith('5')
  const isAmex = cleanBin.startsWith('3')

  return {
    bin: cleanBin,
    bank: 'Commercial Merchant Bank',
    brand: isVisa ? 'VISA' : isMastercard ? 'MASTERCARD' : isAmex ? 'AMEX' : 'DEBIT/CREDIT',
    type: 'Business / Commercial',
    country: 'US',
    countryName: 'United States',
    flag: '🌐',
    rating: '★★★☆☆',
    fb: true,
    google: true,
    tiktok: true,
    generic: true
  }
}

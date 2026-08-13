import { CHOSEONG } from '@/constants/search'

export const getChoseong = (text) => {
  return [...text]
    .map((character) => {
      const code = character.charCodeAt(0) - 0xac00

      return code >= 0 && code <= 11171 ? CHOSEONG[Math.floor(code / 588)] : character
    })
    .join('')
}

export const matchesCityName = (name, query) => {
  const keyword = query.trim()

  return !keyword || name.includes(keyword) || getChoseong(name).includes(keyword)
}

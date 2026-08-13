export const THEME_OPTIONS = [
  { value: 'auto', label: '자동' },
  { value: 'morning', label: '아침' },
  { value: 'afternoon', label: '낮' },
  { value: 'evening', label: '저녁' },
  { value: 'night', label: '밤' },
]

export const VALID_THEMES = THEME_OPTIONS.map(({ value }) => value)
export const TIME_THEMES = VALID_THEMES.filter((theme) => theme !== 'auto')

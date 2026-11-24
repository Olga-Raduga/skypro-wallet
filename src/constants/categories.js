export const CATEGORIES = [
  { key: 'food', label: 'Еда', icon: 'food', color: '#D9B6FF' },
  { key: 'transport', label: 'Транспорт', icon: 'transport', color: '#FFB53D' },
  { key: 'housing', label: 'Жильё', icon: 'housing', color: '#6EE4FE' },
  { key: 'joy', label: 'Развлечения', icon: 'entertainment', color: '#B0AEFF' },
  { key: 'education', label: 'Образование', icon: 'education', color: '#BCEC30' },
  { key: 'others', label: 'Другое', icon: 'other', color: '#FFB9B8' },
]

// Удобный словарь для быстрого получения русского названия по ключу (например, 'food' -> 'Еда')
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((item) => [item.key, item.label])
)
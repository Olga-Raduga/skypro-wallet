const numberFormatter = new Intl.NumberFormat('ru-RU')

export function formatMoney(value) {
  return `${numberFormatter.format(Number(value) || 0)} ₽`
}
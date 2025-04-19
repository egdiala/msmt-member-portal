export function formatNumberWithCommas(value: number, currency?: string) {
  const formatterOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currency || "ngn",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }

  return new Intl.NumberFormat("en-US", formatterOptions).format(value);
}

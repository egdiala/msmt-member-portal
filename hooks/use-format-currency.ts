export function formatNumberWithCommas(value: number, currency?: string) {
  const formatterOptions: any = currency
    ? {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }
    : {};

  return new Intl.NumberFormat("en-US", formatterOptions).format(value);
}

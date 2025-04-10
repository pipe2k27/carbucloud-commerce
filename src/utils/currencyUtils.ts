export function formatCurrency(
  value: number | string,
  currency = "ARS"
): string {
  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : value;

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });

  return formatter.format(numericValue);
}

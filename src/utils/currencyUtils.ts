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

export const fetchDolarOficialRate = async (): Promise<number | null> => {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares/oficial");
    if (!response.ok) {
      throw new Error("Failed to fetch Dólar Blue exchange rate");
    }
    const data = await response.json();
    const ventaRate = Number(data?.venta);
    return isNaN(ventaRate) ? null : ventaRate;
  } catch (error) {
    console.error("[fetchDolarBlueRate] Error:", error);
    return null;
  }
};

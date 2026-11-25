// Demo amounts are denominated in USD; no exchange-rate conversion is applied.
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const money = (value) => usd.format(value);

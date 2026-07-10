export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR", // Change to your preferred currency
    }).format(amount);
};
import { Transaction } from "@/interface";

export function getTransferConversionLabel(
  transaction: Transaction,
): string | null {
  if (transaction.subType !== "transfer") return null;

  const linked = transaction.linkedTransactionDetails;
  const targetBook = transaction.targetBookDetails;
  const bookCurrency = transaction.bookDetails?.currency;

  if (!linked?.amount || !targetBook?.currency || !bookCurrency) return null;
  if (targetBook.currency === bookCurrency) return null;

  const isCashOut = transaction.type === "cash_out";
  const sourceAmount = isCashOut ? transaction.amount : linked.amount;
  const targetAmount = isCashOut ? linked.amount : transaction.amount;
  const sourceCurrency = isCashOut ? bookCurrency : targetBook.currency;
  const targetCurrency = isCashOut ? targetBook.currency : bookCurrency;

  if (!sourceAmount || !targetAmount) return null;

  const rate = targetAmount / sourceAmount;
  const formattedRate =
    Math.abs(rate - Math.round(rate)) < 0.001
      ? Math.round(rate).toString()
      : rate.toFixed(2);

  return `1 ${sourceCurrency} = ${formattedRate} ${targetCurrency}`;
}

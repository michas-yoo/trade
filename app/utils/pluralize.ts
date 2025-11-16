export function pluralize(amount: number, words: string[]): string {
  if (amount % 10 === 1 && amount % 100 !== 11) {
    return words[0] as string;
  }

  if ([2, 3, 4].includes(amount % 10) && ![12, 13, 14].includes(amount % 100)) {
    return words[1] as string;
  }

  return words[2] as string;
}

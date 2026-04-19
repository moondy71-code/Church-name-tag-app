export function generateMemberId(prefix: string, number: number): string {
  return `${prefix}${String(number).padStart(4, "0")}`;
}
export type PositionCode =
  | "pastor"
  | "elder"
  | "deacon"
  | "deaconess"
  | "youth"
  | "student"
  | "newcomer"
  | "layperson";

export const positionOptions = [
  { value: "pastor" as PositionCode, ko: "목사", en: "Pastor" },
  { value: "elder" as PositionCode, ko: "장로", en: "Elder" },
  { value: "deacon" as PositionCode, ko: "집사", en: "Deacon" },
  { value: "deaconess" as PositionCode, ko: "권사", en: "Deaconess" },
  { value: "youth" as PositionCode, ko: "청년", en: "Youth" },
  { value: "student" as PositionCode, ko: "학생", en: "Student" },
  { value: "newcomer" as PositionCode, ko: "새신자", en: "Newcomer" },
  { value: "layperson" as PositionCode, ko: "평신도", en: "Layperson" },
];
export function getPositionLabel(
  value: string | undefined,
  language: "ko" | "en"
) {
  const found = positionOptions.find((item) => item.value === value);
  if (!found) return value || "";

  return language === "ko" ? found.ko : found.en;
}
export function normalizePosition(value: string | undefined): PositionCode {
  if (!value) return "layperson";

  switch (value) {
    case "목사":
    case "Pastor":
    case "pastor":
      return "pastor";

    case "장로":
    case "Elder":
    case "elder":
      return "elder";

    case "집사":
    case "Deacon":
    case "deacon":
      return "deacon";

    case "권사":
    case "Deaconess":
    case "deaconess":
      return "deaconess";

    case "청년":
    case "Youth":
    case "youth":
      return "youth";

    case "학생":
    case "Student":
    case "student":
      return "student";

    case "새신자":
    case "Newcomer":
    case "newcomer":
      return "newcomer";

    case "평신도":
    case "Layperson":
    case "layperson":
      return "layperson";

    default:
      return "layperson";
  }
}
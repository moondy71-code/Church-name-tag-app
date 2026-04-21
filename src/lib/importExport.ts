import { db, type Member, type AttendanceRecord, type AppSettings } from "@/lib/db";

export interface ExportData {
  version: number;
  exportedAt: string;
  members: Member[];
  attendance: AttendanceRecord[];
  settings?: AppSettings | null;
}

function toTime(value: Date | string | null | undefined): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isValidImportData(data: any): data is ExportData {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.members) &&
    Array.isArray(data.attendance)
  );
}

export function mergeMembers(localMembers: Member[], importedMembers: Member[]): Member[] {
  const map = new Map<string, Member>();

  for (const member of localMembers) {
    if (!member.memberId) continue;
    map.set(member.memberId, member);
  }

  for (const imported of importedMembers) {
    if (!imported.memberId) continue;

    const local = map.get(imported.memberId);

    if (!local) {
      map.set(imported.memberId, imported);
      continue;
    }

    const localUpdatedAt = toTime(local.updatedAt);
    const importedUpdatedAt = toTime(imported.updatedAt);

    if (importedUpdatedAt > localUpdatedAt) {
      map.set(imported.memberId, imported);
    }
  }

  return Array.from(map.values());
}

export function mergeAttendance(
  localAttendance: AttendanceRecord[],
  importedAttendance: AttendanceRecord[]
): AttendanceRecord[] {
  const map = new Map<string, AttendanceRecord>();

  const makeKey = (item: AttendanceRecord) => `${item.memberId}__${item.date}`;

  for (const item of localAttendance) {
    if (!item.memberId || !item.date) continue;
    map.set(makeKey(item), item);
  }

  for (const item of importedAttendance) {
    if (!item.memberId || !item.date) continue;

    const key = makeKey(item);

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

export async function exportAllData(): Promise<string> {
  const members = await db.members.toArray();
  const attendance = await db.attendance.toArray();
  const settings = await db.settings.get(1);

  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    members,
    attendance,
    settings: settings ?? null,
  };

  return JSON.stringify(data, null, 2);
}

export async function importAndMergeFromText(jsonText: string) {
  const parsed = JSON.parse(jsonText);

  if (!isValidImportData(parsed)) {
    throw new Error("Invalid import file");
  }

  const importedMembers = parsed.members.filter((m) => m.memberId);
  const importedAttendance = parsed.attendance.filter(
    (a) => a.memberId && a.date
  );

  await db.transaction("rw", db.members, db.attendance, async () => {
    const localMembers = await db.members.toArray();
    const localAttendance = await db.attendance.toArray();

    const mergedMembers = mergeMembers(localMembers, importedMembers);
    const mergedAttendance = mergeAttendance(localAttendance, importedAttendance);

    await db.members.bulkPut(mergedMembers);
    await db.attendance.bulkPut(mergedAttendance);
  });

  return {
    mergedMembers: importedMembers.length,
    mergedAttendance: importedAttendance.length,
  };
}

export async function importAndMergeFromFile(file: File) {
  const text = await file.text();
  return importAndMergeFromText(text);
}
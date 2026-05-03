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

  const importedMembers = parsed.members
    .filter((m) => m.memberId)
    .map(({ id, ...rest }: any) => rest as Member);

  const importedAttendance = parsed.attendance
    .filter((a) => a.memberId && a.date)
    .map(({ id, ...rest }: any) => rest as AttendanceRecord);

  const result = {
    newMembers: 0,
    updatedMembers: 0,
    skippedMembers: 0,
    newAttendance: 0,
    skippedAttendance: 0,
  };

  await db.transaction("rw", db.members, db.attendance, async () => {
    const localMembers = await db.members.toArray();
    const localAttendance = await db.attendance.toArray();

    const localMemberMap = new Map<string, Member>();
    for (const m of localMembers) {
      if (m.memberId) localMemberMap.set(m.memberId, m);
    }

    const localAttendanceMap = new Map<string, AttendanceRecord>();
    for (const a of localAttendance) {
      if (a.memberId && a.date) {
        localAttendanceMap.set(`${a.memberId}__${a.date}`, a);
      }
    }

    const membersToSave: Member[] = [];

    for (const imported of importedMembers) {
      if (!imported.memberId) continue;

      const existing = localMemberMap.get(imported.memberId);

      if (!existing) {
        const { id, ...rest } = imported as any;
        membersToSave.push(rest as Member);
        result.newMembers++;
        continue;
      }

      const existingTime = toTime(existing.updatedAt);
      const importedTime = toTime(imported.updatedAt);

      if (importedTime > existingTime) {
        membersToSave.push({
          ...imported,
          id: existing.id,
        });
        result.updatedMembers++;
      } else {
        result.skippedMembers++;
      }
    }

    const attendanceToSave: AttendanceRecord[] = [];

    for (const imported of importedAttendance) {
      if (!imported.memberId || !imported.date) continue;

      const key = `${imported.memberId}__${imported.date}`;
      const existing = localAttendanceMap.get(key);

      if (!existing) {
        const { id, ...rest } = imported as any;
        attendanceToSave.push(rest as AttendanceRecord);
        result.newAttendance++;
      } else {
        result.skippedAttendance++;
      }
    }

    if (membersToSave.length > 0) {
      await db.members.bulkPut(membersToSave);
    }

    if (attendanceToSave.length > 0) {
      await db.attendance.bulkPut(attendanceToSave);
    }
  });

  return result;
}

export async function importAndMergeFromFile(file: File) {
  const text = await file.text();
  return importAndMergeFromText(text);
}
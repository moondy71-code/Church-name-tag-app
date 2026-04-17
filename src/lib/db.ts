import Dexie, { type Table } from 'dexie';

export interface Member {
  id?: number;
  name: string; // computed full name for display/search
  lastName: string;
  firstName: string;
  photo?: string; // base64
  birthDate: string;
  phone: string;
  role: string;
  grade?: string;
  group?: string;
  customFields?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id?: number;
  memberId: number;
  memberName: string;
  date: string;
  time: string;
  scannedData: Record<string, string>;
  createdAt: Date;
}

export interface QrFieldConfig {
  id?: number;
  fields: string[];
}

export interface AppSettings {
  id?: number;
  churchName?: string;
  language?: string;
}

class ChurchDB extends Dexie {
  members!: Table<Member>;
  attendance!: Table<AttendanceRecord>;
  qrConfig!: Table<QrFieldConfig>;
  settings!: Table<AppSettings>;

  constructor() {
    super('ChurchNameTagDB');

    this.version(1).stores({
      members: '++id, name, phone, role, group',
      attendance: '++id, memberId, date, memberName',
      qrConfig: '++id',
    });

    this.version(2)
      .stores({
        members: '++id, name, lastName, firstName, phone, role, group',
        attendance: '++id, memberId, date, memberName',
        qrConfig: '++id',
      })
      .upgrade((tx) => {
        return tx.table('members').toCollection().modify((member) => {
          if (!member.lastName && !member.firstName) {
            member.lastName = '';
            member.firstName = member.name || '';
          }
        });
      });

    this.version(3).stores({
      members: '++id, name, lastName, firstName, phone, role, group',
      attendance: '++id, memberId, date, memberName',
      qrConfig: '++id',
      settings: '++id, churchName, language',
    });
  }
}

export const db = new ChurchDB();

db.on('populate', () => {
  db.qrConfig.add({
    fields: ['name', 'birthDate', 'phone', 'role', 'grade'],
  });

  db.settings.add({
    churchName: '',
    language: 'ko',
  });
});

export function buildFullName(lastName: string, firstName: string, lang?: string) {
  const last = lastName.trim();
  const first = firstName.trim();

  if (!last && !first) return '';
  if (!last) return first;
  if (!first) return last;

  const full = `${last}${first}`;
  const hasHangul = /[가-힣]/.test(full);

  return hasHangul ? `${last}${first}` : `${first} ${last}`;
}
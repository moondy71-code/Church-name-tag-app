import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ClipboardList, Download, Calendar, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { t } from '@/lib/i18n';

export default function AttendancePage() {
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const i = t();

  const records = useLiveQuery(
    () => db.attendance.where('date').equals(dateFilter).sortBy('time'),
    [dateFilter]
  );

  const members = useLiveQuery(() => db.members.toArray(), []);

  const exportToExcel = () => {
    if (!records?.length) return;

    const data = records.map((r) => {
      const member = members?.find((m) => String(m.id) === String(r.memberId));

      return {
        [i.excelName]: r.memberName,
        [i.excelBirthDate]: member?.birthDate || '',
        [i.excelDate]: r.date,
        [i.excelTime]: r.time,
        [i.excelMemberId]: r.memberId ?? '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, i.excelSheet);
    XLSX.writeFile(wb, i.excelFile(dateFilter));
  };

  const exportFullYearWorkbook = async () => {
    const allRecords = await db.attendance.toArray();
    const allMembers = await db.members.toArray();

    if (!allRecords.length) {
      alert(i.noAttendance);
      return;
    }

    const wb = XLSX.utils.book_new();

    // 1) 연간집계 시트 만들기
    const summaryMap = new Map<
      string,
      {
        memberId: number | string;
        memberName: string;
        birthDate: string;
        attendanceCount: number;
      }
    >();

    allRecords.forEach((r) => {
      const member = allMembers.find((m) => String(m.id) === String(r.memberId));
      const key = String(r.memberId);

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          memberId: r.memberId ?? '',
          memberName: r.memberName,
          birthDate: member?.birthDate || '',
          attendanceCount: 0,
        });
      }

      const current = summaryMap.get(key)!;
      current.attendanceCount += 1;
    });

    const summaryRows = Array.from(summaryMap.values())
      .sort((a, b) => {
        if (b.attendanceCount !== a.attendanceCount) {
          return b.attendanceCount - a.attendanceCount;
        }
        return a.memberName.localeCompare(b.memberName);
      })
      .map((row) => ({
        [i.excelName]: row.memberName,
        [i.excelBirthDate]: row.birthDate,
        [i.excelMemberId]: row.memberId,
        [i.excelAttendanceCount]: row.attendanceCount,
      }));

    const summaryWs = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, summaryWs, i.excelSummarySheet);

    // 2) 날짜별 시트 만들기
    const groupedByDate = new Map<string, typeof allRecords>();

    allRecords.forEach((r) => {
      if (!groupedByDate.has(r.date)) {
        groupedByDate.set(r.date, []);
      }
      groupedByDate.get(r.date)!.push(r);
    });

    const sortedDates = Array.from(groupedByDate.keys()).sort();

    sortedDates.forEach((date) => {
      const rows = groupedByDate
        .get(date)!
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((r) => {
          const member = allMembers.find((m) => String(m.id) === String(r.memberId));

          return {
            [i.excelName]: r.memberName,
            [i.excelBirthDate]: member?.birthDate || '',
            [i.excelDate]: r.date,
            [i.excelTime]: r.time,
            [i.excelMemberId]: r.memberId ?? '',
          };
        });

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, date);
    });

    XLSX.writeFile(wb, i.excelFullYearFile);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{i.attendanceTitle}</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportToExcel}
            disabled={!records?.length}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {i.downloadExcel}
          </Button>

          <Button
            variant="outline"
            onClick={exportFullYearWorkbook}
            className="gap-2"
          >
            <Files className="w-4 h-4" />
            {i.downloadFullYearExcel}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-auto"
        />
        <span className="text-sm text-muted-foreground">
          {i.attendanceCount(records?.length || 0)}
        </span>
      </div>

      {!records?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{i.noAttendance}</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl overflow-hidden name-tag-shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">{i.colName}</th>
                <th className="text-left px-4 py-3 font-medium">{i.colBirthDate}</th>
                <th className="text-left px-4 py-3 font-medium">{i.colTime}</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  {i.colMemberId}
                </th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => {
                const member = members?.find((m) => String(m.id) === String(r.memberId));

                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{r.memberName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {member?.birthDate || '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.time}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {r.memberId ?? '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
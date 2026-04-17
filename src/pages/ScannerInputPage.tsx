import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { t } from "@/lib/i18n";

interface ScanResult {
  success: boolean;
  name: string;
  message: string;
}

function parseScannedValue(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (parsed?.memberId !== undefined && parsed?.memberId !== null) {
      return String(parsed.memberId);
    }

    if (typeof parsed === 'string' || typeof parsed === 'number') {
      return String(parsed);
    }

    return null;
  } catch {
    return value;
  }
}

export default function ScannerInputPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [scanValue, setScanValue] = useState("");
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const i = t();
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  useEffect(() => {
    db.attendance.where("date").equals(today).count().then(setTodayCount);
  }, [today, lastResult]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawValue = scanValue.trim();
    if (!rawValue || isProcessing) return;
    
    console.log('scan raw value:', rawValue);

    setIsProcessing(true);

    try {
      const memberId = parseScannedValue(rawValue);
      console.log('parsed memberId:', memberId);

      if (!memberId) {
        setLastResult({
          success: false,
          name: "",
          message: i.invalidQr,
        });
        return;
      }

      const member =
        (await db.members.where("id").equals(memberId as never).first()) ||
        (await db.members.where("id").equals(Number(memberId) as never).first());

      if (!member) {
        setLastResult({
          success: false,
          name: "",
          message: i.memberNotFound,
        });
        return;
      }

      const existing = await db.attendance
        .where("date")
        .equals(today)
        .and((r) => String(r.memberId) === String(member.id))
        .first();

      const displayName =
        member.name || `${member.lastName || ""}${member.firstName || ""}`.trim();

      if (existing) {
        setLastResult({
          success: false,
          name: displayName,
          message: i.alreadyChecked,
        });
        return;
      }

      await db.attendance.add({
        memberId: member.id,
        memberName: displayName,
        date: today,
        time: format(new Date(), "HH:mm"),
        scannedData: { memberId },
        createdAt: new Date(),
      });

      setLastResult({
        success: true,
        name: displayName,
        message: i.attendanceDone,
      });
    } catch (error) {
      console.error(error);
      setLastResult({
        success: false,
        name: "",
        message: i.scanProcessingError,
      });
    } finally {
      setScanValue("");
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <div className="text-center text-xl font-bold">
        {today} · {i.todayAttendance(todayCount)}
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <div className="text-center text-muted-foreground">
          {i.scannerInstruction}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder={i.scanPlaceholder}
            className="w-full h-14 rounded-lg border px-4 text-center text-lg"
          />
       
        </form>
      </div>

      {lastResult && (
        <div
          className={`rounded-xl p-4 ${
            lastResult.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {lastResult.name && (
            <div className="font-bold text-lg">{lastResult.name}</div>
          )}
          <div>{lastResult.message}</div>
        </div>
      )}
    </div>
  );
}
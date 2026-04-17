import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { db } from '@/lib/db';
import { ScanLine, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { t } from '@/lib/i18n';

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

    return null;
  } catch {
    return null;
  }
}

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>('qr-reader-' + Date.now());
  const i = t();

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    db.attendance.where('date').equals(today).count().then(setTodayCount);
  }, [today, lastResult]);

  const startScan = async () => {
    try {
      const scanner = new Html5Qrcode(containerRef.current);
      scannerRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (text) => {
          try {
            const memberId = parseScannedValue(text);

            if (!memberId) {
              setLastResult({
                success: false,
                name: '',
                message: i.invalidQr,
              });
            } else {
              const member =
                (await db.members.where('id').equals(memberId as never).first()) ||
                (await db.members.where('id').equals(Number(memberId) as never).first());

              if (!member) {
                setLastResult({
                  success: false,
                  name: '',
                  message: i.memberNotFound,
                });
              } else {
                const existing = await db.attendance
                  .where('date')
                  .equals(today)
                  .and((r) => String(r.memberId) === String(member.id))
                  .first();

                const displayName =
                  member.name || `${member.lastName || ''}${member.firstName || ''}`.trim();

                if (existing) {
                  setLastResult({
                    success: false,
                    name: displayName,
                    message: i.alreadyChecked,
                  });
                } else {
                  await db.attendance.add({
                    memberId: member.id!,
                    memberName: displayName,
                    date: today,
                    time: format(new Date(), 'HH:mm'),
                    scannedData: { memberId },
                    createdAt: new Date(),
                  });

                  setLastResult({
                    success: true,
                    name: displayName,
                    message: i.attendanceDone,
                  });
                }
              }
            }
          } catch (error) {
            console.error(error);
            setLastResult({
              success: false,
              name: '',
              message: i.scanProcessingError,
            });
          }

          await scanner.pause(true);
          setTimeout(() => {
            try {
              scanner.resume();
            } catch {}
          }, 2000);
        },
        () => {}
      );
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
      }
    } catch {}
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <ScanLine className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">{i.scanTitle}</h1>
      </div>

      <div className="bg-card rounded-xl p-6 name-tag-shadow text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          {today} · {i.todayAttendance(todayCount)}
        </div>

        <div
          id={containerRef.current}
          className={`w-full aspect-square max-w-[300px] mx-auto rounded-xl overflow-hidden bg-muted ${
            !scanning ? 'flex items-center justify-center' : ''
          }`}
        >
          {!scanning && <ScanLine className="w-16 h-16 text-muted-foreground/30" />}
        </div>

        <Button
          onClick={scanning ? stopScan : startScan}
          size="lg"
          className="w-full gap-2"
        >
          <ScanLine className="w-5 h-5" />
          {scanning ? i.stopScan : i.startScan}
        </Button>
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-4 flex items-center gap-3 ${
              lastResult.success
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {lastResult.success ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}

            <div>
              {lastResult.name && <div className="font-bold">{lastResult.name}</div>}
              <div className="text-sm">{lastResult.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
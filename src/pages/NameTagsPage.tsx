import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Member } from '@/lib/db';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { getPositionLabel, normalizePosition } from "@/lib/positions";
import { getLang } from "@/lib/i18n";

function chunkArray<T>(arr: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function NameTagsPage() {
  const members = useLiveQuery(() => db.members.orderBy('name').toArray(), []);
  const qrConfig = useLiveQuery(() => db.qrConfig.toArray(), []);
  const settings = useLiveQuery(() => db.settings.get(1), []); // 🔥 추가
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const lang = getLang();
  const i = t();
      useEffect(() => {
      document.title = "Church Attendance Name Tags";
  }, []);
  const fields = qrConfig?.[0]?.fields || ['name', 'birthDate', 'phone', 'role', 'grade'];

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === members?.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(members?.map((m) => m.id!)));
    }
  };

 const buildQrData = (m: Member) => {
  return m.memberId || "";
};

  const printSelected = () => {
    window.print();
  };

  const selectedMembers = members?.filter((m) => selected.has(m.id!)) || [];

  const pagedMembers = chunkArray(selectedMembers, 8);

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{i.nameTagTitle}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={selectAll}>
            {selected.size === members?.length ? i.deselectAll : i.selectAll}
          </Button>
          <Button onClick={printSelected} disabled={!selected.size} className="gap-2">
            <Printer className="w-4 h-4" />
            {i.print} ({selected.size})
          </Button>
        </div>
      </div>

      {/* Selection list */}
      <div className="no-print grid gap-2">
        {members?.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleSelect(m.id!)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
              selected.has(m.id!) ? 'border-accent bg-accent/10' : 'border-border hover:bg-muted/50'
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected.has(m.id!) ? 'bg-accent border-accent' : 'border-muted-foreground/30'
              }`}
            >
              {selected.has(m.id!) && <Check className="w-3 h-3 text-accent-foreground" />}
            </div>

            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
              {m.photo ? (
                <img src={m.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {m.name?.[0] || ''}
                </div>
              )}
            </div>

            <span className="font-medium">{m.name}</span>
            {m.role && (
          <span className="text-xs text-muted-foreground">
            {getPositionLabel(normalizePosition(m.role), lang)}
          </span>
        )}
          </button>
        ))}

        {!members?.length && (
          <div className="text-center py-16 text-muted-foreground">
            {i.registerFirst}
          </div>
        )}
      </div>

      {/* Printable name tags — 93mm × 62mm, photo left, name + QR right */}
          {selectedMembers.length > 0 && (
        <div className="space-y-4 print:space-y-0">
          {pagedMembers.map((pageMembers, pageIndex) => (
            <div
              key={pageIndex}
              className="print-page grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-1 print:px-1"
            >
              {pageMembers.map((m) => {
                const isHangulName = /[가-힣]/.test(`${m.lastName || ''}${m.firstName || ''}`);

                return (
                  <div
                    key={m.id}
                    className="badge-card bg-card rounded-xl border border-border flex overflow-hidden name-tag-shadow print:break-inside-avoid print:shadow-none print:border print:rounded-lg print:scale-[0.97] origin-top"
                    style={{ width: '97mm', height: '65mm' }}
                  >
                    {/* Left: Photo */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center bg-muted"
                      style={{ width: '40mm', height: '60mm', padding: '3mm 2mm 0mm 2mm' }}
                    >
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={m.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                          {m.name?.[0] || ''}
                        </div>
                      )}
                    </div>

                    {/* Right: Name top, QR bottom */}
                    <div className="flex-1 flex flex-col justify-between p-3 min-w-0">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="uppercase text-muted-foreground w-full"
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                          }}
                        >
                          {settings?.churchName?.trim() || i.churchName}
                        </div>

                        <div className="w-full flex flex-col items-center justify-center mt-1">
                          {isHangulName ? (
                            <div
                              style={{
                                fontSize: 'clamp(28px, 7vw, 44px)',
                                fontWeight: 800,
                                lineHeight: 1.05,
                                width: '100%',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {`${m.lastName || ''}${m.firstName || ''}`}
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  fontSize: 'clamp(22px, 4vw, 36px)',
                                  fontWeight: 800,
                                  lineHeight: 1.05,
                                  width: '100%',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {m.firstName || '\u00A0'}
                              </div>

                              <div
                                style={{
                                  fontSize: 'clamp(18px, 3.5vw, 28px)',
                                  fontWeight: 800,
                                  lineHeight: 1.05,
                                  width: '100%',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {m.lastName || '\u00A0'}
                              </div>
                            </>
                          )}
                        </div>

                        {m.role && (
                          <div className="text-lg text-accent font-semibold mt-2 text-center">
                            {m.role}
                          </div>
                        )}
                      </div>

                      {/* Bottom: QR */}
                      <div className="flex justify-center">
                        <QRCodeSVG
                          value={buildQrData(m)}
                          size={90}
                          level="M"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
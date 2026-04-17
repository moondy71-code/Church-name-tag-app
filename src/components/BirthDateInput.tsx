import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n';

interface Props {
  value: string; // YYYY-MM-DD or YYYYMMDD or partial
  onChange: (value: string) => void;
}

export default function BirthDateInput({ value, onChange }: Props) {
  const i = t();
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // Parse existing value
  const parsed = value.replace(/-/g, '');
  const year = parsed.slice(0, 4);
  const month = parsed.slice(4, 6);
  const day = parsed.slice(6, 8);

  const update = (y: string, m: string, d: string) => {
    // Only allow digits
    y = y.replace(/\D/g, '').slice(0, 4);
    m = m.replace(/\D/g, '').slice(0, 2);
    d = d.replace(/\D/g, '').slice(0, 2);
    if (y || m || d) {
      onChange(`${y}-${m.padStart(m.length > 0 ? 2 : 0, '0')}-${d.padStart(d.length > 0 ? 2 : 0, '0')}`.replace(/^-+|-+$/g, '') || '');
      // Store as YYYYMMDD internally
      onChange([y, m, d].filter(Boolean).join('-'));
    } else {
      onChange('');
    }
  };

  const handleYear = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4);
    update(clean, month, day);
    if (clean.length === 4) {
      monthRef.current?.focus();
    }
  };

  const handleMonth = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 2);
    update(year, clean, day);
    if (clean.length === 2) {
      dayRef.current?.focus();
    }
  };

  const handleDay = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 2);
    update(year, month, clean);
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        value={year}
        onChange={(e) => handleYear(e.target.value)}
        placeholder="YYYY"
        className="w-[72px] text-center"
        maxLength={4}
        inputMode="numeric"
      />
      <span className="text-muted-foreground">/</span>
      <Input
        ref={monthRef}
        value={month}
        onChange={(e) => handleMonth(e.target.value)}
        placeholder="MM"
        className="w-[52px] text-center"
        maxLength={2}
        inputMode="numeric"
      />
      <span className="text-muted-foreground">/</span>
      <Input
        ref={dayRef}
        value={day}
        onChange={(e) => handleDay(e.target.value)}
        placeholder="DD"
        className="w-[52px] text-center"
        maxLength={2}
        inputMode="numeric"
      />
    </div>
  );
}

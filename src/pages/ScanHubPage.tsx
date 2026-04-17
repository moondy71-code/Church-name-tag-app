import { useState } from 'react';
import { Keyboard, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import ScanPage from './ScanPage';
import ScannerInputPage from './ScannerInputPage';

type ScanMode = 'menu' | 'scanner' | 'camera';

export default function ScanHubPage() {
  const [mode, setMode] = useState<ScanMode>('menu');
  const i = t();

  if (mode === 'scanner') {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setMode('menu')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <ScannerInputPage />
      </div>
    );
  }

  if (mode === 'camera') {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setMode('menu')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <ScanPage />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{i.scanTitle}</h1>
        <p className="text-sm text-muted-foreground">
          출석 스캔 방식을 선택하세요
        </p>
      </div>

      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setMode('scanner')}
          className="rounded-2xl border bg-card p-6 text-left shadow-sm hover:bg-muted/40 transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <Keyboard className="w-6 h-6 text-primary" />
            <div className="text-lg font-semibold">전문 스캐너</div>
          </div>
          <p className="text-sm text-muted-foreground">
            바코드/QR 스캐너가 키보드처럼 값을 입력하는 방식입니다.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setMode('camera')}
          className="rounded-2xl border bg-card p-6 text-left shadow-sm hover:bg-muted/40 transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-6 h-6 text-primary" />
            <div className="text-lg font-semibold">카메라 스캔</div>
          </div>
          <p className="text-sm text-muted-foreground">
            태블릿이나 휴대폰 카메라로 QR을 비춰 출석 처리합니다.
          </p>
        </button>
      </div>
    </div>
  );
}
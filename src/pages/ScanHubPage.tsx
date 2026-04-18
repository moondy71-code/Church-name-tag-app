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
          {i.back}
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
          {i.back}
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
          {i.scanHubDescription}
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
            <div className="text-lg font-semibold">{i.professionalScanner}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            {i.professionalScannerDescription}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setMode('camera')}
          className="rounded-2xl border bg-card p-6 text-left shadow-sm hover:bg-muted/40 transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-6 h-6 text-primary" />
            <div className="text-lg font-semibold">{i.cameraScan}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            {i.cameraScanDescription}
          </p>
        </button>
      </div>
    </div>
  );
}
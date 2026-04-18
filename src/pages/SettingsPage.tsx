import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { t, getLang, setLang, type Lang } from '@/lib/i18n';

type BackupData = {
  version: number;
  exportedAt: string;
  members: any[];
  attendance: any[];
  settings: any[];
};

export default function SettingsPage() {
  const appSettings = useLiveQuery(() => db.settings.get(1), []);
  const [churchName, setChurchName] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [language, setLanguageState] = useState<Lang>(getLang());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const i = t();


  useEffect(() => {
    if (appSettings?.churchName !== undefined) {
      setChurchName(appSettings.churchName || '');
    }
  }, [appSettings]);
  useEffect(() => {
    if (appSettings?.groups) {
      setGroups(appSettings.groups);
    }
}, [appSettings]);
  useEffect(() => {
    if (appSettings?.language === 'ko' || appSettings?.language === 'en') {
      setLanguageState(appSettings.language);
    }
  }, [appSettings]);


  const saveChurchName = async () => {
    await db.settings.put({
      ...appSettings,
      id: 1,
      churchName: churchName.trim(),
      language: appSettings?.language || getLang(),
    });

    alert(i.savedChurchName);
  };
const addGroup = () => {
  if (!newGroup.trim()) return;
  setGroups((prev) => [...prev, newGroup.trim()]);
  setNewGroup('');
};

const removeGroup = (index: number) => {
  setGroups((prev) => prev.filter((_, i) => i !== index));
};

const saveGroups = async () => {
  await db.settings.put({
    ...appSettings,
    id: 1,
    churchName: appSettings?.churchName || '',
    language: appSettings?.language || getLang(),
    groups,
  });

  alert("Groups saved");
};
  const saveLanguage = async () => {
    await db.settings.put({
      ...appSettings,
      id: 1,
      churchName: appSettings?.churchName || '',
      language,
    });

    setLang(language);
    alert(i.savedLanguage);
    window.location.reload();
  };

  const exportBackup = async () => {
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      members: await db.members.toArray(),
      attendance: await db.attendance.toArray(),
      settings: await db.settings.toArray(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(i.exportSuccess);
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as BackupData;

    if (
      !parsed ||
      !Array.isArray(parsed.members) ||
      !Array.isArray(parsed.attendance) ||
      !Array.isArray(parsed.settings)
    ) {
      alert(i.invalidBackupFile);
      return;
    }

    if (!confirm(i.confirmImportOverwrite)) {
      return;
    }

    await db.transaction(
      'rw',
      db.members,
      db.attendance,
      db.settings,
      async () => {
        await db.members.clear();
        await db.attendance.clear();
        await db.settings.clear();

        if (parsed.members.length) {
          await db.members.bulkPut(parsed.members);
        }
        if (parsed.attendance.length) {
          await db.attendance.bulkPut(parsed.attendance);
        }

        if (parsed.settings.length) {
          await db.settings.bulkPut(parsed.settings);
        }
      }
    );

    const importedSettings = await db.settings.get(1);
    if (importedSettings?.language === 'ko' || importedSettings?.language === 'en') {
      setLang(importedSettings.language);
    }

    alert(i.importSuccess);
    window.location.reload();
  };

  const handleImportFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importBackup(file);
    } catch (error) {
      console.error(error);
      alert(i.importFailed);
    } finally {
      e.target.value = '';
    }
  };

  const clearAllData = async () => {
    if (confirm(i.confirmDeleteAll)) {
      await db.members.clear();
      await db.attendance.clear();
      alert(i.deletedAll);
    }
  };
return (
  <div className="space-y-8 max-w-2xl">
    <div className="flex items-center gap-3">
      <Settings className="w-6 h-6 text-primary" />
      <h1 className="text-2xl font-bold">{i.settingsTitle}</h1>
    </div>

    <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
      <h2 className="font-bold">{i.languageLabel}</h2>
      <p className="text-sm text-muted-foreground">{i.languageHint}</p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant={language === 'ko' ? 'default' : 'outline'}
          onClick={() => setLanguageState('ko')}
        >
          {i.langKorean}
        </Button>

        <Button
          type="button"
          variant={language === 'en' ? 'default' : 'outline'}
          onClick={() => setLanguageState('en')}
        >
          {i.langEnglish}
        </Button>
      </div>

      <Button onClick={saveLanguage} className="gap-2">
        <Save className="w-4 h-4" /> {i.saveLanguage}
      </Button>
    </div>

    <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
      <h2 className="font-bold">{i.churchNameLabel}</h2>
      <p className="text-sm text-muted-foreground">{i.churchNameHint}</p>

      <Input
        value={churchName}
        onChange={(e) => setChurchName(e.target.value)}
        placeholder={i.churchNamePlaceholder}
      />

      <Button onClick={saveChurchName} className="gap-2">
        <Save className="w-4 h-4" /> {i.saveChurchName}
      </Button>
    </div>

    <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
      <h2 className="font-bold">Groups</h2>

      <div className="flex gap-2">
        <Input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="New group"
          className="flex-1"
        />
        <Button onClick={addGroup}>Add</Button>
      </div>

      <div className="space-y-2">
        {groups.map((g, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-muted p-2 rounded"
          >
            <span>{g}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeGroup(idx)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={saveGroups} className="gap-2">
        <Save className="w-4 h-4" />
        Save Groups
      </Button>
    </div>

    <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5 text-primary" />
        <h2 className="font-bold">{i.dataBackupTitle}</h2>
      </div>

      <p className="text-sm text-muted-foreground">{i.dataBackupHint}</p>

      <div className="flex flex-wrap gap-3">
        <Button onClick={exportBackup} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          {i.exportData}
        </Button>

        <Button onClick={openImportDialog} className="gap-2">
          <Upload className="w-4 h-4" />
          {i.importData}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportFileChange}
        className="hidden"
      />
    </div>

    <div className="bg-destructive/5 rounded-xl p-6 border border-destructive/20 space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="w-5 h-5" />
        <h2 className="font-bold">{i.dangerZone}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{i.dangerHint}</p>
      <Button variant="destructive" onClick={clearAllData} className="gap-2">
        <Trash2 className="w-4 h-4" /> {i.deleteAll}
      </Button>
    </div>
  </div>
);
}
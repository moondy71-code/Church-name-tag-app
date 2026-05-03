import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
  Settings,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { t, getLang, setLang, type Lang } from '@/lib/i18n';
import { toast } from "sonner";
import { exportAllData, importAndMergeFromFile, importAndMergeFromText } from '@/lib/importExport';
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Globe } from "lucide-react";
import { Building } from "lucide-react";
import { Hash } from "lucide-react";
import { Users } from "lucide-react";
import {
  backupToDrive,
  loadBackupFromDrive,
} from "@/lib/googleDrive";
import { text } from 'stream/consumers';


export default function SettingsPage() {
  const appSettings = useLiveQuery(() => db.settings.get(1), []);
  const [churchName, setChurchName] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [prefix, setPrefix] = useState("");
  const [newGroup, setNewGroup] = useState('');
  const [language, setLanguageState] = useState<Lang>(getLang());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const i = t();

  const [lastGoogleBackup, setLastGoogleBackup] = useState<string | null>(null);
  const [lastGoogleImport, setLastGoogleImport] = useState<string | null>(null);

  useEffect(() => {
    if (appSettings?.churchName !== undefined) {
      setChurchName(appSettings.churchName || '');
    }
  }, [appSettings]);

  useEffect(() => {
    if (appSettings?.memberIdPrefix) {
      setPrefix(appSettings.memberIdPrefix);
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

    toast.success(i.savedChurchName);
  };
  const savePrefix = async () => {
    const cleanPrefix = prefix.trim();

    if (!cleanPrefix) {
      toast.success(i.invalidPrefix);
      return;
    }

    await db.settings.put({
      ...appSettings,
      id: 1,
      churchName: appSettings?.churchName || '',
      language: appSettings?.language || getLang(),
      groups: appSettings?.groups || [],
      memberIdPrefix: cleanPrefix,
      memberIdNextNumber: appSettings?.memberIdNextNumber || 1,
    });

    toast.success(i.prefixSaved);
  };

  const addGroup = async () => {
    const value = newGroup.trim();
    if (!value) return;

    const nextGroups = [...groups, value];

    setGroups(nextGroups);
    setNewGroup('');

    await db.settings.put({
      ...appSettings,
      id: 1,
      churchName: appSettings?.churchName || '',
      language: appSettings?.language || getLang(),
      groups: nextGroups,
    });
  };

  const removeGroup = async (index: number) => {
    const nextGroups = groups.filter((_, i) => i !== index);

    setGroups(nextGroups);

    await db.settings.put({
      ...appSettings,
      id: 1,
      churchName: appSettings?.churchName || '',
      language: appSettings?.language || getLang(),
      groups: nextGroups,
    });
  };


  const exportBackup = async () => {
    const json = await exportAllData();

    const blob = new Blob([json], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(i.exportSuccess);
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  const importBackup = async (file: File) => {
    if (!confirm(i.confirmImportOverwrite)) {
      return;
    }

    await importAndMergeFromFile(file);

    const currentSettings = await db.settings.get(1);
    if (currentSettings?.language === 'ko' || currentSettings?.language === 'en') {
      setLang(currentSettings.language);
      setLanguageState(currentSettings.language);
    }

    toast.success(i.importSuccess);
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
      toast.success(i.importFailed);
    } finally {
      e.target.value = '';
    }
  };

  const onGoogleBackup = async () => {
    try {
      const data = await exportAllData(); // 기존 export 함수 사용

      await backupToDrive(data);

      const now = new Date().toISOString();
      setLastGoogleBackup(now);

      toast.success("Google Drive 저장 완료");
    } catch (e) {
      console.error(e);
      toast.error("Google Drive 저장 실패");
    }
  };

  const onGoogleImport = async () => {
    try {
      const data = await loadBackupFromDrive();

      if (!data) {
        toast.error("백업 파일 없음");
        return;
      }

      const text =
        typeof data === "string" ? data : JSON.stringify(data);

      const result = await importAndMergeFromText(text);

      const now = new Date().toISOString();
      setLastGoogleImport(now);

      const currentSettings = await db.settings.get(1);
      if (currentSettings?.language === "ko" || currentSettings?.language === "en") {
        setLang(currentSettings.language);
        setLanguageState(currentSettings.language);
      }

      toast.success(
        i.importResult
          .replace("{{newMembers}}", String(result.newMembers))
          .replace("{{updatedMembers}}", String(result.updatedMembers))
          .replace("{{newAttendance}}", String(result.newAttendance))
      );


    } catch (e) {
      console.error(e);
      toast.error("Google Drive 불러오기 실패");
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
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{i.languageLabel}</h2>
        </div>

        <p className="text-sm text-muted-foreground">{i.languageHint}</p>

        <div className="flex gap-3">
          <div className="flex gap-3">
            <Button
              type="button"
              variant={language === 'ko' ? 'default' : 'outline'}
              onClick={async () => {
                setLanguageState('ko');
                setLang('ko');

                await db.settings.put({
                  ...appSettings,
                  id: 1,
                  churchName: appSettings?.churchName || "",
                  language: "ko",
                  groups: appSettings?.groups || [],
                  memberIdPrefix: prefix.trim() || "MyChurch",
                  memberIdNextNumber: appSettings?.memberIdNextNumber || 1,
                });
              }}
            >
              한국어
            </Button>

            <Button
              type="button"
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={async () => {
                setLanguageState('en');
                setLang('en');

                await db.settings.put({
                  ...appSettings,
                  id: 1,
                  churchName: appSettings?.churchName || "",
                  language: "en",
                  groups: appSettings?.groups || [],
                  memberIdPrefix: prefix.trim() || "Moon",
                  memberIdNextNumber: appSettings?.memberIdNextNumber || 1,
                });
              }}
            >
              English
            </Button>
          </div>
        </div>

      </div>

      <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{i.churchNameLabel}</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {i.churchNameHint}
        </p>

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
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{i.memberIdPrefix}</h2>
        </div>

        <div className="flex gap-2">
          <Input
            value={prefix}
            onChange={(e) =>
              setPrefix(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
            }
            placeholder={i.prefixPlaceholder}
          />
          <Button type="button" onClick={savePrefix}>
            {i.savePrefix}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {i.prefixDescription}
        </p>
      </div>
      <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{i.groups}</h2>
        </div>

        <div className="flex gap-2">
          <Input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder={i.groupName}
            className="flex-1"
          />
          <Button onClick={addGroup}>{i.addGroup}</Button>
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
                {i.delete}
              </Button>
            </div>
          ))}
        </div>

      </div>

      <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-bold">{i.dataBackupTitle}</h2>
        </div>

        <p className="text-sm text-muted-foreground">{i.dataBackupHint}</p>

        <div className="flex flex-col gap-2">

          {/* Export */}
          <Button onClick={exportBackup} variant="outline" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            {i.exportData}
          </Button>

          {/* Import */}
          <Button onClick={openImportDialog} className="w-full gap-2">
            <Download className="w-4 h-4" />
            {i.importData}
          </Button>

          {/* Google Save */}
          <Button onClick={onGoogleBackup} variant="outline" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            {i.googleBackup}
          </Button>

          {/* Google Load */}
          <Button onClick={onGoogleImport} variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            {i.googleImport}
          </Button>

        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            {i.lastGoogleBackup}:{" "}
            {lastGoogleBackup
              ? new Date(lastGoogleBackup).toLocaleString()
              : i.none}
          </div>

          <div>
            {i.lastGoogleImport}:{" "}
            {lastGoogleImport
              ? new Date(lastGoogleImport).toLocaleString()
              : i.none}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFileChange}
          className="hidden"
        />
      </div>
      {/* 📘 사용설명서 */}
      <div className="bg-card rounded-xl p-6 border space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold">
            {getLang() === "en" ? "Help & Guide" : "사용설명서"}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {getLang() === "en"
            ? "Learn how to use the app and its main features."
            : "앱 사용 방법과 주요 기능을 확인할 수 있습니다."}
        </p>

        <Button onClick={() => navigate("/help")} className="w-full">
          {getLang() === "en" ? "View User Guide" : "사용설명서 보기"}
        </Button>
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
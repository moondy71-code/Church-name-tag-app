import { useState, useRef } from 'react';
import { Camera, Save, X } from 'lucide-react';
import { db, type Member, buildFullName } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { t, getLang } from '@/lib/i18n';
import BirthDateInput from '@/components/BirthDateInput';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateMemberId } from "@/lib/id";
import { positionOptions, normalizePosition } from "@/lib/positions";
import { capitalizeName } from "@/lib/utils";

interface Props {
  member?: Member;
  onSaved: () => void;
  onCancel: () => void;
}

export default function MemberForm({ member, onSaved, onCancel }: Props) {
  const i = t();
  const appSettings = useLiveQuery(() => db.settings.get(1), []);
  const groups = Array.isArray(appSettings?.groups)
  ? [...new Set(appSettings.groups.map((g) => String(g).trim()).filter(Boolean))]
  : [];
  const lang = getLang();
  const [form, setForm] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    phone: member?.phone || "",
    birthDate: member?.birthDate || "",
    gender: member?.gender || "male",
    grade: member?.grade || "",
    group: member?.group || "",
    photo: member?.photo || "",
    role: normalizePosition(member?.role),
    notes: member?.notes || "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
img.onload = () => {
  const canvas = document.createElement('canvas');
  const maxWidth = 400;
  const maxHeight = 600;

  let { width, height } = img;

  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  setForm((f) => ({ ...f, photo: canvas.toDataURL('image/jpeg', 0.9) }));
};
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() && !form.lastName.trim()) return;
    const name = buildFullName(form.lastName, form.firstName, lang);
    const now = new Date();
    if (member?.id) {
    await db.members.update(member.id, {
    ...form,
    role: normalizePosition(form.role),
    name,
    updatedAt: now
  });
} else {
  const prefix = (appSettings?.memberIdPrefix || "Moon").trim();
  const nextNumber = appSettings?.memberIdNextNumber || 1;
  const memberId = generateMemberId(prefix, nextNumber);

  await db.members.add({
    ...form,
    role: normalizePosition(form.role),
    name,
    memberId,
    createdAt: now,
    updatedAt: now,
  });

  await db.settings.put({
    ...appSettings,
    id: 1,
    churchName: appSettings?.churchName || "",
    language: appSettings?.language || "ko",
    groups: appSettings?.groups || [],
    memberIdPrefix: prefix,
    memberIdNextNumber: nextNumber + 1,
  });
}
    onSaved();
  };

  return (
    <div className="bg-card rounded-xl p-6 name-tag-shadow space-y-5 max-w-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{member ? i.editMember : i.addMember}</h2>
        <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
      </div>

      <div className="flex items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer border-2 border-border hover:border-accent transition-colors"
        >
          {form.photo ? (
            <img src={form.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <span className="text-sm text-muted-foreground">{i.photoUploadHint}</span>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{i.labelFirstName}</Label>
            <Input 
              value={form.firstName} 
              onChange={(e) => 
                setForm((f) => ({ 
                  ...f, 
                  firstName: capitalizeName(e.target.value) 
                }))
              } 
              placeholder={i.placeholderFirstName} 
            />
          </div>
          <div>
            <Label>{i.labelLastName}</Label>
            <Input 
              value={form.lastName} 
              onChange={(e) => 
                setForm((f) => ({ 
                  ...f, 
                  lastName: capitalizeName(e.target.value) 
                }))
              } 
              placeholder={i.placeholderLastName} 
            />
          </div>
        </div>
      <div>
        <Label>{i.labelGender}</Label>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "male" | "female" }))}
            />
            {i.optionMale}
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "male" | "female" }))}
            />
            {i.optionFemale}
          </label>
        </div>
      </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{i.labelBirthDate}</Label>
            <BirthDateInput value={form.birthDate} onChange={(v) => setForm((f) => ({ ...f, birthDate: v }))} />
          </div>
          <div>
            <Label>{i.labelPhone}</Label>
            <Input
  value={form.phone} 
  onChange={(e) => {
    const numbers = e.target.value.replace(/\D/g, '').slice(0, 11);

    let formatted = numbers;

    if (numbers.length > 7) {
      // 11자리일 때 (3-4-4)
      if (numbers.length === 11) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
      } 
      // 10자리일 때 (3-3-4)
      else {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
      }
    } else if (numbers.length > 3) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    setForm((f) => ({ ...f, phone: formatted }));
  }}
  placeholder="000-000-0000 / 000-0000-0000"
  maxLength={13}
/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{i.labelRole}</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    role: normalizePosition(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={i.selectPlaceholder} />
                </SelectTrigger>

                <SelectContent>
                  {positionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {lang === "ko" ? option.ko : option.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div>
            <Label>{i.labelGrade}</Label>
            <Input value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} placeholder={i.placeholderGrade} />
          </div>
        </div>
          <div>
            <Label>{i.labelGroup}</Label>
              {groups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {i.noGroupsMessage}
                </p>
              ) : (
                <Select
                  value={form.group || ""}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, group: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={i.selectGroup} />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
          </div>
      </div>
<div>
  <Label>{i.labelNotes}</Label>
  <textarea
    value={form.notes}
    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
    className="w-full border rounded-md p-2 text-sm"
    rows={3}
    placeholder={i.placeholderNotes}
  />
</div>
      <Button onClick={handleSave} className="w-full gap-2">
        <Save className="w-4 h-4" />
        {member ? i.btnSave : i.btnAdd}
      </Button>
    </div>
  );
}

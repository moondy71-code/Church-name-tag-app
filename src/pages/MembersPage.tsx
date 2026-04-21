import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Member } from '@/lib/db';
import { Plus, Search, Pencil, Trash2, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MemberForm from '@/components/MemberForm';
import { motion, AnimatePresence } from 'framer-motion';
import { t, getLang } from '@/lib/i18n';
import * as XLSX from 'xlsx';
import { getPositionLabel, normalizePosition } from "@/lib/positions";

export default function MembersPage() {
  const lang = getLang();
  const [search, setSearch] = useState('');
  const keyword = search.toLowerCase().trim();
  const [editing, setEditing] = useState<Member | null>(null);
  const [adding, setAdding] = useState(false);
  const i = t();

  const members = useLiveQuery(
  () => db.members.filter((m) => !m.deleted).sortBy('name'),
  []
);

  const filtered = members?.filter((m) => {
    const name = (m.name || "").toLowerCase().trim();
    const phone = (m.phone || "").toLowerCase().trim();
    const roleRaw = (m.role || "").toLowerCase().trim();
    const roleKo = getPositionLabel(
      normalizePosition(m.role || ""),
      "ko"
    ).toLowerCase().trim();
    const roleEn = getPositionLabel(
      normalizePosition(m.role || ""),
      "en"
    ).toLowerCase().trim();
    const group = (m.group || "").toLowerCase().trim();

    return (
      name.includes(keyword) ||
      phone.includes(keyword) ||
      roleRaw.includes(keyword) ||
      roleKo.includes(keyword) ||
      roleEn.includes(keyword) ||
      group.includes(keyword)
    );
  });

  const handleDelete = async (id: number) => {
    if (confirm(i.confirmDelete)) {
      await db.members.update(id, {
        deleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
  });
}
  };

  const exportToExcel = () => {
    if (!members?.length) return;
    const isKorean = getLang() === 'ko';

const data = members.map((m) => {
  const base = {
    [i.excelBirthDate]: m.birthDate,
    [i.excelPhone]: m.phone,
    [i.excelRole]: getPositionLabel(
      normalizePosition(m.role),
      getLang()
    ),
    [i.excelGrade]: m.grade || '',
    [i.excelGroup]: m.group || '',
    [i.excelMemberId]: m.memberId || '',  
  };

  if (isKorean) {
    return {
      [i.excelLastName]: m.lastName || '',
      [i.excelFirstName]: m.firstName || '',
      ...base,
    };
  } else {
    return {
      [i.excelFirstName]: m.firstName || '',
      [i.excelLastName]: m.lastName || '',
      ...base,
    };
  }
});
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, i.excelMemberSheet);
    XLSX.writeFile(wb, i.excelMemberFile);
  };

  if (adding || editing) {
    return (
      <MemberForm
        member={editing || undefined}
        onSaved={() => { setAdding(false); setEditing(null); }}
        onCancel={() => { setAdding(false); setEditing(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{i.navMembers}</h1>
          <span className="text-sm text-muted-foreground">{i.memberCount(members?.length || 0)}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel} disabled={!members?.length} className="gap-2">
            <Download className="w-4 h-4" />
            {i.exportMembers}
          </Button>
          <Button onClick={() => setAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> {i.newMember}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={i.searchPlaceholder} className="pl-10" />
      </div>

      {!filtered?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{i.noMembers}</p>
          <p className="text-sm">{i.noMembersHint}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card rounded-xl p-4 flex items-center gap-4 name-tag-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {m.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{m.name}</span>
                    {m.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-badge-tag text-badge-tag-foreground">
                        {getPositionLabel(normalizePosition(m.role), lang)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {[m.birthDate, m.group, m.grade].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(m)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(m.id!)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

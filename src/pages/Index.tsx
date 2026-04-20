import { useState, useEffect } from 'react';
import Layout, { type PageId } from '@/components/Layout';
import MembersPage from './MembersPage';
import NameTagsPage from './NameTagsPage';
import ScanHubPage from './ScanHubPage';
import AttendancePage from './AttendancePage';
import SettingsPage from './SettingsPage';

const pages: Record<PageId, React.ComponentType> = {
  members: MembersPage,
  nametags: NameTagsPage,
  scan: ScanHubPage,
  attendance: AttendancePage,
  settings: SettingsPage,
};

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageId>('members');
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // 1.7초 후 페이드아웃 시작

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2600); // 완전히 사라진 뒤 메인 화면

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

 
  const Page = pages[currentPage];

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Page />
    </Layout>
  );
}
import { useState } from 'react';
import Layout, { type PageId } from '@/components/Layout';
import MembersPage from './MembersPage';
import NameTagsPage from './NameTagsPage';
import ScannerInputPage from './ScannerInputPage';
import ScanHubPage from './ScanHubPage';
import ScanPage from './ScanPage';
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
  const Page = pages[currentPage];

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Page />
    </Layout>
  );
}
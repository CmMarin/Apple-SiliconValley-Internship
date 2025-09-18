import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar, { SidebarState } from '../components/Sidebar';
import TaskParser from '../components/TaskParser';
import ScheduleView from '../components/ScheduleView';
import FinanceAnalyze from '../components/FinanceAnalyze';
import DocumentScanner from '../components/DocumentScanner';
import EmailOrganizer from '../components/EmailOrganizer';

const Home: React.FC = () => {
  const [sidebar, setSidebar] = useState<SidebarState | undefined>(undefined);
  return (
    <div className="min-h-screen bg-[#1e1f22] text-gray-100">
      <Header />
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="space-y-4">
            <Sidebar value={sidebar} onChange={setSidebar} />
            <TaskParser />
          </div>
          <div className="flex-1 space-y-6">
            {sidebar?.active === 'schedule' && <ScheduleView />}
            {sidebar?.active === 'finance' && <FinanceAnalyze />}
            {sidebar?.active === 'documents' && <DocumentScanner />}
            {sidebar?.active === 'email' && <EmailOrganizer />}
            {!sidebar && <ScheduleView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
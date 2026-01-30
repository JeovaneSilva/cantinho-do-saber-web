import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}

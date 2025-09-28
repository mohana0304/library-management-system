import React from 'react';
import { LibraryProvider, useLibrary } from '@/contexts/LibraryContext';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import MemberDashboard from '@/components/MemberDashboard';

const AppContent = () => {
  const { currentUser } = useLibrary();

  if (!currentUser) {
    return <LoginForm />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  return <MemberDashboard />;
};

const Index = () => {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
};

export default Index;

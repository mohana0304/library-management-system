import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, TrendingUp, LogOut, Plus } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import BookManagement from './BookManagement';
import MemberManagement from './MemberManagement';
import BorrowingSystem from './BorrowingSystem';
import Reports from './Reports';

const AdminDashboard = () => {
  const { currentUser, logout, books, users, borrowRecords, getOverdueBooks } = useLibrary();
  const [activeTab, setActiveTab] = useState('overview');

  const overdueBooks = getOverdueBooks();
  const activeBorrows = borrowRecords.filter(r => r.status === 'active');

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      description: 'Books in catalog',
      icon: BookOpen,
      color: 'bg-library-primary',
    },
    {
      title: 'Total Members',
      value: users.filter(u => u.role === 'member').length,
      description: 'Registered members',
      icon: Users,
      color: 'bg-library-success',
    },
    {
      title: 'Active Borrows',
      value: activeBorrows.length,
      description: 'Currently borrowed',
      icon: FileText,
      color: 'bg-library-secondary',
    },
    {
      title: 'Overdue Items',
      value: overdueBooks.length,
      description: 'Require attention',
      icon: TrendingUp,
      color: 'bg-library-danger',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-library-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Library Admin</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {currentUser?.name}</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Activity
                    <Badge variant="secondary">{activeBorrows.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeBorrows.slice(0, 5).map((borrow) => {
                      const book = books.find(b => b.id === borrow.bookId);
                      const user = users.find(u => u.id === borrow.userId);
                      return (
                        <div key={borrow.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{book?.title}</p>
                            <p className="text-xs text-muted-foreground">{user?.name}</p>
                          </div>
                          <Badge variant={new Date(borrow.dueAt) < new Date() ? 'destructive' : 'default'}>
                            Due: {borrow.dueAt}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Popular Books
                    <Badge variant="secondary">Top 5</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {books.slice(0, 5).map((book) => (
                      <div key={book.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.authors[0]?.name}</p>
                        </div>
                        <Badge variant="outline">
                          {book.totalCopies - book.availableCopies}/{book.totalCopies}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books">
            <BookManagement />
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="borrowing">
            <BorrowingSystem />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Search, User, LogOut, Clock } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';

const MemberDashboard = () => {
  const { currentUser, logout, books, borrowRecords, searchBooks, getUserBorrowHistory } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  const userBorrowHistory = getUserBorrowHistory(currentUser?.id || '');
  const activeBorrows = userBorrowHistory.filter(r => r.status === 'active');
  const searchResults = searchQuery ? searchBooks(searchQuery) : books;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-library-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Library Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {currentUser?.name}</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Borrows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBorrows.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Books Borrowed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBorrowHistory.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.filter(b => b.availableCopies > 0).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Browse Books</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.slice(0, 10).map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.authors[0]?.name}</TableCell>
                    <TableCell><Badge variant="outline">{book.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={book.availableCopies > 0 ? "default" : "destructive"}>
                        {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberDashboard;
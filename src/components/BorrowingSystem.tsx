import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, UserCheck, RotateCcw, AlertTriangle, Calendar } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';

const BorrowingSystem = () => {
  const { 
    users, 
    books, 
    borrowRecords, 
    borrowBook, 
    returnBook, 
    getOverdueBooks 
  } = useLibrary();
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();

  const members = users.filter(u => u.role === 'member');
  const availableBooks = books.filter(b => b.availableCopies > 0);
  const activeBorrows = borrowRecords.filter(r => r.status === 'active');
  const overdueBooks = getOverdueBooks();

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (borrowBook(selectedBook, selectedMember, dueDate)) {
      toast({
        title: "Book issued successfully",
        description: "The book has been issued to the member.",
      });
      setIsIssueDialogOpen(false);
      setSelectedBook('');
      setSelectedMember('');
      setDueDate('');
    } else {
      toast({
        title: "Failed to issue book",
        description: "Book is not available or member not found.",
        variant: "destructive",
      });
    }
  };

  const handleReturnBook = (borrowId: string) => {
    returnBook(borrowId);
    toast({
      title: "Book returned",
      description: "The book has been returned successfully.",
    });
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
    return date.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (!dueDate) {
      setDueDate(getDefaultDueDate());
    }
  }, [dueDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Borrowing System</h2>
          <p className="text-muted-foreground">Manage book borrowing and returns</p>
        </div>
        <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-library-primary hover:bg-library-primary/90">
              <BookOpen className="w-4 h-4 mr-2" />
              Issue Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Book</DialogTitle>
              <DialogDescription>
                Select a book and member to issue a new book
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book-select">Select Book *</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - Available: {book.availableCopies}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-select">Select Member *</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.membershipId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date *</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsIssueDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-library-primary hover:bg-library-primary/90">
                  Issue Book
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBorrows.length}</div>
            <p className="text-xs text-muted-foreground">Currently borrowed books</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-library-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-library-danger">{overdueBooks.length}</div>
            <p className="text-xs text-muted-foreground">Books past due date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <UserCheck className="h-4 w-4 text-library-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-library-success">{availableBooks.length}</div>
            <p className="text-xs text-muted-foreground">Ready to be borrowed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Borrows</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Items</TabsTrigger>
          <TabsTrigger value="history">Return History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Borrows</CardTitle>
              <CardDescription>Books currently borrowed by members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Borrowed Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBorrows.map((borrow) => {
                    const book = books.find(b => b.id === borrow.bookId);
                    const member = users.find(u => u.id === borrow.userId);
                    const isOverdue = new Date(borrow.dueAt) < new Date();
                    
                    return (
                      <TableRow key={borrow.id}>
                        <TableCell className="font-medium">{book?.title}</TableCell>
                        <TableCell>{member?.name}</TableCell>
                        <TableCell>{new Date(borrow.borrowedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(borrow.dueAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={isOverdue ? 'destructive' : 'default'}>
                            {isOverdue ? 'Overdue' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(borrow.id)}
                            className="bg-library-success hover:bg-library-success/90 text-white"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-library-danger mr-2" />
                Overdue Items
              </CardTitle>
              <CardDescription>Books that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueBooks.map((borrow) => {
                    const book = books.find(b => b.id === borrow.bookId);
                    const member = users.find(u => u.id === borrow.userId);
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(borrow.dueAt).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const fine = daysOverdue * 0.5;
                    
                    return (
                      <TableRow key={borrow.id}>
                        <TableCell className="font-medium">{book?.title}</TableCell>
                        <TableCell>{member?.name}</TableCell>
                        <TableCell>{new Date(borrow.dueAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{daysOverdue} days</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-library-danger">
                          ${fine.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(borrow.id)}
                            className="bg-library-success hover:bg-library-success/90 text-white"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Return History</CardTitle>
              <CardDescription>Previously returned books</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Borrowed Date</TableHead>
                    <TableHead>Returned Date</TableHead>
                    <TableHead>Fine Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowRecords
                    .filter(r => r.status === 'returned')
                    .map((borrow) => {
                      const book = books.find(b => b.id === borrow.bookId);
                      const member = users.find(u => u.id === borrow.userId);
                      
                      return (
                        <TableRow key={borrow.id}>
                          <TableCell className="font-medium">{book?.title}</TableCell>
                          <TableCell>{member?.name}</TableCell>
                          <TableCell>{new Date(borrow.borrowedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{borrow.returnedAt ? new Date(borrow.returnedAt).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>
                            {borrow.fineAmount > 0 ? (
                              <span className="font-semibold text-library-danger">
                                ${borrow.fineAmount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">$0.00</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BorrowingSystem;
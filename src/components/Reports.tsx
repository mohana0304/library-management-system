import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Users, TrendingUp, DollarSign, Calendar, Award } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';

const Reports = () => {
  const { books, users, borrowRecords, getOverdueBooks } = useLibrary();

  const members = users.filter(u => u.role === 'member');
  const activeBorrows = borrowRecords.filter(r => r.status === 'active');
  const returnedBooks = borrowRecords.filter(r => r.status === 'returned');
  const overdueBooks = getOverdueBooks();
  const totalFines = borrowRecords.reduce((sum, record) => sum + record.fineAmount, 0);

  // Category distribution for pie chart
  const categoryData = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Monthly borrowing trends (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', borrows: 45, returns: 42 },
    { month: 'Feb', borrows: 52, returns: 48 },
    { month: 'Mar', borrows: 61, returns: 58 },
    { month: 'Apr', borrows: 58, returns: 55 },
    { month: 'May', borrows: 67, returns: 63 },
    { month: 'Jun', borrows: 72, returns: 69 },
  ];

  // Popular books based on borrow frequency
  const bookBorrowCount = borrowRecords.reduce((acc, record) => {
    acc[record.bookId] = (acc[record.bookId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularBooks = books
    .map(book => ({
      ...book,
      borrowCount: bookBorrowCount[book.id] || 0,
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  // Active members based on borrowing activity
  const memberBorrowCount = borrowRecords.reduce((acc, record) => {
    acc[record.userId] = (acc[record.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeMembers = members
    .map(member => ({
      ...member,
      borrowCount: memberBorrowCount[member.id] || 0,
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      description: 'In catalog',
      icon: BookOpen,
      color: 'bg-library-primary',
    },
    {
      title: 'Active Members',
      value: members.length,
      description: 'Registered users',
      icon: Users,
      color: 'bg-library-success',
    },
    {
      title: 'Books Borrowed',
      value: borrowRecords.length,
      description: 'Total transactions',
      icon: TrendingUp,
      color: 'bg-library-secondary',
    },
    {
      title: 'Total Fines',
      value: `$${totalFines.toFixed(2)}`,
      description: 'Collected fines',
      icon: DollarSign,
      color: 'bg-library-warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <p className="text-muted-foreground">Library performance and usage statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="books">Book Analytics</TabsTrigger>
          <TabsTrigger value="members">Member Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Borrowing Trends</CardTitle>
                <CardDescription>Book borrows and returns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="borrows" fill="#3b82f6" name="Borrows" />
                    <Bar dataKey="returns" fill="#10b981" name="Returns" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Categories</CardTitle>
                <CardDescription>Distribution of books by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Most Popular Books
                </CardTitle>
                <CardDescription>Books with highest borrow frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Times Borrowed</TableHead>
                      <TableHead>Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularBooks.map((book, index) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.authors[0]?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.borrowCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={book.availableCopies > 0 ? 'default' : 'destructive'}>
                            {book.availableCopies}/{book.totalCopies}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Status Summary</CardTitle>
                <CardDescription>Current status of all books</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Books</span>
                    <Badge variant="outline">{books.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Available Books</span>
                    <Badge variant="default">
                      {books.filter(b => b.availableCopies > 0).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Out of Stock</span>
                    <Badge variant="destructive">
                      {books.filter(b => b.availableCopies === 0).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Currently Borrowed</span>
                    <Badge variant="secondary">{activeBorrows.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Overdue Items</span>
                    <Badge variant="destructive">{overdueBooks.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Most Active Members
              </CardTitle>
              <CardDescription>Members with highest borrowing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Membership ID</TableHead>
                    <TableHead>Books Borrowed</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.membershipId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{member.borrowCount}</Badge>
                      </TableCell>
                      <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fine Collection Summary
                </CardTitle>
                <CardDescription>Overdue fines and collection status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Fines Collected</span>
                    <span className="font-semibold text-library-success">
                      ${totalFines.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outstanding Fines</span>
                    <span className="font-semibold text-library-danger">
                      ${overdueBooks.reduce((sum, record) => {
                        const daysOverdue = Math.floor(
                          (new Date().getTime() - new Date(record.dueAt).getTime()) / (1000 * 60 * 60 * 24)
                        );
                        return sum + (daysOverdue * 0.5);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Fine per Item</span>
                    <span className="font-medium">
                      ${borrowRecords.length > 0 ? (totalFines / borrowRecords.length).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent borrowing activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Transactions</span>
                    <Badge variant="outline">{borrowRecords.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Returns</span>
                    <Badge variant="default">{returnedBooks.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Borrows</span>
                    <Badge variant="secondary">{activeBorrows.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Return Rate</span>
                    <span className="font-medium">
                      {borrowRecords.length > 0 
                        ? `${((returnedBooks.length / borrowRecords.length) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useLibrary, Book, Author } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';

const BookManagement = () => {
  const { books, addBook, updateBook, deleteBook, searchBooks } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const [bookForm, setBookForm] = useState({
    title: '',
    isbn: '',
    category: '',
    publishedDate: '',
    summary: '',
    totalCopies: 0,
    availableCopies: 0,
    authors: [{ id: '', name: '' }],
  });

  const resetForm = () => {
    setBookForm({
      title: '',
      isbn: '',
      category: '',
      publishedDate: '',
      summary: '',
      totalCopies: 0,
      availableCopies: 0,
      authors: [{ id: '', name: '' }],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBook) {
      updateBook(editingBook.id, {
        ...bookForm,
        authors: bookForm.authors.filter(a => a.name.trim() !== ''),
      });
      toast({
        title: "Book updated",
        description: "Book information has been updated successfully.",
      });
      setEditingBook(null);
    } else {
      addBook({
        ...bookForm,
        authors: bookForm.authors.filter(a => a.name.trim() !== ''),
      });
      toast({
        title: "Book added",
        description: "New book has been added to the catalog.",
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      isbn: book.isbn,
      category: book.category,
      publishedDate: book.publishedDate,
      summary: book.summary,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      authors: book.authors,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteBook(id);
    toast({
      title: "Book deleted",
      description: "Book has been removed from the catalog.",
    });
  };

  const filteredBooks = searchQuery ? searchBooks(searchQuery) : books;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Book Management</h2>
          <p className="text-muted-foreground">Manage your library's book catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-library-primary hover:bg-library-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
              <DialogDescription>
                {editingBook ? 'Update book information' : 'Add a new book to the library catalog'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={bookForm.title}
                    onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={bookForm.category}
                    onChange={(e) => setBookForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedDate">Published Date</Label>
                  <Input
                    id="publishedDate"
                    type="date"
                    value={bookForm.publishedDate}
                    onChange={(e) => setBookForm(prev => ({ ...prev, publishedDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={bookForm.authors[0]?.name || ''}
                  onChange={(e) => setBookForm(prev => ({
                    ...prev,
                    authors: [{ ...prev.authors[0], name: e.target.value }]
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={bookForm.summary}
                  onChange={(e) => setBookForm(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCopies">Total Copies *</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm(prev => ({ 
                      ...prev, 
                      totalCopies: parseInt(e.target.value) || 0,
                      availableCopies: editingBook ? prev.availableCopies : parseInt(e.target.value) || 0
                    }))}
                    required
                  />
                </div>
                {editingBook && (
                  <div className="space-y-2">
                    <Label htmlFor="availableCopies">Available Copies</Label>
                    <Input
                      id="availableCopies"
                      type="number"
                      min="0"
                      max={bookForm.totalCopies}
                      value={bookForm.availableCopies}
                      onChange={(e) => setBookForm(prev => ({ 
                        ...prev, 
                        availableCopies: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingBook(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-library-primary hover:bg-library-primary/90">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Book Catalog</CardTitle>
              <CardDescription>Total: {books.length} books</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.authors[0]?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                  <TableCell>{book.availableCopies}/{book.totalCopies}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={book.availableCopies > 0 ? "default" : "destructive"}
                    >
                      {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(book)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(book.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookManagement;
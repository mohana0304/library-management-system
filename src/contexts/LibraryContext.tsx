import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  membershipId?: string;
  phone?: string;
  address?: string;
  joinDate: string;
  password?: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  category: string;
  publishedDate: string;
  summary: string;
  totalCopies: number;
  availableCopies: number;
  authors: Author[];
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  fineAmount: number;
  status: 'active' | 'returned' | 'overdue';
}

interface LibraryContextType {
  currentUser: User | null;
  users: User[];
  books: Book[];
  borrowRecords: BorrowRecord[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  borrowBook: (bookId: string, userId: string, dueDate: string) => boolean;
  returnBook: (borrowId: string) => void;
  searchBooks: (query: string) => Book[];
  getOverdueBooks: () => BorrowRecord[];
  getUserBorrowHistory: (userId: string) => BorrowRecord[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

// Initial admin user
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin123@gmail.com',
    role: 'admin',
    joinDate: '2024-01-01',
  },
];

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    isbn: '978-0-7432-7356-5',
    category: 'Fiction',
    publishedDate: '1925-04-10',
    summary: 'A classic American novel set in the Jazz Age.',
    totalCopies: 5,
    availableCopies: 3,
    authors: [{ id: '1', name: 'F. Scott Fitzgerald' }],
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    isbn: '978-0-06-112008-4',
    category: 'Fiction',
    publishedDate: '1960-07-11',
    summary: 'A gripping tale of racial injustice and childhood in the American South.',
    totalCopies: 4,
    availableCopies: 2,
    authors: [{ id: '2', name: 'Harper Lee' }],
  },
  {
    id: '3',
    title: 'Clean Code',
    isbn: '978-0-13-235088-4',
    category: 'Technology',
    publishedDate: '2008-08-01',
    summary: 'A handbook of agile software craftsmanship.',
    totalCopies: 3,
    availableCopies: 1,
    authors: [{ id: '3', name: 'Robert C. Martin' }],
  },
];

const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    bookId: '1',
    userId: '2',
    borrowedAt: '2024-01-20',
    dueAt: '2024-02-03',
    fineAmount: 0,
    status: 'active',
  },
  {
    id: '2',
    bookId: '3',
    userId: '3',
    borrowedAt: '2024-01-10',
    dueAt: '2024-01-24',
    returnedAt: '2024-01-22',
    fineAmount: 0,
    status: 'returned',
  },
];

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('libraryUsers');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('libraryUsers', JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      // Admin login with specific password
      if (user.role === 'admin' && email === 'admin123@gmail.com' && password === 'admin') {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      // Member login - check stored password (in real app, this would be hashed)
      if (user.role === 'member' && user.password === password) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'member',
      membershipId: `LIB${String(users.filter(u => u.role === 'member').length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      password // In real app, this would be hashed
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: Date.now().toString() };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updatedBook: Partial<Book>) => {
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updatedBook } : book));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updatedUser } : user));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const borrowBook = (bookId: string, userId: string, dueDate: string): boolean => {
    const book = books.find(b => b.id === bookId);
    if (book && book.availableCopies > 0) {
      const newBorrow: BorrowRecord = {
        id: Date.now().toString(),
        bookId,
        userId,
        borrowedAt: new Date().toISOString().split('T')[0],
        dueAt: dueDate,
        fineAmount: 0,
        status: 'active',
      };
      setBorrowRecords(prev => [...prev, newBorrow]);
      updateBook(bookId, { availableCopies: book.availableCopies - 1 });
      return true;
    }
    return false;
  };

  const returnBook = (borrowId: string) => {
    const borrow = borrowRecords.find(b => b.id === borrowId);
    if (borrow) {
      const returnDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(borrow.dueAt);
      const currentDate = new Date(returnDate);
      const fine = currentDate > dueDate ? Math.max(0, Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) * 0.5) : 0;
      
      setBorrowRecords(prev => prev.map(b => 
        b.id === borrowId 
          ? { ...b, returnedAt: returnDate, fineAmount: fine, status: 'returned' as const }
          : b
      ));
      
      const book = books.find(b => b.id === borrow.bookId);
      if (book) {
        updateBook(borrow.bookId, { availableCopies: book.availableCopies + 1 });
      }
    }
  };

  const searchBooks = (query: string): Book[] => {
    if (!query) return books;
    return books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.authors.some(author => author.name.toLowerCase().includes(query.toLowerCase())) ||
      book.isbn.includes(query) ||
      book.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getOverdueBooks = (): BorrowRecord[] => {
    const today = new Date().toISOString().split('T')[0];
    return borrowRecords.filter(record => 
      record.status === 'active' && record.dueAt < today
    );
  };

  const getUserBorrowHistory = (userId: string): BorrowRecord[] => {
    return borrowRecords.filter(record => record.userId === userId);
  };

  return (
    <LibraryContext.Provider value={{
      currentUser,
      users,
      books,
      borrowRecords,
      login,
      logout,
      signup,
      addBook,
      updateBook,
      deleteBook,
      addUser,
      updateUser,
      deleteUser,
      borrowBook,
      returnBook,
      searchBooks,
      getOverdueBooks,
      getUserBorrowHistory,
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
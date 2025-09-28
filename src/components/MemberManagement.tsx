import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { useLibrary, User } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';

const MemberManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipId: '',
  });

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      membershipId: '',
    });
  };

  const generateMembershipId = () => {
    const existingIds = users
      .filter(u => u.role === 'member')
      .map(u => u.membershipId)
      .filter(Boolean);
    
    let newId;
    let counter = existingIds.length + 1;
    do {
      newId = `LIB${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    
    return newId;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        address: userForm.address,
        membershipId: userForm.membershipId,
      });
      toast({
        title: "Member updated",
        description: "Member information has been updated successfully.",
      });
      setEditingUser(null);
    } else {
      addUser({
        name: userForm.name,
        email: userForm.email,
        role: 'member',
        phone: userForm.phone,
        address: userForm.address,
        membershipId: userForm.membershipId || generateMembershipId(),
        joinDate: new Date().toISOString().split('T')[0],
      });
      toast({
        title: "Member added",
        description: "New member has been registered successfully.",
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      membershipId: user.membershipId || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast({
      title: "Member deleted",
      description: "Member has been removed from the system.",
    });
  };

  const members = users.filter(u => u.role === 'member');
  const filteredMembers = searchQuery 
    ? members.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.membershipId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">Manage library members and their information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-library-primary hover:bg-library-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit Member' : 'Add New Member'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update member information' : 'Register a new library member'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={userForm.address}
                  onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipId">Membership ID</Label>
                <Input
                  id="membershipId"
                  value={userForm.membershipId}
                  onChange={(e) => setUserForm(prev => ({ ...prev, membershipId: e.target.value }))}
                  placeholder={editingUser ? '' : generateMembershipId()}
                />
                {!editingUser && (
                  <p className="text-xs text-muted-foreground">
                    Leave blank to auto-generate: {generateMembershipId()}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-library-primary hover:bg-library-primary/90">
                  {editingUser ? 'Update Member' : 'Add Member'}
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
              <CardTitle>Member Directory</CardTitle>
              <CardDescription>Total: {members.length} members</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members..."
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
                <TableHead>Name</TableHead>
                <TableHead>Membership ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.membershipId}</Badge>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone || 'N/A'}</TableCell>
                  <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(member.id)}
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

export default MemberManagement;
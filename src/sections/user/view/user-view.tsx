import { useState, useEffect, useCallback } from 'react';

// src/sections/user/view/user-view.tsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableRow, type UserProps } from '../user-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProps | null>(null);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    sex: 'male',
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get<{ data: UserProps[] }>('/superadmins');
      const response = res.data?.data ?? []; 
      setUsers(response);
    } catch (err) {
      console.error('Fetch failed', err);
      setUsers([]); 
    }
    
    
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', password: '', password_confirmation: '', sex: 'male' });
    setOpenModal(true);
  };

  const openEditModal = (user: UserProps) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      password_confirmation: '',
      sex: (user as any).sex || 'male',
    });
    setOpenModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async () => {
    try {
      if (editingUser) {
        await axios.put(`/superadmins/${editingUser.id}`, formData);
      } else {
        await axios.post('/register/superadmin', formData);
      }
      fetchUsers();
      setOpenModal(false);
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/superadmins/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4"  sx={{ flexGrow: 1 }}>Super Admins</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={openAddModal}>
          New Super Admin
        </Button>
      </Box>

      <Card>
        <UserTableToolbar numSelected={table.selected.length} filterName={filterName} onFilterName={(e) => { setFilterName(e.target.value); table.onResetPage(); }} />
        <Scrollbar>
          <TableContainer>
            <Table>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => table.onSelectAllRows(checked, users.map(u => u.id))}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'sex', label: 'Sex' },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map(row => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEdit={() => openEditModal(row)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}
                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)} />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? 'Edit Super Admin' : 'Add Super Admin'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
            <TextField label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>{editingUser ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// Table hook...
function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  return { page, orderBy, order, rowsPerPage, selected, onSort, onSelectAllRows, onSelectRow, onResetPage, onChangePage, onChangeRowsPerPage };
}

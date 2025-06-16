import { useState, useCallback } from 'react';

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

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { RequestTableRow } from '../request-table-row';
import { RequestTableHead } from '../request-table-head';
import { RequestToolbar } from '../request-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { RequestProps } from '../request-table-row';

// Sample data
const requests: RequestProps[] = [
  {
    id: '1',
    name: 'NiaCraft Solutions',
    email: 'info@niacraft.com',
    phone: '+255712345678',
    Requestname: 'niacraft',
    role: 'Company',
    status: 'Active',
    logo: '/assets/logos/niacraft.png',
    color: '#0055FF',
  },
  {
    id: '2',
    name: 'TanzaniaTech Ltd',
    email: 'contact@tztech.co.tz',
    phone: '+255713333333',
    Requestname: 'tanzaniatech',
    role: 'Company',
    status: 'Inactive',
    logo: '/assets/logos/tztech.png',
    color: '#FF9900',
  },
];

export function RequestView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestProps | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    logo: '',
    colorCode: '',
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleOpenViewModal = (request: RequestProps) => {
    setSelectedRequest(request);
    setOpenViewModal(true);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedRequest(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  

  const handleGenerateReport = () => console.log('Generating report...');

  const dataFiltered = applyFilter({
    inputData: requests,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Requests
        </Typography>
      </Box>

      <Card>
        <RequestToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RequestTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={requests.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, requests.map((c) => c.id))
                }
                headLabel={[
                  { id: 'logo', label: 'Logo' },
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'Requestname', label: 'Request Name' },
                  { id: 'color', label: 'Color Code' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <RequestTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onShowDetails={handleOpenViewModal}
                      onEdit={handleOpenEditModal}
                      //onDelete={}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, requests.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={requests.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

     
      
       {/* Edit Company Modal */}
       <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Request</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth />
            <TextField label="Owner Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
            <TextField label="Logo URL" name="logo" value={formData.logo} onChange={handleChange} fullWidth />
            <TextField label="Color Code" name="colorCode" value={formData.colorCode} onChange={handleChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Company Details Modal */}
      <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="sm">
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box component="img" src={selectedRequest.logo} alt="Logo" sx={{ width: 100, height: 100, objectFit: 'contain' }} />
              <Typography><strong>Name:</strong> {selectedRequest.name}</Typography>
              <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedRequest.phone}</Typography>
              <Typography><strong>Request Name:</strong> {selectedRequest.Requestname}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 24, height: 24, bgcolor: selectedRequest.color, border: '1px solid #ccc', borderRadius: 0.5 }} />
                <Typography><strong>Color Code:</strong> {selectedRequest.color}</Typography>
              </Box>
              <Typography><strong>Role:</strong> {selectedRequest.role}</Typography>
              <Typography><strong>Status:</strong> {selectedRequest.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// Pagination and table state hook (unchanged)
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

  const onSelectRow = useCallback((inputValue: string) => {
    setSelected(prev => (prev.includes(inputValue) ? prev.filter(id => id !== inputValue) : [...prev, inputValue]));
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: any, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  return { page, order, onSort, orderBy, selected, rowsPerPage, onSelectRow, onResetPage, onChangePage, onSelectAllRows, onChangeRowsPerPage };
}

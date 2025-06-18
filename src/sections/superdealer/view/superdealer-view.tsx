import type { SelectChangeEvent } from '@mui/material/Select';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Button,
  Dialog,
  Select,
  MenuItem,
  TableBody,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  TableContainer,
  TablePagination,
} from '@mui/material';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { SuperdealerTableRow } from '../superdealer-table-row';
import { SuperdealerTableHead } from '../superdealer-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { SuperdealerTableToolbar } from '../superdealer-table-toolbar';

import type { SuperdealerProps } from '../superdealer-table-row';

export function SuperdealerView() {
  const { companyId } = useParams<{ companyId: string }>();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [selectedBikers, setSelectedBikers] = useState<any[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<any[]>([]);
  const [companySuperdealers, setCompanySuperdealers] = useState<SuperdealerProps[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    business_name: '',
    password: '',
    password_confirmation: '',
    sex: '',
  });

  useEffect(() => {
    if (!companyId) return;

    axios
      .get(`/companies/${companyId}/superdealers`)
      .then((res) => {
        const superdealers = res.data.data?.super_dealers || [];
        setCompanySuperdealers(superdealers);
      })
      .catch((err) =>
        console.error('Failed to fetch superdealers:', err.response?.data || err.message)
      );
  }, [companyId]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenViewModal = async (superdealerId: string) => {
    try {
      const response = await axios.get(`/superdealers/${superdealerId}/bikers`);
      setSelectedBikers(response.data.data.bikers || []);
      setOpenViewModal(true);
    } catch (error) {
      console.error('Failed to fetch bikers:', error);
    }
  };

  const handleOpenRequestModal = async (companyId: number) => {
    try {
      const response = await axios.get(`/orders/request/${companyId}`);
      setSelectedBikers(response.data.data || []);
      setOpenViewModal(true);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };


  const handleCloseViewModal = () => setOpenViewModal(false);
  const handleCloseRequestModal = () => setOpenViewModal(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/register/superdealer', {
        ...formData,
        company_id: parseInt(companyId ?? '0'),
      });

      setCompanySuperdealers((prev) => [...prev, response.data.data]);

      handleCloseModal();
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        business_name: '',
        password: '',
        password_confirmation: '',
        sex: '',
      });
    } catch (error) {
      console.error('Failed to create superdealer:', error);
    }
  };

  const dataFiltered = applyFilter({
    inputData: companySuperdealers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Super Dealers (Company ID: {companyId})
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenModal}
        >
          New Super Dealer
        </Button>
      </Box>

      <Card>
        <SuperdealerTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SuperdealerTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={companySuperdealers.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    companySuperdealers.map((s) => s.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: 'location', label: 'Location' },
                  { id: 'sex', label: 'Sex' },
                  { id: 'company_id', label: 'Company ID' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <SuperdealerTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onShowDetails={(superdealer) => handleOpenViewModal(superdealer.id)}
                      onShowrequest={(superdealer) =>handleOpenRequestModal(superdealer.company_id)}

                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    dataFiltered.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Super Dealer</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth />
            <TextField label="Business Name" name="business_name" value={formData.business_name} onChange={handleInputChange} fullWidth />
            <TextField label="Location" name="location" value={formData.location} onChange={handleInputChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} fullWidth />
            <TextField label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleInputChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select name="sex" value={formData.sex} label="Sex" onChange={handleInputChange}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="md">
        <DialogTitle>Bikers List</DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableBody>
              {selectedBikers.map((biker, index) => (
                <tr key={index}>
                  <td>{biker.name}</td>
                  <td>{biker.phone}</td>
                  <td>{biker.email}</td>
                </tr>
              ))}
              {!selectedBikers.length && (
                <tr>
                  <td colSpan={3}>No bikers found for this superdealer.</td>
                </tr>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRequestModal} onClose={handleCloseRequestModal} fullWidth maxWidth="md">
        <DialogTitle>Superdealer Request List</DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableBody>
              {selectedRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.name}</td>
                  <td>{request.brand}</td>
                  <td>{request.total_amount}</td>
                  <td>{request.company_price}</td>
                  <td>{request.date_to_pay}</td>

                </tr>
              ))}
              {!selectedRequests.length && (
                <tr>
                  <td colSpan={3}>No requests found for this superdealer.</td>
                </tr>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

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
    setSelected((prev) =>
      prev.includes(inputValue) ? prev.filter((val) => val !== inputValue) : [...prev, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

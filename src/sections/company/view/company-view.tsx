import { useState, useEffect, useCallback } from 'react';

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
import { TableEmptyRows } from '../table-empty-rows';
import { CompanyTableRow } from '../company-table-row';
import { CompanyTableHead } from '../company-table-head';
import { CompanyToolbar } from '../company-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { CompanyProps } from '../company-table-row';


export function CompanyView() {
  const table = useTable();
  const [companies, setCompanies] = useState<CompanyProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProps | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<CompanyProps>>({
    name: '',
    abbr: '',
    logo: null,
    description: '',
    primary_color: '',
    secondary_color: '',
    background_color: '',
    text_color: '',
    created_at: '',
    updated_at: '',
  });

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/companies', {
        withCredentials: true,
      });
      setCompanies(response.data.data.map((company: any) => ({
        id: company.id,
        name: company.name,
        abbr: company.abbr,
        logo: company.logo,
        description: company.description,
        primary_color: company.primary_color,
        secondary_color: company.secondary_color,
        background_color: company.background_color,
        text_color: company.text_color,
        created_at: company.created_at,
        updated_at: company.updated_at,
      })));

      console.log(response.data.data);

    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenEditModal = (company: CompanyProps) => {
    setEditingCompanyId(company.id);
    setFormData({
      name: company.name,
      abbr: company.abbr,
      logo: company.logo,
      description: company.description,
      primary_color: company.primary_color,
      secondary_color: company.secondary_color,
      background_color: company.background_color,
      text_color: company.text_color,
      created_at: company.created_at,
      updated_at: company.updated_at,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleOpenViewModal = (company: CompanyProps) => {
    setSelectedCompany(company);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedCompany(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({ ...prev, logo: file }));
    }
  };

  const handleDeletecompany = async (id: string) => {
    try {
      await axios.delete(`/companies/${id}`, { withCredentials: true });
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as any);
      });

      if (openModal) {
        await axios.post('/companies', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      } else if (openEditModal && editingCompanyId) {
        await axios.post(`/companies/${editingCompanyId}?_method=PUT`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }

      await fetchCompanies();
    } catch (error) {
      console.error('Error submitting company data:', error);
    }

    setFormData({
      name: '',
      abbr: '',
      logo: null,
      description: '',
      primary_color: '',
      secondary_color: '',
      background_color: '',
      text_color: '',
      created_at: '',
      updated_at: '',
    });
    setEditingCompanyId(null);
    handleCloseModal();
    handleCloseEditModal();
  };

  const dataFiltered = applyFilter({
    inputData: companies,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Companies
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenModal}
        >
          New Company
        </Button>
      </Box>

      <Card>
        <CompanyToolbar
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
              <CompanyTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={companies.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, companies.map((c) => c.id))
                }
                headLabel={[
                  { id: 'logo', label: 'Logo' },
                  { id: 'name', label: 'Name' },
                  { id: 'abbr', label: 'Abbreviation' },
                  { id: 'description', label: 'Description' },
                  { id: 'primary_color', label: 'Primary Color' },
                  { id: 'secondary_color', label: 'Secondary Color' },
                  { id: 'background_color', label: 'Background Color' },
                  { id: 'text_color', label: 'Text Color' },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <CompanyTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onShowDetails={handleOpenViewModal}
                      onEdit={() => handleOpenEditModal(row)}
                      onDelete={() => handleDeletecompany(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, companies.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={companies.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openModal || openEditModal} onClose={openModal ? handleCloseModal : handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>{openModal ? 'Add New Company' : 'Edit Company'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <TextField label="Abbreviation" name="abbr" value={formData.abbr} onChange={handleChange} fullWidth />
            <Button variant="outlined" component="label">
              Upload Logo
              <input type="file" name="logo" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.logo && typeof formData.logo !== 'string' && (
              <Typography variant="body2">{(formData.logo as File).name}</Typography>
            )}
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
            <TextField label="Primary Color" name="primary_color" value={formData.primary_color} onChange={handleChange} fullWidth />
            <TextField label="Secondary Color" name="secondary_color" value={formData.secondary_color} onChange={handleChange} fullWidth />
            <TextField label="Background Color" name="background_color" value={formData.background_color} onChange={handleChange} fullWidth />
            <TextField label="Text Color" name="text_color" value={formData.text_color} onChange={handleChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={openModal ? handleCloseModal : handleCloseEditModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
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

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onChangePage: (_: unknown, newPage: number) => setPage(newPage),
    onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    onSelectRow: (id: string) => {
      const selectedIndex = selected.indexOf(id);
      const newSelected = selectedIndex === -1
        ? [...selected, id]
        : selected.filter((s) => s !== id);
      setSelected(newSelected);
    },
    onSelectAllRows: (checked: boolean, newSelected: string[]) => {
      setSelected(checked ? newSelected : []);
    },
    onResetPage: () => setPage(0),
  };
}

import { useParams } from 'react-router-dom';
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
import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { ProductTableToolbar } from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { ProductProps } from '../product-table-row';

export function ProductsView() {
  const { companyId } = useParams<{ companyId: string }>();

  const table = useTable();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ProductProps>>({
    name: '',
    brand: '',
    image: null,
    company_id: companyId || '',
    company_price: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/products`, {
        withCredentials: true,
      });
      setProducts(response.data.data?.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    if (companyId) {
      setFormData((prev) => ({ ...prev, company_id: companyId }));
      fetchProducts();
    }
  }, [companyId]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`/products/${id}`, { withCredentials: true });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleOpenEditModal = (product: ProductProps) => {
    setEditingProductId(product.id);
    setFormData(product);
    setOpenEditModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as any);
      });

      if (openModal) {
        await axios.post('/products', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      } else if (openEditModal && editingProductId) {
        await axios.post(`/products/${editingProductId}?_method=PUT`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
    }

    setFormData({ name: '', brand: '', image: null, company_id: companyId || '', company_price: '' });
    setEditingProductId(null);
    handleCloseModal();
    handleCloseEditModal();
  };

  const dataFiltered = applyFilter({
    inputData: Array.isArray(products) ? products : [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Products</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenModal}>
          New Product
        </Button>
      </Box>

      <Card>
        <ProductTableToolbar
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
              <ProductTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={products.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, products.map((p) => p.id))
                }
                headLabel={[
                  { id: 'image', label: 'Image' },
                  { id: 'name', label: 'Name' },
                  { id: 'brand', label: 'Brand' },
                  { id: 'company_id', label: 'Company' },
                  { id: 'company_price', label: 'Price' },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <ProductTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEdit={() => handleOpenEditModal(row)}
                      onDelete={() => handleDeleteProduct(row.id)}
                    />
                  ))}
                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, products.length)} />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          page={table.page}
          count={products.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openModal || openEditModal} onClose={openModal ? handleCloseModal : handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>{openModal ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <TextField label="Brand" name="brand" value={formData.brand} onChange={handleChange} fullWidth />
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" name="image" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.image && typeof formData.image !== 'string' && (
              <Typography variant="body2">{(formData.image as File).name}</Typography>
            )}
            <TextField
              label="Company Price"
              name="company_price"
              value={formData.company_price}
              onChange={handleChange}
              fullWidth
            />
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

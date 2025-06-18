import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Button,
  Dialog,
  TableBody,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { RequestTableHead } from '../request-table-head';
import { RequestToolbar } from '../request-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { RequestProps , RequestTableRow } from '../request-table-row';

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
      prev.includes(inputValue) ? prev.filter((id) => id !== inputValue) : [...prev, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: any, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
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

export function RequestView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [requests, setRequests] = useState<RequestProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestProps | null>(null);

  useEffect(() => {
    axios
      .get('/orders/requests') // replace with your actual API
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          console.error('API returned non-array data:', res.data);
          setRequests([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch requests:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenViewModal = (request: RequestProps) => {
    setSelectedRequest(request);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedRequest(null);
    setOpenViewModal(false);
  };

  const dataFiltered = applyFilter({
    inputData: Array.isArray(requests) ? requests : [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

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
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <RequestTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={requests.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    requests.map((r) => r.id.toString())
                  );
                }}
                headLabel={[
                  { id: 'name', label: 'Request Name' },
                  { id: 'brand', label: 'Brand' },
                  { id: 'total_amount', label: 'Total Amount' },
                  { id: 'company_price', label: 'Company Price' },
                  { id: 'date_to_pay', label: 'Date to Pay' },
                  { id: 'company', label: 'Company' },
                  { id: 'super_dealer', label: 'Super Dealer' },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <RequestTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                     
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

      <Dialog open={openViewModal} onClose={handleCloseViewModal} fullWidth maxWidth="sm">
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                <strong>Name:</strong> {selectedRequest.name}
              </Typography>
              <Typography>
                <strong>Brand:</strong> {selectedRequest.brand}
              </Typography>
              <Typography>
                <strong>Total Amount:</strong> {selectedRequest.total_amount}
              </Typography>
              <Typography>
                <strong>Company Price:</strong> {selectedRequest.company_price}
              </Typography>
              <Typography>
                <strong>Pay Date:</strong> {selectedRequest.date_to_pay}
              </Typography>
              <Typography>
                <strong>Company:</strong> {selectedRequest.company?.name}
              </Typography>
              <Typography>
                <strong>Super Dealer:</strong> {selectedRequest.super_dealer?.name}
              </Typography>
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

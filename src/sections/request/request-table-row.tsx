import { useState, useCallback } from 'react';

import {
  Popover,
  Checkbox,
  MenuItem,
  MenuList,
  TableRow,
  TableCell,
  IconButton
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type RequestProps = {
  id: number;
  name: string;
  brand: string;
  total_amount: number;
  company_price: number;
  date_to_pay: string;
  company: {
    id: number;
    name: string;
  };
  super_dealer: {
    id: number;
    name: string;
    company: {
      id: number;
      name: string;
    };
  };
};

type RequestTableRowProps = {
  row: RequestProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function RequestTableRow({
  row,
  selected,
  onSelectRow,
}: RequestTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleApprove = () => {
    console.log(`Approving request #${row.id}`);
    // Make API call here
    handleClosePopover();
  };

  const handleFulfill = () => {
    console.log(`Fulfilling request #${row.id}`);
    // Make API call here
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.name}</TableCell>
        <TableCell>{row.brand}</TableCell>
        <TableCell>{row.total_amount.toLocaleString()}</TableCell>
        <TableCell>{row.company_price.toLocaleString()}</TableCell>
        <TableCell>{row.date_to_pay}</TableCell>
        <TableCell>{row.company.name}</TableCell>
        <TableCell>{row.super_dealer.name}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList sx={{ p: 1, width: 180 }}>
          <MenuItem onClick={handleApprove}>
            <Iconify icon="custom:approve" />
            Approve
          </MenuItem>

          <MenuItem onClick={handleFulfill}>
            <Iconify icon="custom:fulfill" />
            Fulfill
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

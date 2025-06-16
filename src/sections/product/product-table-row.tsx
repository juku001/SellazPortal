import { useState, useCallback } from 'react';

import { menuItemClasses } from '@mui/material/MenuItem';
import {
  Box,
  Popover,
  Checkbox,
  MenuItem,
  MenuList,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';

import { IMAGE_BASE_URL } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------



export type ProductProps = {
  id: string;
  name: string;
  brand: string;
  image:  string | File | null;
  company_id: string;
  company_price: string;
};

type ProductTableRowProps = {
  row: ProductProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const getImageUrl = () => {
    if (typeof row.image === 'string') {
      return `${IMAGE_BASE_URL}/${row.image}`;
    }
    if (row.image instanceof File) {
      return URL.createObjectURL(row.image);
    }
    return '/placeholder-image.png'; // Fallback
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box
            component="img"
            src={getImageUrl()}
            alt={row.name}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              objectFit: 'cover',
            }}
          />
        </TableCell>

        <TableCell>{row.name}</TableCell>
        <TableCell>{row.brand}</TableCell>

        <TableCell>{row.company_id}</TableCell>

        <TableCell>{row.company_price}</TableCell>

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
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

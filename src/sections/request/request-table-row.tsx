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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type RequestProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  Requestname: string;
  role: string;
  status: string;
  logo: string;
  color: string;
};

type RequestTableRowProps = {
  row: RequestProps;
  selected: boolean;
  onSelectRow: () => void;
  onShowDetails: (request: RequestProps) => void;
  onEdit: (request: RequestProps) => void; // ✅ new
  //onDelete: (id: string) => void; // ✅ new
};


export function RequestTableRow({
  row,
  selected,
  onSelectRow,
  onShowDetails,
  onEdit,
 // onDelete,
}: RequestTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleShowDetails = () => {
    onShowDetails(row);
    handleClosePopover();
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
            src={row.logo}
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
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.Requestname}</TableCell>
        <TableCell>{row.role}</TableCell>

        <TableCell>
          <Label color={row.status === 'banned' ? 'error' : 'success'}>
            {row.status}
          </Label>
        </TableCell>

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
            width: 160,
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
          <MenuItem onClick={handleShowDetails}>
            <Iconify icon="solar:eye-bold" />
            Show
          </MenuItem>

          <MenuItem onClick={() => {
            handleClosePopover();
            onEdit(row); // ✅ Triggers parent edit handler
          }}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              //onDelete(row.id); // ✅ Triggers parent delete handler
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem disabled>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: row.color,
                border: '1px solid #ccc',
              }}
              title={`Company Color: ${row.color}`}
            />
            Color
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

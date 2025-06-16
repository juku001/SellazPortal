import { useState, useCallback } from 'react';

import { menuItemClasses } from '@mui/material/MenuItem';
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

export type SuperdealerProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  company_id: number;
  role: string;
  business_name: string;
  sex: 'male' | 'female';
};

type SuperdealerTableRowProps = {
  row: SuperdealerProps;
  selected: boolean;
  onShowDetails: (superdealer: SuperdealerProps) => void;
  onSelectRow: () => void;
};

export function SuperdealerTableRow({
  row,
  selected,
  onSelectRow,
  onShowDetails,
}: SuperdealerTableRowProps) {
  const [openPopover, setOpenPopover] = useState<null | HTMLButtonElement>(null);

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.sex}</TableCell>
        <TableCell>{row.company_id}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openPopover)}
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
          <MenuItem onClick={() => onShowDetails(row)}>
          <Iconify icon="solar:eye-bold" />
            Show Details
          </MenuItem>

          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

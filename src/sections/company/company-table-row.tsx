import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

// --------------------------------------------------------

export type CompanyProps = {
  id: string;
  name: string;
  abbr: string;
  logo: string | File | null;
  description: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
};

type CompanyTableRowProps = {
  row: CompanyProps;
  selected: boolean;
  onSelectRow: () => void;
  onShowrequest: (company: CompanyProps) => void;
  onEdit: (company: CompanyProps) => void;
  onDelete?: (id: string) => void;
};

export function CompanyTableRow({
  row,
  selected,
  onSelectRow,
  onShowrequest,
  onEdit,
  onDelete,
}: CompanyTableRowProps) {
  const [openPopover, setOpenPopover] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const getLogoUrl = () => {
    if (typeof row.logo === 'string') {
      return `${IMAGE_BASE_URL}/${row.logo}`;
    }
    if (row.logo instanceof File) {
      return URL.createObjectURL(row.logo);
    }
    return '/placeholder-logo.png'; // Fallback if null
  };

  return (
    <>
      <TableRow hover selected={selected} tabIndex={-1} role="checkbox">
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box
            component="img"
            src={getLogoUrl()}
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
        <TableCell>{row.abbr}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <Box sx={{ width: 24, height: 24, bgcolor: row.primary_color, borderRadius: '4px' }} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 24, height: 24, bgcolor: row.secondary_color, borderRadius: '4px' }} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 24, height: 24, bgcolor: row.background_color, borderRadius: '4px' }} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 24, height: 24, bgcolor: row.text_color, borderRadius: '4px' }} />
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
          <MenuItem
            onClick={() => {
              handleClosePopover();
              navigate(`/company/${row.id}`);
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Show
          </MenuItem>

          <MenuItem onClick={() => onShowrequest(row)}>
          <Iconify icon="solar:document-bold" />
            Requests
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit(row);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete?.(row.id);
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

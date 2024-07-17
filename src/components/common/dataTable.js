import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, IconButton, TablePagination, Menu, MenuItem } from '@mui/material';
import { MoreHorizRounded } from '@mui/icons-material';

const DataTable = ({ data, page, rowsPerPage, emptyRows, handleChangePage, handleChangeRowsPerPage, onViewCV, onEditCandidate, onDeleteCandidate, onQualifyCandidate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleViewCV = () => {
    if (selectedRow) {
      onViewCV(selectedRow.id);
    }
    handleClose();
  };

  const handleEdit = () => {
    if(selectedRow) {
      onEditCandidate(selectedRow.id)
    }
    handleClose();
  };

  const handleDelete = () => {
    if(selectedRow) {
      onDeleteCandidate(selectedRow.id);
    }
    handleClose();
  }

  const handleQualification = () => {
    if (selectedRow) {
      onQualifyCandidate(selectedRow.id);
    }
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Qualified</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell>
                  <Chip label={row.qualified === "Qualified" ? 'Qualified' : 'Not Qualified'} color={row.qualified === "Qualified" ?  "success" : "error"} variant='outlined'></Chip>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, row)}>
                    <MoreHorizRounded />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleViewCV}>Lihat CV Candidate</MenuItem>
                    <MenuItem onClick={handleEdit}>Edit Candidate</MenuItem>
                    <MenuItem onClick={handleQualification}>
                      {selectedRow?.qualified === 'Qualified' ? 'Hapus Kualifikasi' : 'Kualifikasi Candidate'}
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>Delete Candidate</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default DataTable;

// src/components/common/TrashDataTable.js

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Menu, MenuItem } from '@mui/material';
import { MoreHorizRounded } from '@mui/icons-material';

const TrashDataTable = ({ data, page, rowsPerPage, emptyRows, handleChangePage, handleChangeRowsPerPage }) => {
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
    console.log('View CV for', selectedRow);
    handleClose();
  };

  const handleEdit = () => {
    console.log('Edit Candidate', selectedRow);
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Candidates</TableCell>
              <TableCell>Qualified Candidate</TableCell>
              <TableCell>Removed Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.candidateCount}</TableCell>
                <TableCell>{row.qualifiedCandidateCount}</TableCell>
                <TableCell>{new Date(row.removedDate).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, row)}>
                    <MoreHorizRounded />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleViewCV}>Resolved Position</MenuItem>
                    <MenuItem onClick={handleEdit}>Deleted Permanently</MenuItem>
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

export default TrashDataTable;

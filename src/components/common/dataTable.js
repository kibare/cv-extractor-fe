import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = ({ data, page, rowsPerPage, emptyRows, handleChangePage, handleChangeRowsPerPage }) => {
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
                <TableCell>{row.qualified}</TableCell>
                <TableCell>
                  <IconButton><VisibilityIcon /></IconButton>
                  <IconButton><EditIcon /></IconButton>
                  <IconButton><DeleteIcon /></IconButton>
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

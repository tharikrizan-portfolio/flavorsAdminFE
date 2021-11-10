import { IconButton, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Delete, Edit, Block, Add } from "@material-ui/icons";

// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles(styles);

export default function CustomerTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableHeaderColor,
    tableData,
    setSelectedCustomer,
    handleOpenUpdateModal,
    deleteCustomer,
    cancelCustomer,
    unCancelCustomer,
  } = props;

  const handleEdit = (customer) => {
    handleOpenUpdateModal(true);
    setSelectedCustomer(customer);
  };
  const handleDelete = (customer) => {
    deleteCustomer(customer);
  };
  const handleCancel = (customer) => {
    cancelCustomer(customer);
  };
  const handleUnCancel = (customer) => {
    unCancelCustomer(customer);
  };

  const dataRows = () => {
    return tableData.map((row, index) => (
      <TableRow key={index} className={classes.tableBodyRow}>
        <TableCell>{row.name}</TableCell>
        <TableCell className={classes.tableCell}>{row.address}</TableCell>
        <TableCell className={classes.tableCell}>{row.phoneNumber}</TableCell>
        <TableCell className={classes.tableCell}>
          {row.isAvailable ? (
            <Tooltip title="Block">
              <IconButton onClick={() => handleCancel(row)}>
                <Block fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Un-Block">
              <IconButton onClick={() => handleUnCancel(row)}>
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Update Customer">
            <IconButton onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton onClick={() => handleDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell className={classes.tableCell}>
          {row.isAvailable ? "Available" : "Blocked"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>{dataRows()}</TableBody>
      </Table>
    </div>
  );
}

CustomerTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomerTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  setSelectedCustomer: PropTypes.func,
  handleOpenUpdateModal: PropTypes.func,
  deleteCustomer: PropTypes.func,
  cancelCustomer: PropTypes.func,
  unCancelCustomer: PropTypes.func,
};

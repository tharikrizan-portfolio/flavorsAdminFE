import { IconButton, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Delete, Edit } from "@material-ui/icons";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles(styles);

export default function CategoryTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableHeaderColor,
    tableData,

    setSelectedCategory,
    handleOpenUpdateModal,
    deleteCategory,
  } = props;

  const handleEdit = (category) => {
    handleOpenUpdateModal(true);
    setSelectedCategory(category);
  };
  const handleDelete = (category) => {
    deleteCategory(category);
  };

  const dataRows = () => {
    return tableData.map((row, index) => (
      <TableRow key={index} className={classes.tableBodyRow}>
        <TableCell>{row.name}</TableCell>
        <TableCell className={classes.tableCell}>
          <Tooltip title="Edit Category">
            <IconButton onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category">
            <IconButton onClick={() => handleDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
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

CategoryTable.defaultProps = {
  tableHeaderColor: "gray",
};

CategoryTable.propTypes = {
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
  handleOpenUpdateModal: PropTypes.func,
  deleteCategory: PropTypes.func,
  setSelectedCategory: PropTypes.func,
};

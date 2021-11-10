import { IconButton, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Add, Block, Delete, Edit } from "@material-ui/icons";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles(styles);

export default function MenuTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableHeaderColor,
    tableData,
    categories,
    setSelectedMenu,
    handleOpenUpdateModal,
    deleteMenu,
    cancelMenu,
    unCancelMenu,
  } = props;

  const handleEdit = (menu) => {
    handleOpenUpdateModal(true);
    setSelectedMenu(menu);
  };
  const handleDelete = (menu) => {
    deleteMenu(menu);
  };
  const handleCancel = (menu) => {
    cancelMenu(menu);
  };
  const handleUnCancel = (menu) => {
    unCancelMenu(menu);
  };
  const dataRows = () => {
    return tableData.map((row, index) => (
      <TableRow key={index} className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>{row.name}</TableCell>
        <TableCell className={classes.tableCell}>
          {categories[row.category]}
        </TableCell>
        <TableCell className={classes.tableCell}>{row.description}</TableCell>
        <TableCell className={classes.tableCell}>{row.halfPrice}</TableCell>
        <TableCell className={classes.tableCell}>{row.price}</TableCell>
        <TableCell className={classes.tableCell}>{row.timeToCook}</TableCell>
        <TableCell className={classes.tableCell}>
          {row?.offer?.discount || 0.0}
        </TableCell>
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
          <Tooltip title="Update Menu">
            <IconButton onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Menu">
            <IconButton onClick={() => handleDelete(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell className={classes.tableCell}>
          {row.isAvailable ? "Available" : "Not Available"}
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

MenuTable.defaultProps = {
  tableHeaderColor: "gray",
};

MenuTable.propTypes = {
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
  categories: PropTypes.object,

  setSelectedMenu: PropTypes.func,
  handleOpenUpdateModal: PropTypes.func,
  deleteMenu: PropTypes.func,
  cancelMenu: PropTypes.func,
  unCancelMenu: PropTypes.func,
};

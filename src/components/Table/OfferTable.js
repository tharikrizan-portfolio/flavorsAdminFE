import { IconButton, Tooltip } from "@material-ui/core";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Delete, Edit, Add, Block } from "@material-ui/icons";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles(styles);

export default function OfferTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableHeaderColor,
    tableData,
    menus,
    setSelectedOffer,
    handleOpenUpdateModal,
    deleteOffer,
    cancelOffer,
    unCancelOffer,
  } = props;

  const handleEdit = (offer) => {
    handleOpenUpdateModal(true);
    setSelectedOffer(offer);
  };
  const handleDelete = (offer) => {
    deleteOffer(offer);
  };
  const handleCancel = (offer) => {
    cancelOffer(offer);
  };
  const handleUnCancel = (offer) => {
    unCancelOffer(offer);
  };

  const dataRows = () => {
    return tableData.map((row, index) => (
      <TableRow key={index} className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>{row.name}</TableCell>
        <TableCell className={classes.tableCell}>{row.description}</TableCell>
        <TableCell className={classes.tableCell}>
          {menus?.[row?.menu]?.name}
        </TableCell>
        <TableCell
          className={classes.tableCell}
        >{`${row.quantityThresh} ${row.portionThresh}`}</TableCell>
        <TableCell className={classes.tableCell}>
          {row.type === "discount" || row.type === "percentage"
            ? row.discount
            : row.type === "freeMenu" &&
              `${row?.freeMenu?.quantity} nos ${row?.freeMenu?.portion}  ${row?.freeMenu?.name}`}
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
          <Tooltip title="Update Offer">
            <IconButton onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Offer">
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

OfferTable.defaultProps = {
  tableHeaderColor: "gray",
};

OfferTable.propTypes = {
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

  menus: PropTypes.array,
  setSelectedOffer: PropTypes.func,
  handleOpenUpdateModal: PropTypes.func,
  deleteOffer: PropTypes.func,
  cancelOffer: PropTypes.func,
  unCancelOffer: PropTypes.func,
};

import React, { useState } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Tooltip, IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DoneIcon from "@material-ui/icons/Done";
import RedoIcon from "@material-ui/icons/Redo";
import Delete from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableHeaderColor,
    tableData,
    cancelOrder,
    completeOrder,
    inCompleteOrder,
    removeCompletedOrder,
  } = props;

  const dataRows = () => {
    // const [open, setOpen] = React.useState(false);
    const [clikedRow, setClickedRow] = useState(-1);

    return tableData.map((row, index) => (
      <React.Fragment key={index}>
        <TableRow className={classes.tableBodyRow}>
          <TableCell className={classes.tableCell}>
            {row?.createdAt?.split("T")?.[0]}
          </TableCell>
          <TableCell className={classes.tableCell}>{row.phoneNumber}</TableCell>
          <TableCell className={classes.tableCell}>
            {`${row.firstName},${row.deliveryAddress}`}
          </TableCell>
          <TableCell className={classes.tableCell}>{row.total}</TableCell>
          <TableCell className={classes.tableCell}>{row.discount}</TableCell>
          <TableCell className={classes.tableCell}>{row.payable}</TableCell>
          <TableCell className={classes.tableCell}>
            <Tooltip title="Cancel">
              <IconButton
                onClick={() => {
                  cancelOrder(row);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!row.isCompleted ? (
              <Tooltip title="order-Complete">
                <IconButton onClick={() => completeOrder(row)}>
                  <DoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="order-Incomplete">
                <IconButton onClick={() => inCompleteOrder(row)}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View Order Details">
              <IconButton
                onClick={() => {
                  clikedRow === index
                    ? setClickedRow(-1)
                    : setClickedRow(index);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {row.isCompleted && (
              <Tooltip title="Delete Completed Order">
                <IconButton onClick={() => removeCompletedOrder(row)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
          <TableCell className={classes.tableCell}>
            {row.isCompleted ? "Completed" : "InComplete"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={clikedRow === index} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Menu Ordered
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Menu</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Portion</TableCell>
                      <TableCell align="right">Price </TableCell>
                      <TableCell align="right">Discount </TableCell>
                      <TableCell align="right">Total </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.menus.map((singleMenu, index2) => (
                      <>
                        <TableRow key={index2}>
                          <TableCell component="th" scope="row">
                            {singleMenu.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {singleMenu.purchasedQty}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {singleMenu.portion}
                          </TableCell>
                          <TableCell>
                            {singleMenu.portion === "half"
                              ? singleMenu.halfPrice
                              : singleMenu.price}
                          </TableCell>
                          <TableCell align="right">
                            {singleMenu.discount}
                          </TableCell>
                          <TableCell align="right">
                            {singleMenu.payablePrice}
                          </TableCell>
                        </TableRow>
                        {singleMenu.freeMenu.name && (
                          <TableRow key={index2}>
                            <TableCell component="th" scope="row">
                              {singleMenu.freeMenu.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {singleMenu.freeMenu.quantity}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {singleMenu.freeMenu.portion}
                            </TableCell>
                            <TableCell>FREE</TableCell>
                            <TableCell align="right">FREE</TableCell>
                            <TableCell align="right">FREE</TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                    {row.flatOfferFreeMenu.name && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.flatOfferFreeMenu.name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.flatOfferFreeMenu.quantity}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.flatOfferFreeMenu.portion}
                        </TableCell>
                        <TableCell>FREE</TableCell>
                        <TableCell align="right">FREE</TableCell>
                        <TableCell align="right">FREE</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
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

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
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
  cancelOrder: PropTypes.func,
  inCompleteOrder: PropTypes.func,
  completeOrder: PropTypes.func,
  removeCompletedOrder: PropTypes.func,
};

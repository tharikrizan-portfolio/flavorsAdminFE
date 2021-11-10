// @material-ui/core components
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import {
  alertNewOrdersCountApi,
  cancelOrderApi,
  completeOrderApi,
  getAllOrdersAvailableAndIncompleteApi,
  inCompleteOrderApi,
  removeCompleteOrderApi,
} from "API/order.api";
import alertSound from "assets/audio/orderAlert.mp3";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import Scrollbars from "react-custom-scrollbars";
// core components
import GridItem from "components/Grid/GridItem.js";
import OrderTable from "components/Table/OrderTable.js";
import React, { useEffect, useState } from "react";
import { getToast } from "util/ToastHelper";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  ...styles,
  headerRoot: {
    display: "flex",
  },
  headerTitle: {
    flexGrow: "2",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    flexGrow: "1",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: (theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function TableList() {
  const classes = useStyles();

  const [orderList, setOrderList] = useState([]);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [searched, setSearched] = useState("");
  const playAudio = () => {
    const audioEl = document.getElementsByClassName("audio-element")[0];
    audioEl.play();
  };
  const completeOrder = async (order) => {
    const completedOrder = await completeOrderApi({ _id: order._id });
    const newOrderList = orderList.map((singleOrder) => {
      if (singleOrder._id !== order._id) {
        return singleOrder;
      } else {
        return { ...completedOrder, isCompleted: !order.isCompleted };
      }
    });
    setOrderList([...newOrderList]);
    setFilteredOrderList([...newOrderList]);
  };
  const inCompleteOrder = async (order) => {
    const completedOrder = await inCompleteOrderApi({ _id: order._id });
    const newOrderList = orderList.map((singleOrder) => {
      if (singleOrder._id !== order._id) {
        return singleOrder;
      } else {
        return { ...completedOrder, isCompleted: !order.isCompleted };
      }
    });
    setOrderList([...newOrderList]);
    setFilteredOrderList([...newOrderList]);
  };
  const cancelOrder = async (order) => {
    const canceledOrder = await cancelOrderApi({ _id: order._id });
    const newOrderList = orderList.filter(
      (cust) => cust._id !== canceledOrder._id
    );
    setOrderList([...newOrderList]);
    setFilteredOrderList([...newOrderList]);
  };
  const removeCompletedOrder = async (order) => {
    const canceledOrder = await removeCompleteOrderApi({ _id: order._id });
    const newOrderList = orderList.filter(
      (cust) => cust._id !== canceledOrder._id
    );
    setOrderList([...newOrderList]);
    setFilteredOrderList([...newOrderList]);
  };
  const fetchOrders = async () => {
    try {
      const orders = await getAllOrdersAvailableAndIncompleteApi();
      if (orders) {
        setOrderList(orders);
        setFilteredOrderList(orders);
        return;
      } else {
        setOrderList([]);
        return;
      }
    } catch (error) {
      return error;
    }
  };

  const alertNewOrders = async () => {
    try {
      const newOrders = await alertNewOrdersCountApi();
      if (newOrders) {
        getToast(true, "New Orders available");
        playAudio();
        return;
      }
      return;
    } catch (error) {
      return error;
    }
  };
  const requestSearch = (searchValue) => {
    const filteredRows = orderList.filter((row) => {
      return row.phoneNumber.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredOrderList(filteredRows);
  };
  const onChangeSearch = (searchedValue) => {
    setSearched(searchedValue);
  };
  useEffect(() => {
    fetchOrders();
    alertNewOrders();
    const intervalID = setInterval(() => {
      fetchOrders();
      alertNewOrders();
    }, 1000 * 60);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <GridContainer>
      <audio className="audio-element">
        <source src={alertSound}></source>
      </audio>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <div className={classes.headerRoot}>
              <div className={classes.headerTitle}>
                <h4 className={classes.cardTitleWhite}>Orders Table</h4>
                <p className={classes.cardCategoryWhite}>List of all orders</p>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Phone Number..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  value={searched}
                  onChange={(e) => {
                    e.preventDefault();
                    onChangeSearch(e.target.value);
                    requestSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <Scrollbars style={{ height: 500 }}>
            <CardBody>
              <OrderTable
                tableHeaderColor="primary"
                tableHead={[
                  "Date",
                  "Phone Number",
                  "Delivery Address",
                  "Total",
                  "Bill Discount",
                  "Payable",
                  "Actions",
                  "Status",
                ]}
                tableData={filteredOrderList}
                cancelOrder={cancelOrder}
                completeOrder={completeOrder}
                inCompleteOrder={inCompleteOrder}
                removeCompletedOrder={removeCompletedOrder}
              />
            </CardBody>
          </Scrollbars>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

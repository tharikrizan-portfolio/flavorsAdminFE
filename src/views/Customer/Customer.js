import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomerTable from "components/Table/CustomerTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import AddCustomerModal from "./AddCustomerModal";
import { getAllCustomersApi } from "API/customer.api";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { deleteCustomerApi } from "API/customer.api";
import { cancelCustomerApi } from "API/customer.api";
import { unCancelCustomerApi } from "API/customer.api";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Scrollbars from "react-custom-scrollbars";

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
  createMenu: {
    marginLeft: "2%",
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

export default function Customer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);

    const localSelectedCustomer = customerList.filter(
      (cust) => cust._id === selectedCustomer._id
    )[0];

    if (selectedCustomer !== localSelectedCustomer) {
      setSelectedCustomer({});
    }
  };
  const deleteCustomer = async (customer) => {
    const deletedCustomer = await deleteCustomerApi({ _id: customer._id });
    const newCustomerList = customerList.filter(
      (cust) => cust._id !== deletedCustomer._id
    );
    setCustomerList([...newCustomerList]);
    setFilteredCustomerList([...newCustomerList]);
  };
  const cancelCustomer = async (customer) => {
    const cancelledCustomer = await cancelCustomerApi({ _id: customer._id });
    const newCustomerList = customerList.map((cust) => {
      if (cust._id !== customer._id) {
        return cust;
      } else {
        return { ...cancelledCustomer, isAvailable: !customer.isAvailable };
      }
    });
    setCustomerList([...newCustomerList]);
    setFilteredCustomerList([...newCustomerList]);
  };

  const unCancelCustomer = async (customer) => {
    const unCancelledCustomer = await unCancelCustomerApi({
      _id: customer._id,
    });
    const newCustomerList = customerList.map((cust) => {
      if (cust._id !== customer._id) {
        return cust;
      } else {
        return { ...unCancelledCustomer, isAvailable: !customer.isAvailable };
      }
    });
    setCustomerList([...newCustomerList]);
    setFilteredCustomerList([...newCustomerList]);
  };
  const requestSearch = (searchValue) => {
    const filteredRows = customerList.filter((row) => {
      return row.phoneNumber.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredCustomerList(filteredRows);
  };
  const onChangeSearch = (searchedValue) => {
    setSearched(searchedValue);
  };
  useEffect(async () => {
    try {
      const customers = await getAllCustomersApi();
      setCustomerList(customers);
      setFilteredCustomerList(customers);
    } catch (error) {
      setCustomerList([]);
    }
  }, []);
  useEffect(async () => {
    const localSelectedCustomer = customerList.filter(
      (cust) => cust._id === selectedCustomer._id
    )[0];

    try {
      if (selectedCustomer !== localSelectedCustomer) {
        const customers = await getAllCustomersApi();
        setCustomerList(customers);
        setFilteredCustomerList(customers);
      }
    } catch (error) {
      setCustomerList([]);
    }
  }, [selectedCustomer]);

  return (
    <GridContainer>
      <AddCustomerModal
        open={open}
        onClose={handleClose}
        customerList={customerList}
        setCustomerList={setCustomerList}
        setFilteredCustomerList={setFilteredCustomerList}
      />
      <UpdateCustomerModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        customerList={customerList}
        setCustomerList={setCustomerList}
        setFilteredCustomerList={setFilteredCustomerList}
        customer={selectedCustomer}
      />
      <Button
        className={classes.createMenu}
        onClick={handleOpen}
        color="success"
      >
        Create Customer
      </Button>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <div className={classes.headerRoot}>
              <div className={classes.headerTitle}>
                <h4 className={classes.cardTitleWhite}>Customers Table</h4>
                <p className={classes.cardCategoryWhite}>
                  List of all customers
                </p>
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
              <CustomerTable
                tableHeaderColor="primary"
                tableHead={[
                  "Name",
                  "Address",
                  "Phone Number",
                  "Action",
                  "Status",
                ]}
                tableData={filteredCustomerList}
                setCustomerList={setCustomerList}
                setSelectedCustomer={setSelectedCustomer}
                selectedCustomer={selectedCustomer}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteCustomer={deleteCustomer}
                cancelCustomer={cancelCustomer}
                unCancelCustomer={unCancelCustomer}
              />
            </CardBody>
          </Scrollbars>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

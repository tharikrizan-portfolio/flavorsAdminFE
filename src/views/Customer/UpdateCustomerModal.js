import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import PropTypes from "prop-types";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { editCustomerApi } from "API/customer.api";
import Scrollbars from "react-custom-scrollbars";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "fit-content",
    margin: "10%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
}));

export default function UpdateCustomerModal({
  open,
  onClose,
  customer,
  setCustomerList,
  setFilteredCustomerList,
  customerList,
}) {
  const classes = useStyles();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [progressing, setProgressing] = useState(false);

  const validate = () => {
    let valid = true;
    let errorsTemp = {};

    if (!name) {
      valid = false;
      errorsTemp["name"] = "Name is required";
    }

    if (!address) {
      valid = false;
      errorsTemp["address"] = "Address is required";
    }

    let numberError = validatePhoneNumber(phoneNumber);
    if (numberError !== "") {
      valid = false;
    }
    errorsTemp["phoneNumber"] = numberError;

    setErrors(errorsTemp);
    return valid;
  };

  const validatePhoneNumber = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Phone Number is required";
    } else if (number.length !== 10) {
      // length is not 10 digits
      result = "Phone Number should be 10 digits";
    } else {
      var patt = new RegExp("[^0-9]");
      if (patt.test(number)) {
        // contains special chars
        result = "Please enter only digits";
      } else if (number.substring(0, 2) !== "07") {
        // if not a mobile number
        result = "First two digits should be 07";
      } else {
        // valid mobile number
      }
    }
    return result;
  };

  const editCustomer = async (e) => {
    setProgressing(true);
    e.preventDefault();
    if (validate()) {
      try {
        const newCustomer = await editCustomerApi({
          ...customer,
          phoneNumber,
          address,
          name,
        });
        const newCustomerList = customerList.map((cust) => {
          if (cust._id !== customer._id) {
            return cust;
          } else {
            return { ...newCustomer, phoneNumber, address, name };
          }
        });
        setCustomerList([...newCustomerList]);
        setFilteredCustomerList([...newCustomerList]);
        onClose();
        setProgressing(false);
      } catch (error) {
        onClose();
        setProgressing(false);
        return;
      }
    } else {
      setProgressing(false);
    }
  };

  const nameOnChange = (event) => {
    setName(event.target.value);
    if (errors["name"]) {
      setErrors({ ...errors, name: null });
    }
  };

  const addressOnChange = (event) => {
    setAddress(event.target.value);
    if (errors["address"]) {
      setErrors({ ...errors, address: null });
    }
  };

  const phoneNumberOnChange = (event) => {
    setPhoneNumber(event.target.value);
    if (errors["phoneNumber"]) {
      setErrors({
        ...errors,
        phoneNumber: validatePhoneNumber(event.target.value),
      });
    }
  };

  useEffect(() => {
    setAddress(customer.address);
    setName(customer.name);
    setPhoneNumber(customer.phoneNumber);
  }, [customer]);

  if (progressing) {
    return (
      <div style={{ margin: "0 auto" }}>
        <Loader type="Puff" color="#00BFFF" height={100} width={100} />
      </div>
    );
  } else {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Scrollbars style={{ height: 500 }}>
          <Fade in={open}>
            <GridContainer>
              <GridItem xs={24} sm={24} md={18} style={{ width: "100%" }}>
                <Card>
                  <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Edit Customer</h4>
                    <p className={classes.cardCategoryWhite}>
                      Edit Customer Details
                    </p>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Name"
                          id="Name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={name}
                          onChange={nameOnChange}
                          error={errors["name"] ? true : false}
                          errorHelperText={errors["name"]}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Phone Number"
                          id="phone"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={phoneNumber}
                          onChange={phoneNumberOnChange}
                          error={errors["phoneNumber"] ? true : false}
                          errorHelperText={errors["phoneNumber"]}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Customer Address"
                          id="about-me"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 2,
                          }}
                          value={address}
                          onChange={addressOnChange}
                          error={errors["address"] ? true : false}
                          errorHelperText={errors["address"]}
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" onClick={editCustomer}>
                      Edit Customer
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
            </GridContainer>
          </Fade>
        </Scrollbars>
      </Modal>
    );
  }
}

UpdateCustomerModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  customer: PropTypes.object,
  setCustomerList: PropTypes.func,
  setFilteredCustomerList: PropTypes.func,
  customerList: PropTypes.array,
};

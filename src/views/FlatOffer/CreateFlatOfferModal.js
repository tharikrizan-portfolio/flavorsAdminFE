import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
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

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";

import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { ButtonBase } from "@material-ui/core";
import ImageUploader from "components/ImageUploader/ImageUploader";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { addNewFlatOfferApi } from "API/flatOffer.api";
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
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  image: {
    width: 256,
    height: 150,
  },
  formControl: {
    marginTop: "10%",
    minWidth: 60,
  },
}));

export default function CreateFlatOfferModal({
  open,
  onClose,
  offerNullMenuList,
  offerList,
  menuList,
  setOfferList,
  setFilteredOfferList,
}) {
  const classes = useStyles();
  const offerTypeList = [
    { _id: "discount", name: "Discount" },
    { _id: "percentage", name: "Percentage" },
    { _id: "freeMenu", name: "Free Menu" },
  ];
  const freeMenuPortionTypeList = [
    { _id: "full", name: "Large / Regular" },
    { _id: "half", name: "Small" },
  ];

  const [progressing, setProgressing] = useState(false);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [freeMenu, setFreeMenu] = useState({
    menu: "",
    quantity: "",
    name: "",
    portion: "",
  });
  const [percentage, setPercentage] = useState("");
  const [billThresh, setBillThresh] = useState("");
  const [type, setType] = useState("discount");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});

  const onImageUpload = (url, fileName) => {
    if (url == null) {
      onClose();
    } else if (errors["imageUrl"]) {
      setErrors({ ...errors, imageUrl: null });
    }
    setImageUrl(url);
    setFileName(fileName);
  };

  //auto-complete related useStates
  const [valueFreeMenu, setFreeMenuValue] = React.useState(
    offerNullMenuList[0]?.title
  );
  const [inputFreeMenuValue, setInputFreeMenuValue] = React.useState("");
  //end

  //type selection
  const [openTypeSelect, setOpenTypeSelect] = useState(false);
  const handleCloseTypeSelect = () => {
    setOpenTypeSelect(false);
  };
  const handleOpenTypeSelect = () => {
    setOpenTypeSelect(true);
  };
  //end
  //free menu portion type selection
  const [openFreeMenuPortionSelect, setOpenFreeMenuPortionSelect] = useState(
    false
  );
  const handleCloseFreeMenuPortionSelect = () => {
    setOpenFreeMenuPortionSelect(false);
  };
  const handleOpenFreeMenuPortionSelect = () => {
    setOpenFreeMenuPortionSelect(true);
  };
  //end

  const validate = () => {
    let valid = true;
    let errorsTemp = {};

    if (!name) {
      valid = false;
      errorsTemp["name"] = "Name is required";
    }
    if (!description) {
      valid = false;
      errorsTemp["description"] = "Description is required";
    }

    if (!imageUrl) {
      valid = false;
      errorsTemp["imageUrl"] = "Image is required";
    }
    if (!type) {
      valid = false;
      errorsTemp["type"] = "Type is required";
    }

    let billThreshError = validateBillThresh(billThresh);
    if (billThreshError !== "") {
      valid = false;
      errorsTemp["billThresh"] = billThreshError;
    }

    if (type === "discount" || type === "percentage") {
      if (type === "percentage") {
        let percentageError = validatePercentage(percentage);
        if (percentageError !== "") {
          valid = false;
          errorsTemp["percentage"] = percentageError;
        }
      }
      if (type === "discount") {
        let discountError = validateDiscount(discount);
        if (discountError !== "") {
          valid = false;
          errorsTemp["discount"] = discountError;
        }
      }
    } else {
      if (!freeMenu.menu) {
        valid = false;
        errorsTemp["freeMenu"] = "Free Menu is required";
      }
      if (!freeMenu.portion) {
        valid = false;
        errorsTemp["freeMenuPortion"] = "Free Menu Portion  is required";
      }
      let freeMenuQuantityError = validateFreeMenuQuantity(freeMenu.quantity);
      if (freeMenuQuantityError !== "") {
        valid = false;
        errorsTemp["freeMenuQuantity"] = freeMenuQuantityError;
      }
    }
    setErrors(errorsTemp);
    return valid;
  };

  const validateDiscount = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Discount is required";
    } else {
      var patt = new RegExp("[^0-9]");
      if (patt.test(number)) {
        // contains special chars
        result = "Discount should be a number";
      }
    }
    return result;
  };
  const validatePercentage = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Percentage is required";
    } else {
      var patt = new RegExp("[^0-9]");
      if (patt.test(number)) {
        // contains special chars
        result = "Percentage should be a number";
      } else {
        if (number < 0 || number > 100) {
          // contains special chars
          result = "Percentage should greater than 0 and less than 100";
        }
      }
    }
    return result;
  };
  const validateBillThresh = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Bill Throshold is required";
    } else {
      var patt = new RegExp("[^0-9]");
      if (patt.test(number)) {
        // contains special chars
        result = "Bill Throshold should be a number";
      } else {
        if (number < 0) {
          // contains special chars
          result = "Bill Throshold should greater than 0";
        }
      }
    }
    return result;
  };
  const validateFreeMenuQuantity = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Quantity is required";
    } else {
      var patt = new RegExp("[^0-9]");
      if (patt.test(number)) {
        // contains special chars
        result = "Quantity should be a number";
      } else {
        if (number < 0) {
          // contains special chars
          result = "Quantity should greater than 0";
        }
      }
    }
    return result;
  };
  const addNewOffer = async (e) => {
    setProgressing(true);
    e.preventDefault();
    if (validate()) {
      try {
        const newOffer = await addNewFlatOfferApi({
          name,
          discount,
          description,
          imageUrl,
          fileName,
          freeMenu,
          billThresh,
          type,
          percentage,
        });

        setOfferList([...offerList, newOffer]);
        setFilteredOfferList([...offerList, newOffer]);

        setName("");
        setFreeMenu("");
        setDescription("");
        setDiscount("");
        setPercentage("");
        setBillThresh("");
        setImageUrl("");

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

  const descriptionOnChange = (event) => {
    setDescription(event.target.value);
    if (errors["description"]) {
      setErrors({ ...errors, description: null });
    }
  };

  const discountOnChange = (event) => {
    setDiscount(event.target.value);
    if (errors["discount"]) {
      setErrors({ ...errors, discount: validateDiscount(event.target.value) });
    }
  };
  const typeOnChange = (event) => {
    setType(event.target.value);
    if (errors["type"]) {
      setErrors({ ...errors, type: null });
    }
  };

  const freeMenuPortionOnChange = (event) => {
    setFreeMenu({ ...freeMenu, portion: event.target.value });
    if (errors["freeMenuPortion"]) {
      setErrors({ ...errors, freeMenuPortion: null });
    }
  };
  const percentageOnChange = (event) => {
    let prct = event.target.value;
    setPercentage(prct);

    if (errors["percentage"]) {
      setErrors({
        ...errors,
        percentage: validatePercentage(prct),
      });
    }
  };
  const billThreshOnChange = (event) => {
    setBillThresh(event.target.value);
    if (errors["quantityThresh"]) {
      setErrors({
        ...errors,
        quantityThresh: validateBillThresh(event.target.value),
      });
    }
  };
  const freeMenuQuantityOnChange = (event) => {
    setFreeMenu({ ...freeMenu, quantity: event.target.value });
    if (errors["freeMenuQuantity"]) {
      setErrors({
        ...errors,
        freeMenuQuantity: validateFreeMenuQuantity(event.target.value),
      });
    }
  };
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
                    <h4 className={classes.cardTitleWhite}>
                      Create Flat Offer
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      Enter Flat Offer Details
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
                          labelText="Description"
                          id="description"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={description}
                          onChange={descriptionOnChange}
                          error={errors["description"] ? true : false}
                          errorHelperText={errors["description"]}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          id="standard-number"
                          labelText="Minimum Bill Value "
                          type="number"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={billThresh}
                          onChange={billThreshOnChange}
                          error={errors["billThresh"] ? true : false}
                          errorHelperText={errors["billThresh"]}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <FormControl
                          className={classes.formControl}
                          error={errors["type"] ? true : false}
                        >
                          <InputLabel id="demo-controlled-open-select-label">
                            Offer Type
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openTypeSelect}
                            onClose={handleCloseTypeSelect}
                            onOpen={handleOpenTypeSelect}
                            value={type}
                            onChange={typeOnChange}
                          >
                            {offerTypeList.map((type) => (
                              <MenuItem key={type?._id} value={type?._id}>
                                {type?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errors["type"]}</FormHelperText>
                        </FormControl>
                      </GridItem>
                      {type === "discount" ? (
                        <GridItem xs={12} sm={12} md={4}>
                          <CustomInput
                            labelText="Discount"
                            id="discount"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            value={discount}
                            onChange={discountOnChange}
                            error={errors["discount"] ? true : false}
                            errorHelperText={errors["discount"]}
                          />
                        </GridItem>
                      ) : type === "freeMenu" ? (
                        <>
                          <GridItem xs={12} sm={12} md={2}>
                            <FormControl
                              className={classes.formControl}
                              error={errors["freeMenuPortion"] ? true : false}
                            >
                              <InputLabel id="demo-controlled-open-select-label">
                                Portion
                              </InputLabel>
                              <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openFreeMenuPortionSelect}
                                onClose={handleCloseFreeMenuPortionSelect}
                                onOpen={handleOpenFreeMenuPortionSelect}
                                value={freeMenu.portion}
                                onChange={freeMenuPortionOnChange}
                              >
                                {freeMenuPortionTypeList.map((type) => (
                                  <MenuItem key={type?._id} value={type?._id}>
                                    {type?.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors["freeMenuPortion"]}
                              </FormHelperText>
                            </FormControl>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3}>
                            <CustomInput
                              labelText="Free Menu Quantity"
                              id="freeMenuQuantity"
                              type="number"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              value={freeMenu?.quantity}
                              onChange={freeMenuQuantityOnChange}
                              error={errors["freeMenuQuantity"] ? true : false}
                              errorHelperText={errors["freeMenuQuantity"]}
                            />
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={3}
                            style={{ display: "flex", margin: "auto" }}
                          >
                            <Autocomplete
                              value={valueFreeMenu}
                              onChange={(event, newValue) => {
                                setFreeMenuValue(newValue);
                                setFreeMenu({
                                  ...freeMenu,
                                  menu: newValue?._id,
                                  name: newValue?.name,
                                });
                                setErrors({ ...errors, freeMenu: null });
                              }}
                              inputValue={inputFreeMenuValue}
                              onInputChange={(event, newInputValue) => {
                                setInputFreeMenuValue(newInputValue);
                              }}
                              id="combo-box-demo"
                              options={menuList}
                              getOptionLabel={(option) => option?.name}
                              style={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Free Menu"
                                  error={errors["freeMenu"] ? true : false}
                                  variant="outlined"
                                />
                              )}
                            />
                          </GridItem>
                        </>
                      ) : (
                        type === "percentage" && (
                          <GridItem xs={12} sm={12} md={4}>
                            <CustomInput
                              id="standard-number"
                              labelText="Percentage"
                              type="number"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              value={percentage}
                              onChange={percentageOnChange}
                              error={errors["percentage"] ? true : false}
                              errorHelperText={errors["percentage"]}
                            />
                          </GridItem>
                        )
                      )}
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <ImageUploader
                          onImageUpload={onImageUpload}
                          error={errors["imageUrl"] ? true : false}
                          errorHelperText={errors["imageUrl"]}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        {imageUrl ? (
                          <ButtonBase className={classes.image}>
                            <img
                              className={classes.img}
                              alt="complex"
                              src={imageUrl}
                            />
                          </ButtonBase>
                        ) : null}
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" onClick={addNewOffer}>
                      Create Flat Offer
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

CreateFlatOfferModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  menuList: PropTypes.array,
  offerNullMenuList: PropTypes.array,
  offerList: PropTypes.array,
  setOfferList: PropTypes.func,
  setFilteredOfferList: PropTypes.func,
};
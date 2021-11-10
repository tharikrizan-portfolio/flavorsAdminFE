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
import { editMenuApi } from "API/menu.api";
import ImageUploader from "components/ImageUploader/ImageUploader";
import {
  ButtonBase,
  FormControl,
  FormHelperText,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
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
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function UpdateMenuModal({
  open,
  onClose,
  menu,
  setMenuList,
  setFilteredMenuList,
  menuList,
  categoryList,
}) {
  const classes = useStyles();
  const [openCatergorySelect, setOpenCatergorySelect] = useState(false);
  const handleCloseCategorySelect = () => {
    setOpenCatergorySelect(false);
  };

  const handleOpenCategorySelect = () => {
    setOpenCatergorySelect(true);
  };

  const [progressing, setProgressing] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [timeToCook, setTimeToCook] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [s3Urls, setS3Urls] = useState("");
  const [isNewImage, setIsNewImage] = useState(false);
  const [category, setCategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [halfPrice, setHalfPrice] = useState("");
  const [isHalf, setIsHalf] = useState(false);

  const onImageUpload = (url, fileName) => {
    if (url == null) {
      onClose();
    } else if (errors["imageUrl"]) {
      setErrors({ ...errors, imageUrl: null });
    }
    setImageUrl(url);
    setIsNewImage(true);
    setFileName(fileName);
  };

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
    if (!category) {
      valid = false;
      errorsTemp["category"] = "Category is required";
    }
    if (!imageUrl) {
      valid = false;
      errorsTemp["imageUrl"] = "Image is required";
    }

    let priceError = validatePrice(price);
    if (priceError !== "") {
      valid = false;
    }
    errorsTemp["price"] = priceError;

    let timeError = validateTimeToCook(timeToCook);
    if (timeError !== "") {
      valid = false;
    }
    errorsTemp["timeToCook"] = timeError;

    setErrors(errorsTemp);
    return valid;
  };

  const validatePrice = (number) => {
    let result = "";
    if (!number || number === "") {
      result = "Price is required";
    } else {
      result = validateNumber(number);
      if (result !== "") {
        result = "Price" + result;
      }
    }
    return result;
  };

  const validateTimeToCook = (number) => {
    let result = "";
    result = validateNumber(number);
    if (result !== "") {
      result = "Time" + result;
    }
    return result;
  };

  const validateNumber = (number) => {
    let result = "";
    var patt = new RegExp("[^0-9]");
    if (number !== "" && patt.test(number)) {
      // contains special chars
      result = " should be a number";
    } else {
      // valid
    }
    return result;
  };

  const editMenu = async (e) => {
    setProgressing(true);
    e.preventDefault();
    if (validate()) {
      try {
        const newMenu = await editMenuApi({
          ...menu,
          name,
          price,
          description,
          timeToCook,
          imageUrl,
          s3Urls,
          category,
          fileName,
          isHalf,
          halfPrice,
        });
        const newMenuList = menuList.map((singleMenu) => {
          if (singleMenu._id !== menu._id) {
            return singleMenu;
          } else {
            return {
              ...newMenu,
              name,
              price,
              description,
              timeToCook,
              category,
            };
          }
        });
        setMenuList([...newMenuList]);
        setFilteredMenuList([...newMenuList]);
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

  const categoryOnChange = (event) => {
    setCategory(event.target.value);
    if (errors["category"]) {
      setErrors({ ...errors, category: null });
    }
  };

  const priceOnChange = (event) => {
    setPrice(event.target.value);
    if (errors["price"]) {
      setErrors({ ...errors, price: validatePrice(event.target.value) });
    }
  };

  const timeToCookOnChange = (event) => {
    setTimeToCook(event.target.value);
    if (errors["timeToCook"]) {
      setErrors({
        ...errors,
        timeToCook: validateTimeToCook(event.target.value),
      });
    }
  };

  const halfPriceOnChange = (event) => {
    setHalfPrice(event.target.value);
    if (parseInt(event.target.value) > 0) {
      setIsHalf(true);
    } else {
      setIsHalf(false);
    }
    if (errors["halfPrice"]) {
      setErrors({ ...errors, price: validateNumber(event.target.value) });
    }
  };
  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setPrice(menu.price);
      setDescription(menu.description);
      setImageUrl(menu.imageUrl);
      setS3Urls(menu.s3Urls);
      setTimeToCook(menu.timeToCook);
      setCategory(menu.category);
      setFileName("");
      setIsHalf(menu.isHalf);
      setHalfPrice(menu.halfPrice);
    }
  }, [menu]);

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
                    <h4 className={classes.cardTitleWhite}>Edit Menu</h4>
                    <p className={classes.cardCategoryWhite}>
                      Edit Menu Details
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
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Large/Regular Portion Price"
                          id="fullPrice"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={price}
                          onChange={priceOnChange}
                          error={errors["price"] ? true : false}
                          errorHelperText={errors["price"]}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Small Portion Price"
                          id="halfPrice"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={halfPrice}
                          onChange={halfPriceOnChange}
                          error={errors["halfPrice"] ? true : false}
                          errorHelperText={errors["halfPrice"]}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <FormControl
                          className={classes.formControl}
                          error={errors["category"] ? true : false}
                        >
                          <InputLabel id="demo-controlled-open-select-label">
                            Category
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openCatergorySelect}
                            onClose={handleCloseCategorySelect}
                            onOpen={handleOpenCategorySelect}
                            value={category}
                            onChange={categoryOnChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {categoryList?.map((category) => (
                              <MenuItem
                                key={category?._id}
                                value={category?._id}
                              >
                                {category?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errors["category"]}</FormHelperText>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Time to cook"
                          id="time"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={timeToCook}
                          onChange={timeToCookOnChange}
                          error={errors["timeToCook"] ? true : false}
                          errorHelperText={errors["timeToCook"]}
                        />
                      </GridItem>
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={4} sm={4} md={4}>
                        <ImageUploader
                          onImageUpload={onImageUpload}
                          error={errors["imageUrl"] ? true : false}
                          errorHelperText={errors["imageUrl"]}
                        />
                      </GridItem>
                      <GridItem xs={8} sm={8} md={8}>
                        {imageUrl ? (
                          <ButtonBase className={classes.image}>
                            <img
                              className={classes.img}
                              alt="complex"
                              src={
                                isNewImage
                                  ? imageUrl
                                  : s3Urls
                                  ? s3Urls.lg
                                  : imageUrl
                              }
                            />
                          </ButtonBase>
                        ) : null}
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" onClick={editMenu}>
                      Edit Menu
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

UpdateMenuModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  menuList: PropTypes.array,
  setMenuList: PropTypes.func,
  setFilteredMenuList: PropTypes.func,
  menu: PropTypes.object,
  categoryList: PropTypes.array,
};

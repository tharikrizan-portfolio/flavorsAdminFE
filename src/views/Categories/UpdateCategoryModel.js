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
import { editCategoryApi } from "API/category.api";
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

export default function UpdateCategoryModal({
  open,
  onClose,
  category,
  setCategoryList,
  setFilteredCategoryList,
  categoryList,
}) {
  const classes = useStyles();
  const [progressing, setProgressing] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    let valid = true;

    if (!name) {
      valid = false;
      setError("Name is required");
    }
    return valid;
  };

  const editCategory = async (e) => {
    setProgressing(true);
    e.preventDefault();
    if (validate()) {
      try {
        const newCategory = await editCategoryApi({
          ...category,
          name,
        });
        const newCategoryList = categoryList.map((cat) => {
          if (cat._id !== category._id) {
            return cat;
          } else {
            return { ...newCategory, name };
          }
        });
        setCategoryList([...newCategoryList]);
        setFilteredCategoryList([...newCategoryList]);
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
    if (error) {
      setError("");
    }
  };

  useEffect(() => {
    setName(category.name);
  }, [category]);

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
              <GridItem xs={12} sm={12} md={12} style={{ width: "100%" }}>
                <Card>
                  <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Edit Customer</h4>
                    <p className={classes.cardCategoryWhite}>
                      Edit category Details
                    </p>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Name"
                          id="Name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={name}
                          onChange={nameOnChange}
                          error={error ? true : false}
                          errorHelperText={error}
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button block color="primary" onClick={editCategory}>
                      Edit category
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

UpdateCategoryModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  category: PropTypes.object,
  setCategoryList: PropTypes.func,
  setFilteredCategoryList: PropTypes.func,
  categoryList: PropTypes.array,
};

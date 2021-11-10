// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { getAllCategoriesApi } from "API/category.api";
import { deleteCategoryApi } from "API/category.api";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import CategoryTable from "components/Table/CategoryTable";
import React, { useEffect, useState } from "react";
import AddCategoryModal from "./AddCategoryModel";
import UpdateCategoryModal from "./UpdateCategoryModel";
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

export default function Category() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});

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

    const localSelectedCategory = categoryList.filter(
      (cat) => cat._id === selectedCategory._id
    )[0];

    if (selectedCategory !== localSelectedCategory) {
      setSelectedCategory({});
    }
  };
  const deleteCategory = async (category) => {
    const deletedCategory = await deleteCategoryApi({ _id: category._id });
    const newCategoryList = categoryList.filter(
      (cust) => cust._id !== deletedCategory._id
    );
    setCategoryList([...newCategoryList]);
    setFilteredCategoryList([...newCategoryList]);
  };
  const requestSearch = (searchValue) => {
    const filteredRows = categoryList.filter((row) => {
      return row.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredCategoryList(filteredRows);
  };
  const onChangeSearch = (searchedValue) => {
    setSearched(searchedValue);
  };
  useEffect(async () => {
    try {
      const categories = await getAllCategoriesApi();
      setCategoryList(categories);
      setFilteredCategoryList(categories);
    } catch (error) {
      setCategoryList([]);
    }
  }, []);
  useEffect(async () => {
    const localSelectedCategory = categoryList.filter(
      (cust) => cust._id === selectedCategory._id
    )[0];

    try {
      if (selectedCategory !== localSelectedCategory) {
        const categories = await getAllCategoriesApi();
        setCategoryList(categories);
        setFilteredCategoryList(categories);
      }
    } catch (error) {
      setCategoryList([]);
    }
  }, [selectedCategory]);

  return (
    <GridContainer>
      <AddCategoryModal
        open={open}
        onClose={handleClose}
        categoryList={categoryList}
        setCategoryList={setCategoryList}
        setFilteredCategoryList={setFilteredCategoryList}
      />
      <UpdateCategoryModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        categoryList={categoryList}
        setCategoryList={setCategoryList}
        setFilteredCategoryList={setFilteredCategoryList}
        category={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Button
        className={classes.createMenu}
        onClick={handleOpen}
        color="success"
      >
        Create Category
      </Button>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <div className={classes.headerRoot}>
              <div className={classes.headerTitle}>
                <h4 className={classes.cardTitleWhite}>Categories Table</h4>
                <p className={classes.cardCategoryWhite}>
                  List of all Categories
                </p>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
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
              <CategoryTable
                tableHeaderColor="primary"
                tableHead={["Name"]}
                tableData={filteredCategoryList}
                setCategoryList={setCategoryList}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteCategory={deleteCategory}
              />
            </CardBody>
          </Scrollbars>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

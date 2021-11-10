import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import MenuTable from "components/Table/MenuTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CreateMenuModal from "./CreateMenuModal";
import { getAllCategoriesApi } from "API/category.api";
import { getAllMenusApi } from "API/menu.api";
import UpdateMenuModal from "./UpdateMenuModal";
import { deleteMenuApi } from "API/menu.api";
import { cancelMenuApi } from "API/menu.api";
import { unCancelMenuApi } from "API/menu.api";
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

export default function Menu() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryHashMap, setCategoryHashMap] = useState({});
  const [menuList, setMenuList] = useState([]);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedMenu, setSelectedMenu] = useState({});
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

    const localSelectedMenu = menuList.filter(
      (singleMenu) => singleMenu._id === selectedMenu._id
    )[0];

    if (selectedMenu !== localSelectedMenu) {
      setSelectedMenu({});
    }
  };

  const deleteMenu = async (menu) => {
    const deletedMenu = await deleteMenuApi({ _id: menu._id });
    const newMenuList = menuList.filter(
      (singleMenu) => singleMenu._id !== deletedMenu._id
    );
    setMenuList([...newMenuList]);
    setFilteredMenuList([...newMenuList]);
  };
  const cancelMenu = async (menu) => {
    const cancelledMenu = await cancelMenuApi({ _id: menu._id });
    const newMenuList = menuList.map((singleMenu) => {
      if (singleMenu._id !== menu._id) {
        return singleMenu;
      } else {
        return { ...cancelledMenu, isAvailable: !menu.isAvailable };
      }
    });
    setMenuList([...newMenuList]);
    setFilteredMenuList([...newMenuList]);
  };

  const unCancelMenu = async (menu) => {
    const unCancelledMenu = await unCancelMenuApi({
      _id: menu._id,
    });
    const newMenuList = menuList.map((singleMenu) => {
      if (singleMenu._id !== menu._id) {
        return singleMenu;
      } else {
        return { ...unCancelledMenu, isAvailable: !menu.isAvailable };
      }
    });
    setMenuList([...newMenuList]);
    setFilteredMenuList([...newMenuList]);
  };
  const requestSearch = (searchValue) => {
    const filteredRows = menuList.filter((row) => {
      return row.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredMenuList(filteredRows);
  };
  const onChangeSearch = (searchedValue) => {
    setSearched(searchedValue);
  };
  useEffect(async () => {
    try {
      const categories = await getAllCategoriesApi();
      const menus = await getAllMenusApi();
      const categoriesHash = categories.reduce(
        (acc, cur) => ({ ...acc, [cur._id]: cur.name }),
        {}
      );

      setCategoryList(categories);
      setMenuList(menus);
      setCategoryHashMap(categoriesHash);
      setFilteredMenuList(menus);
    } catch (error) {
      setCategoryList([]);
    }
  }, []);
  useEffect(async () => {
    const localSelectedMenu = menuList.filter(
      (singleMenu) => singleMenu._id === selectedMenu._id
    )[0];

    try {
      if (selectedMenu !== localSelectedMenu) {
        const menus = await getAllMenusApi();
        setMenuList(menus);
      }
    } catch (error) {
      setMenuList([]);
    }
  }, [selectedMenu]);

  return (
    <GridContainer>
      <CreateMenuModal
        open={open}
        onClose={handleClose}
        categoryList={categoryList}
        menuList={menuList}
        setMenuList={setMenuList}
        setFilteredMenuList={setFilteredMenuList}
      />
      <UpdateMenuModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        menuList={menuList}
        setMenuList={setMenuList}
        setFilteredMenuList={setFilteredMenuList}
        menu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        categoryList={categoryList}
      />

      <Button
        className={classes.createMenu}
        onClick={handleOpen}
        color="primary"
      >
        Create Menu
      </Button>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <div className={classes.headerRoot}>
              <div className={classes.headerTitle}>
                <h4 className={classes.cardTitleWhite}>Menus Table</h4>
                <p className={classes.cardCategoryWhite}>List of all menus</p>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Menu Name..."
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
              <MenuTable
                tableHeaderColor="primary"
                tableHead={[
                  "Name",
                  "Category",
                  "Description",
                  "Half Price",
                  "Full Price",
                  "Time to Cook",
                  "Offer",
                  "Action",
                  "Status",
                ]}
                tableData={filteredMenuList}
                categories={categoryHashMap}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteMenu={deleteMenu}
                cancelMenu={cancelMenu}
                unCancelMenu={unCancelMenu}
                setMenuList={setMenuList}
                setSelectedMenu={setSelectedMenu}
                selectedMenu={selectedMenu}
              />
            </CardBody>
          </Scrollbars>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

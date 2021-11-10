import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CreateFlatOfferModal from "./CreateFlatOfferModal";
import UpdateFlatOfferModal from "./UpdateFlatOfferModal";
import FlatOfferTable from "components/Table/FlatOfferTable";
import { getAllFlatOffersApi } from "API/flatOffer.api";
import { unCancelFlatOfferApi } from "API/flatOffer.api";
import { cancelFlatOfferApi } from "API/flatOffer.api";
import { deleteFlatOfferApi } from "API/flatOffer.api";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Scrollbars from "react-custom-scrollbars";
import { getAllOfferNullMenusApi } from "API/menu.api";
import { getAllMenusApi } from "API/menu.api";

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

export default function Offer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [offerNullMenuList, setOfferNullMenuList] = useState([]);
  const [menuHashMap, setMenuHashMap] = useState({});
  const [offerList, setOfferList] = useState([]);
  const [filteredOfferList, setFilteredOfferList] = useState([]);
  const [searched, setSearched] = useState("");
  const [selectedOffer, setSelectedOffer] = useState({});
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

    const localSelectedOffer = offerList.filter(
      (singleOffer) => singleOffer._id === selectedOffer._id
    )[0];

    if (selectedOffer !== localSelectedOffer) {
      setSelectedOffer({});
    }
  };

  const requestSearch = (searchValue) => {
    const filteredRows = offerList.filter((row) => {
      return row.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredOfferList(filteredRows);
  };
  const onChangeSearch = (searchedValue) => {
    setSearched(searchedValue);
  };
  const deleteOffer = async (offer) => {
    const deletedOffer = await deleteFlatOfferApi({ _id: offer._id });
    const newOfferList = offerList.filter(
      (singleOffer) => singleOffer._id !== deletedOffer._id
    );
    setOfferList([...newOfferList]);
    setFilteredOfferList([...newOfferList]);
  };
  const cancelOffer = async (offer) => {
    const cancelledOffer = await cancelFlatOfferApi({ _id: offer._id });
    const newOfferList = offerList.map((singleOffer) => {
      if (singleOffer._id !== offer._id) {
        return singleOffer;
      } else {
        return { ...cancelledOffer, isAvailable: !offer.isAvailable };
      }
    });
    setOfferList([...newOfferList]);
    setFilteredOfferList([...newOfferList]);
  };

  const unCancelOffer = async (offer) => {
    const unCancelledOffer = await unCancelFlatOfferApi({
      _id: offer._id,
    });
    const newOfferList = offerList.map((singleOffer) => {
      if (singleOffer._id !== offer._id) {
        return singleOffer;
      } else {
        return { ...unCancelledOffer, isAvailable: !offer.isAvailable };
      }
    });
    setOfferList([...newOfferList]);
    setFilteredOfferList([...newOfferList]);
  };

  useEffect(async () => {
    try {
      const offers = await getAllFlatOffersApi();
      const menus = await getAllMenusApi();
      const offerNullmenus = await getAllOfferNullMenusApi();
      const menusHash = menus.reduce(
        (acc, cur) => ({
          ...acc,
          [cur._id]: { name: cur.name, _id: cur._id, price: cur.price, ...cur },
        }),
        {}
      );

      setOfferList(offers);
      setMenuList(menus);
      setFilteredOfferList(offers);
      setMenuHashMap(menusHash);
      setOfferNullMenuList(offerNullmenus);
    } catch (error) {
      setOfferList([]);
    }
  }, []);
  useEffect(async () => {
    const localSelectedOffer = offerList.filter(
      (singleOffer) => singleOffer._id === selectedOffer._id
    )[0];

    try {
      if (selectedOffer !== localSelectedOffer) {
        const offers = await getAllFlatOffersApi();
        setOfferList(offers);
      }
    } catch (error) {
      setOfferList([]);
    }
  }, [selectedOffer]);

  return (
    <GridContainer>
      <CreateFlatOfferModal
        open={open}
        onClose={handleClose}
        menuList={menuList}
        offerNullMenuList={offerNullMenuList}
        offerList={offerList}
        setOfferList={setOfferList}
        setFilteredOfferList={setFilteredOfferList}
      />
      <UpdateFlatOfferModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        offerList={offerList}
        setOfferList={setOfferList}
        setFilteredOfferList={setFilteredOfferList}
        offer={selectedOffer}
        menuList={menuList}
        menuHashMap={menuHashMap}
      />
      <Button
        className={classes.createMenu}
        onClick={handleOpen}
        color="primary"
      >
        Create Offer
      </Button>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <div className={classes.headerRoot}>
              <div className={classes.headerTitle}>
                <h4 className={classes.cardTitleWhite}>Offers Table</h4>
                <p className={classes.cardCategoryWhite}>List of all offers</p>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Offer Name..."
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
              <FlatOfferTable
                tableHeaderColor="primary"
                tableHead={[
                  "Name",
                  "Description",
                  "Type",
                  "Condition",
                  "Discount",
                  "Action",
                  "Status",
                ]}
                tableData={filteredOfferList}
                menus={menuHashMap}
                handleOpenUpdateModal={handleOpenUpdateModal}
                deleteOffer={deleteOffer}
                cancelOffer={cancelOffer}
                unCancelOffer={unCancelOffer}
                setOfferList={setOfferList}
                setSelectedOffer={setSelectedOffer}
                selectedOffer={selectedOffer}
              />
            </CardBody>
          </Scrollbars>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

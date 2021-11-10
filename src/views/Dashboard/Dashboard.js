import Icon from "@material-ui/core/Icon";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Accessibility from "@material-ui/icons/Accessibility";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import { getCustomersCountApi } from "API/customer.api";
import { getMenusCountApi } from "API/menu.api";
import { getOffersCountApi } from "API/offer.api";
import { getRevenueAndCountLastDayApi } from "API/order.api";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import GridContainer from "components/Grid/GridContainer.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import React, { useEffect, useState } from "react";
import TableList from "../TableList/TableList";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [summary, setSummary] = useState({
    orderCountLastDay: 0,
    menuCount: 0,
    offerCount: 0,
    customerCount: 0,
    revenueLastday: 0,
  });

  const fetchSummary = async () => {
    try {
      const revenueAndCountResponse = await getRevenueAndCountLastDayApi();
      const menuCountResponse = await getMenusCountApi();
      const offerCountResponse = await getOffersCountApi();
      const customerCountResponse = await getCustomersCountApi();
      setSummary({
        ...summary,
        orderCountLastDay: revenueAndCountResponse.count,
        revenueLastday: revenueAndCountResponse.revenue,
        menuCount: menuCountResponse,
        customerCount: customerCountResponse,
        offerCount: offerCountResponse,
      });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Offers/Menus</p>
              <h3 className={classes.cardTitle}>
                {summary.offerCount}/{summary.menuCount}
                <small></small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Offers vs Menus
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Revenue</p>
              <h3 className={classes.cardTitle}>RS.{summary.revenueLastday}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Completed Orders</p>
              <h3 className={classes.cardTitle}>{summary.orderCountLastDay}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Customers</p>
              <h3 className={classes.cardTitle}>{summary.customerCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <TableList />
    </div>
  );
}

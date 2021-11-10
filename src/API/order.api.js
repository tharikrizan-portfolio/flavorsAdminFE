import axios from "axios";
import { getToast } from "util/ToastHelper.js";

import {
  getLocalStorageProperty,
  setLocalStorageProperty,
} from "../util/LocalStorageHelper.js";

const getToken = () => getLocalStorageProperty("flavors-admin-token");
const rootUriOwner = process.env.REACT_APP_API_URL_OWNER;

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "bearer " + getToken();
  return config;
});

//get All incomplete available orders
export const getAllOrdersAvailableAndIncompleteApi = async () => {
  try {
    const { data } = await axios.get(
      `${rootUriOwner}/order-available-incomplete`
    );

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.orders);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    // getToast(false, error);
    return Promise.reject([]);
  }
};

//cancel Order
export const cancelOrderApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/order-cancel`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.order);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

//Make order as complete
export const completeOrderApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/order-complete`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.order);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

//Make order as inComplete
export const inCompleteOrderApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/order-in-complete`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.order);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

//Remove completed Orders
export const removeCompleteOrderApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(
      `${rootUriOwner}/order-delete-completed`,
      body
    );
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.order);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const getRevenueAndCountLastDayApi = async () => {
  let menusLocalStorage = getLocalStorageProperty(
    `flavors-orders-completed-revenue-last-day`
  );
  menusLocalStorage =
    menusLocalStorage !== "undefined" && JSON.parse(menusLocalStorage);
  let lastApiCall = getLocalStorageProperty(
    `flavors-orders-completed-revenue-last-day-api-called-time`
  );
  lastApiCall = lastApiCall && Date.parse(lastApiCall);
  const currentTime = new Date();
  if (lastApiCall) {
    const timeDiff = (currentTime - lastApiCall) / (1000 * 60);
    if (timeDiff <= 30) {
      return Promise.resolve(menusLocalStorage);
    }
  }

  try {
    const { data } = await axios.get(
      `${rootUriOwner}/order-completed-revenue-count-day`
    );

    if (data.success) {
      const revenueAndCount = data.data.data;
      setLocalStorageProperty(
        `flavors-orders-completed-revenue-last-day`,
        JSON.stringify({
          count: revenueAndCount.count,
          revenue: revenueAndCount.revenue,
        })
      );
      setLocalStorageProperty(
        `flavors-orders-completed-revenue-last-day-api-called-time`,
        currentTime.toString()
      );
      revenueAndCount.count && getToast(true, data.data.message);
      return Promise.resolve({
        count: revenueAndCount.count,
        revenue: revenueAndCount.revenue,
      });
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const alertNewOrdersCountApi = async () => {
  try {
    let ordersCountLocalStorage = getLocalStorageProperty(
      `flavors-orders-count`
    );
    ordersCountLocalStorage =
      ordersCountLocalStorage !== "undefined" &&
      JSON.parse(ordersCountLocalStorage);
    let lastApiCall = getLocalStorageProperty(
      `flavors-orders-count-api-called-time`
    );
    lastApiCall = lastApiCall && Date.parse(lastApiCall);
    const currentTime = new Date();
    if (lastApiCall) {
      const timeDiff = (currentTime - lastApiCall) / (1000 * 60);
      if (timeDiff <= 1) {
        return Promise.resolve(false);
      }
    }

    const { data } = await axios.get(`${rootUriOwner}/orders-count`);

    if (data.success) {
      const countData = data.data.data;
      //set orders count
      setLocalStorageProperty(
        `flavors-orders-count`,
        JSON.stringify(countData)
      );
      setLocalStorageProperty(
        `flavors-orders-count-api-called-time`,
        currentTime.toString()
      );
      //check if new orders available
      if (ordersCountLocalStorage !== "undefined") {
        let oldCount = ordersCountLocalStorage.count;
        if (oldCount < countData.count) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      } else {
        return Promise.resolve(true);
      }
    } else {
      return Promise.reject(0);
    }
  } catch (error) {
    return Promise.reject(0);
  }
};

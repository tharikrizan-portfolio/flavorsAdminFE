import axios from "axios";
import { getToast } from "util/ToastHelper.js";

import { getLocalStorageProperty } from "../util/LocalStorageHelper.js";

const getToken = () => getLocalStorageProperty("flavors-admin-token");
const rootUriOwner = process.env.REACT_APP_API_URL_OWNER;

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "bearer " + getToken();
  return config;
});

export const addNewCustomerApi = async ({ phoneNumber, address, name }) => {
  const body = { phoneNumber, address, name };

  try {
    const { data } = await axios.post(`${rootUriOwner}/add-customer`, body);

    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customer);
    }
    getToast(false, data.data.message);
  } catch (error) {
    getToast(false, error.response.data.message.message);
    return Promise.reject();
  }
};
export const getAllCustomersApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/all-customers`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customers);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const getCustomersCountApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/customers-count`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.count);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const editCustomerApi = async ({ phoneNumber, name, address, _id }) => {
  const body = { phoneNumber, name, address, _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/edit-customer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const cancelCustomerApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/cancel-customer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const unCancelCustomerApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/uncancel-customer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const deleteCustomerApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/delete-customer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.customer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

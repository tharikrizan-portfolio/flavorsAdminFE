import axios from "axios";
import { getToast } from "util/ToastHelper.js";

import { getLocalStorageProperty } from "../util/LocalStorageHelper.js";

const getToken = () => getLocalStorageProperty("flavors-admin-token");
const rootUriOwner = process.env.REACT_APP_API_URL_OWNER;

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "bearer " + getToken();
  return config;
});

export const addNewCategoryApi = async ({ name }) => {
  const body = { name };
  try {
    const { data } = await axios.post(`${rootUriOwner}/category`, body);

    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.category);
    }
    getToast(false, data.data.message);
  } catch (error) {
    getToast(false, error);
    return Promise.reject();
  }
};

export const getAllCategoriesApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/category`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.categories);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const editCategoryApi = async ({ name, _id }) => {
  const body = { name, _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/category`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.category);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const deleteCategoryApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/delete-category`, body);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.category);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

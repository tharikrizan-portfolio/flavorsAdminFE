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

export const register = async ({ phoneNumber, password, name }) => {
  const body = { phoneNumber, password, name };

  try {
    const { data } = await axios.post(`${rootUriOwner}/register`, body);
    if (data.data.data.success) {
      getToast(true, data.data.message);
    } else {
      getToast(false, data.data.message);
    }
  } catch (error) {
    alert(`error : ${error}`);
  }
};

export const updateProfileApi = async ({
  _id,
  phoneNumber,
  password,
  newPassword,
  name,
}) => {
  const body = { _id, phoneNumber, password, newPassword, name };

  try {
    const { data } = await axios.post(`${rootUriOwner}/update-profile`, body);

    if (data.data.success) {
      setLocalStorageProperty("flavors-admin-token", data.data.data.token);
      getToast(true, "Success Updation !");
    } else {
      getToast(false, "Updation Failure");
    }
    return Promise.resolve(data.data.success);
  } catch (error) {
    getToast(false, `error : ${error}`);
    return Promise.reject(false);
  }
};

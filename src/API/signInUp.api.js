import axios from "axios";
import { getToast } from "util/ToastHelper.js";
import { setLocalStorageProperty } from "../util/LocalStorageHelper.js";

const rootUriOwner = process.env.REACT_APP_API_URL_OWNER;

export const login = async ({ phoneNumber, password }) => {
  const body = { phoneNumber, password };

  try {
    const { data } = await axios.post(`${rootUriOwner}/login`, body);

    if (data.data.success) {
      setLocalStorageProperty("flavors-admin-token", data.data.data.token);
      getToast(true, "Success Login !");

      window.location = "/";
    } else {
      getToast(false, "Login Failure");
    }
  } catch (error) {
    alert(`error : ${error}`);
  }
};

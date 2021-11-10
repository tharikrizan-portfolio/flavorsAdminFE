import axios from "axios";
import { getToast } from "util/ToastHelper.js";

import { getLocalStorageProperty } from "../util/LocalStorageHelper.js";

const getToken = () => getLocalStorageProperty("flavors-admin-token");
const rootUriOwner = process.env.REACT_APP_API_URL_OWNER;
const appUrl = process.env.REACT_APP_FLAVORS_URL;
const s3Url = process.env.REACT_APP_S3_URL;

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = "bearer " + getToken();
  return config;
});

const uploadMenuImageApi = async (imageUrl, fileName) => {
  if (/^blob:http/.test(imageUrl)) {
    //upload image and get the image url
    let bodyFormData = new FormData();
    try {
      let file = await fetch(imageUrl)
        .then((r) => r.blob())
        .then(
          (blobFile) => new File([blobFile], fileName, { type: "image/png" })
        );
      bodyFormData.append("menu-image", file);
      const { data: imageUrlData } = await axios.post(
        `${rootUriOwner}/menu-upload-image`,
        bodyFormData
      );
      const isSuccess = imageUrlData.data.data.success;

      const newImageUrl = `${appUrl}/menu-images/${imageUrlData.data.data.data.imageUrl}`;
      const s3Urls = {
        sm: `${s3Url}/menu-images/sm/${imageUrlData.data.data.data.imageUrl}`,
        md: `${s3Url}/menu-images/md/${imageUrlData.data.data.data.imageUrl}`,
        lg: `${s3Url}/menu-images/lg/${imageUrlData.data.data.data.imageUrl}`,
      };
      return Promise.resolve({ isSuccess, newImageUrl, s3Urls });
    } catch (error) {
      Promise.reject(error);
    }
  }
  return Promise.resolve(imageUrl);
};
export const addNewMenuApi = async ({
  name,
  price,
  description,
  category,
  timeToCook,
  imageUrl,
  fileName,
  isHalf,
  halfPrice,
}) => {
  let body = {
    name,
    price,
    description,
    categoryId: category,
    timeToCook,
    imageUrl,
    isHalf,
    halfPrice,
  };

  try {
    //upload image and get the image url
    const { newImageUrl, s3Urls, isSuccess } = await uploadMenuImageApi(
      imageUrl,
      fileName
    );
    if (!isSuccess) {
      getToast(false, "Couldnt upload Image,check Size / type");
      return Promise.reject();
    }
    const { data } = await axios.post(`${rootUriOwner}/add-menu`, {
      ...body,
      imageUrl: newImageUrl,
      s3Urls,
    });

    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menu);
    }
    getToast(false, data.data.message);
  } catch (error) {
    getToast(false, error);
    return Promise.reject();
  }
};

export const getAllMenusApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/all-menus`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menus);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const getAllOfferNullMenusApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/all-offer-null-menus`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menus);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const getMenusCountApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/menus-count`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.count);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    // getToast(false, error);
    return Promise.reject([]);
  }
};

export const editMenuApi = async ({
  name,
  price,
  description,
  category,
  timeToCook,
  imageUrl,
  s3Urls,
  fileName,
  isHalf,
  halfPrice,
  _id,
}) => {
  let body = {
    name,
    price,
    description,
    categoryId: category,
    timeToCook,
    imageUrl,
    s3Urls,
    isHalf,
    halfPrice,
    _id,
  };
  try {
    //upload image if Image changed
    if (fileName) {
      const { newImageUrl, s3Urls } = await uploadMenuImageApi(
        imageUrl,
        fileName
      );
      body = { ...body, imageUrl: newImageUrl, s3Urls };
    }
    const { data } = await axios.put(`${rootUriOwner}/edit-menu`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve({ ...data.data.data.menu, ...body });
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const cancelMenuApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/cancel-menu`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menu);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const unCancelMenuApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/uncancel-menu`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menu);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const deleteMenuApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/delete-menu`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.menu);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

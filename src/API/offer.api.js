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

const uploadOfferImageApi = async (imageUrl, fileName) => {
  if (/^blob:http/.test(imageUrl)) {
    //upload image and get the image url
    let bodyFormData = new FormData();
    try {
      let file = await fetch(imageUrl)
        .then((r) => r.blob())
        .then(
          (blobFile) => new File([blobFile], fileName, { type: "image/png" })
        );
      bodyFormData.append("offer-image", file);
      const { data: imageUrlData } = await axios.post(
        `${rootUriOwner}/offer-upload-image`,
        bodyFormData
      );

      const isSuccess = imageUrlData.data.data.success;

      const newImageUrl = `${appUrl}/offer-images/${imageUrlData.data.data.data.imageUrl}`;
      const s3Urls = {
        sm: `${s3Url}/offer-images/sm/${imageUrlData.data.data.data.imageUrl}`,
        md: `${s3Url}/offer-images/md/${imageUrlData.data.data.data.imageUrl}`,
        lg: `${s3Url}/offer-images/lg/${imageUrlData.data.data.data.imageUrl}`,
      };
      return Promise.resolve({ isSuccess, newImageUrl, s3Urls });
    } catch (error) {
      Promise.reject(error);
    }
  }
  return Promise.resolve(imageUrl);
};
export const addNewOfferApi = async ({
  name,
  discount,
  description,
  menu,
  imageUrl,
  fileName,
  type,
  percentage,
  quantityThresh,
  portionThresh,
  freeMenu,
}) => {
  let body = {
    name,
    discount,
    description,
    menuId: menu,
    imageUrl,
    type,
    percentage,
    quantityThresh,
    freeMenu,
    portionThresh,
  };

  try {
    //upload image and get the image url
    const { newImageUrl, s3Urls, isSuccess } = await uploadOfferImageApi(
      imageUrl,
      fileName
    );
    if (!isSuccess) {
      getToast(false, "Couldnt upload Image,check Size / type");
      return Promise.reject();
    }
    const { data } = await axios.post(`${rootUriOwner}/add-offer`, {
      ...body,
      imageUrl: newImageUrl,
      s3Urls,
    });

    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.offer);
    }
    getToast(false, data.data.message);
  } catch (error) {
    getToast(false, error);
    return Promise.reject();
  }
};

export const getAllOffersApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/all-offers`);

    if (data.success) {
      // getToast(true, data.data.message);
      return Promise.resolve(data.data.data.offers);
    } else {
      getToast(false, data.data.message);
      return Promise.reject([]);
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject([]);
  }
};

export const getOffersCountApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/offers-count`);

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

export const editOfferApi = async ({
  name,
  discount,
  description,
  menu,
  imageUrl,
  s3Urls,
  fileName,
  type,
  percentage,
  quantityThresh,
  freeMenu,
  portionThresh,
  _id,
}) => {
  let body = {
    name,
    discount,
    description,
    menuId: menu,
    imageUrl,
    s3Urls,
    type,
    percentage,
    quantityThresh,
    freeMenu,
    portionThresh,
    _id,
  };
  try {
    //upload image if Image changed
    if (fileName) {
      const { newImageUrl, s3Urls } = await uploadOfferImageApi(
        imageUrl,
        fileName
      );
      body = { ...body, imageUrl: newImageUrl, s3Urls };
    }
    const { data } = await axios.put(`${rootUriOwner}/edit-offer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve({ ...data.data.data.offer, ...body });
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const cancelOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/cancel-offer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.offer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const unCancelOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/uncancel-offer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.offer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

export const deleteOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/delete-offer`, body);
    if (data.success) {
      getToast(true, data.data.message);
      return Promise.resolve(data.data.data.offer);
    } else {
      getToast(false, data.data.message);
      return Promise.reject({});
    }
  } catch (error) {
    getToast(false, error);
    return Promise.reject({});
  }
};

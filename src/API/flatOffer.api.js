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

const uploadFlatOfferImageApi = async (imageUrl, fileName) => {
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
export const addNewFlatOfferApi = async ({
  name,
  discount,
  description,
  imageUrl,
  fileName,
  type,
  percentage,
  billThresh,
  freeMenu,
}) => {
  let body = {
    name,
    discount,
    description,
    imageUrl,
    type,
    percentage,
    billThresh,
    freeMenu,
  };
  try {
    //upload image and get the image url
    const { newImageUrl, s3Urls, isSuccess } = await uploadFlatOfferImageApi(
      imageUrl,
      fileName
    );
    if (!isSuccess) {
      getToast(false, "Couldnt upload Image,check Size / type");
      return Promise.reject();
    }
    const { data } = await axios.post(`${rootUriOwner}/add-flat-offer`, {
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
    getToast(
      false,
      "Discount should be lower than min Bill Value, upload all fields, image type should be png or jpg or jpeg"
    );
    return Promise.reject();
  }
};

export const getAllFlatOffersApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/all-flat-offers`);

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

export const getFlatOffersCountApi = async () => {
  try {
    const { data } = await axios.get(`${rootUriOwner}/flat-offers-count`);

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

export const editFlatOfferApi = async ({
  name,
  discount,
  description,

  imageUrl,
  s3Urls,
  fileName,
  type,
  percentage,
  billThresh,
  freeMenu,
  _id,
}) => {
  let body = {
    name,
    discount,
    description,
    imageUrl,
    s3Urls,
    type,
    percentage,
    freeMenu,
    billThresh,
    _id,
  };
  try {
    //upload image if Image changed
    if (fileName) {
      const { newImageUrl, s3Urls } = await uploadFlatOfferImageApi(
        imageUrl,
        fileName
      );
      body = { ...body, imageUrl: newImageUrl, s3Urls };
    }
    const { data } = await axios.put(`${rootUriOwner}/edit-flat-offer`, body);
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

export const cancelFlatOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/cancel-flat-offer`, body);
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

export const unCancelFlatOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(
      `${rootUriOwner}/uncancel-flat-offer`,
      body
    );
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

export const deleteFlatOfferApi = async ({ _id }) => {
  const body = { _id };
  try {
    const { data } = await axios.put(`${rootUriOwner}/delete-flat-offer`, body);
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

import jwt from "jsonwebtoken";
import {
  getLocalStorageProperty,
  removeLocalStorageProperty,
} from "./LocalStorageHelper";
const SECRET = process.env.REACT_APP_JWT_SECRET;

export const verifyToken = () => {
  let ownerDetails = {};
  const token = getLocalStorageProperty("flavors-admin-token");
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        removeLocalStorageProperty("flavors-admin-token");
        return false;
      }
      ownerDetails = decoded;
      return decoded;
    });
    return ownerDetails;
  }
  return false;
};

import React from "react";
import PropTypes from "prop-types";
import CustomInput from "components/CustomInput/CustomInput";
import { getToast } from "util/ToastHelper";

export default function ImageUploader(props) {
  const {
    onImageUpload,
    error,
    errorHelperText
  } = props;

  const handleOnChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      return;
    }
    if (
      uploadedFile?.type === "image/jpeg" ||
      uploadedFile?.type === "image/png" ||
      uploadedFile?.type === "image/jpg"
    ) {
      if (uploadedFile?.size > 5242880) {
        clearFileInput(document.getElementById("image"));
        onImageUpload(null);
        return getToast(false, "File Too Large 5MB MAX");
      } else {
        const url = URL.createObjectURL(uploadedFile);
        onImageUpload(url, uploadedFile.name);
      }
    } else {
      clearFileInput(document.getElementById("image"));
      onImageUpload(null);
      return getToast(
        false,
        "jpeg , png , jpg are the only allowed file types"
      );
    }
  };

  function clearFileInput(ctrl) {
    try {
      ctrl.value = null;
    } catch (ex) {
      // do nothing
    }
    if (ctrl.value) {
      ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
    }
  }

  return (
    <React.Fragment>
      <CustomInput
        labelText="Add Image"
        id="image"
        formControlProps={{
          fullWidth: false,
        }}
        type="file"
        onChange={handleOnChange}
        error={error}
        errorHelperText={errorHelperText}
      />
    </React.Fragment>
  );
};

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func,
  error: PropTypes.bool,
  errorHelperText: PropTypes.string
};


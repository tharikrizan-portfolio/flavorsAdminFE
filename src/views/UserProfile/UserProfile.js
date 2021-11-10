// @material-ui/core components
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import React, { useEffect, useState } from "react";
import { verifyToken } from "util/JwtHelper";
import { getToast } from "util/ToastHelper";
import { updateProfileApi } from "API/owner.api";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);
const decodedToken = verifyToken();

export default function UserProfile() {
  const classes = useStyles();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordD, setNewPasswordD] = useState("");
  const [password, setPassword] = useState("");

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (password === "") {
        getToast(false, "Enter Password before updating");
        return;
      }
      if (newPassword !== newPasswordD) {
        getToast(false, "New Password Mismatch");
        return;
      }
      const updateStatus = await updateProfileApi({
        _id: decodedToken.owner._id,
        name,
        phoneNumber,
        password,
        newPassword,
      });

      if (updateStatus) {
        const newDecodedToken = verifyToken();
        setPhoneNumber(newDecodedToken.owner.phoneNumber);
        setName(newDecodedToken.owner.name);
        setPassword("");
        setNewPassword("");
        setNewPasswordD("");
      }
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    setPhoneNumber(decodedToken.owner.phoneNumber);
    setName(decodedToken.owner.name);
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Phone Number"
                    id="phoneNumber"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
              <Typography style={{ color: "#AAAAAA", marginTop: "10%" }}>
                Change Password
              </Typography>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="New Password"
                    id="newPassword1"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="New Password"
                    id="newPassword2"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={newPasswordD}
                    onChange={(e) => setNewPasswordD(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
              <Typography style={{ color: "#AAAAAA", marginTop: "10%" }}>
                Enter Password Before Updating
              </Typography>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Old Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={onUpdateProfile}>
                Update Profile
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

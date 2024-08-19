import React, { useState, useEffect, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { StateContext } from "../../StateContext";
import { useNavigation } from "@react-navigation/native";
import GenericButton from "../../components/GenericButton";

const ErrorAlreadyLoggedIn = ({ colors, fontSize }) => {
  const { chosenFont_Bold, chosenFont_ExtraBold, height, logout, width } =
    useContext(StateContext);
  const navigation = useNavigation();
  const [showTransition, setShowTransition] = useState(true);
  //show transition page
  useEffect(() => {
    setTimeout(() => {
      setShowTransition(false);
    }, 2000);
  }, [navigation]);

  //function to logout user
  const logoutUser = async () => {
    try {
      logout();
      navigation.push("Quiblr");
    } catch (e) {}
  };
  if (showTransition) {
    return (
      <View
        style={{
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator size={"large"} color={colors.blueShade2} />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 20,
      }}
    >
      <Text
        style={{
          color: colors.blueShade2,
          fontFamily: chosenFont_ExtraBold,
          fontSize: 25 + fontSize,
          textAlign: "center",
        }}
      >
        You're already logged in!
      </Text>
      <Text
        style={{
          width,
          paddingHorizontal: 30,
          maxWidth: 400,
          textAlign: "center",
          color: colors.greyShade3,
          fontFamily: chosenFont_Bold,
          fontSize: 16 + fontSize,
        }}
      >
        Woah partner! It looks like you're already logged in. Before navigating
        to this page, you need to logout
      </Text>
      <View
        style={{
          flexDirection: width > 450 && "row",
          gap: width > 450 ? 5 : 10,
        }}
      >
        <GenericButton
          text={"LOGOUT"}
          noText={false}
          disabled={false}
          includeBorder={true}
          textColor={colors.greyShade3}
          cancelButton={false}
          background={colors.white}
          size={"large"}
          shadowColor={colors.greyShade2}
          action={logoutUser}
          includeIcon={false}
          icon={""}
          loadingIndicator={false}
        />
        <GenericButton
          text={"STAY LOGGED IN"}
          noText={false}
          disabled={false}
          includeBorder={false}
          textColor={"white"}
          cancelButton={false}
          background={colors.blueShade2}
          size={"large"}
          shadowColor={colors.blueShade3}
          action={() => navigation.push("Quiblr")}
          includeIcon={false}
          icon={""}
          loadingIndicator={false}
        />
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ErrorAlreadyLoggedIn);

export default withColorScheme(ConnectedComponent);

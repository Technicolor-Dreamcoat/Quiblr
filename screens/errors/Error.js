import React, { useContext } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { StateContext } from "../../StateContext";
import { useNavigation } from "@react-navigation/native";
import GenericButton from "../../components/GenericButton";

const Error = ({ colors, fontSize }) => {
  const { chosenFont_Bold, chosenFont_ExtraBold, width } =
    useContext(StateContext);
  const navigation = useNavigation();

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
        404: Page not found
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
        Uh-oh! This page does not seem to exist.
      </Text>
      <View
        style={{
          flexDirection: width > 450 && "row",
          gap: width > 450 ? 5 : 10,
        }}
      >
        <GenericButton
          text={"HOME"}
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
const ConnectedComponent = connect(mapStateToProps)(Error);

export default withColorScheme(ConnectedComponent);

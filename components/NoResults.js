import React, { useContext } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
import GenericButton from "./GenericButton";

const NoResults = ({
  colors,
  styles,
  fontSize,
  text,
  description,
  leftButtonHide,
  leftButtonAction,
  leftButtonText,
  rightButtonHide,
  rightButtonAction,
  rightButtonText,
}) => {
  const { chosenFont_Bold, chosenFont_ExtraBold, width } =
    useContext(StateContext);
  return (
    <View
      style={{
        marginTop: 100,
        flex: 1,
        zIndex: 2,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          marginTop: -50,
          color: colors.blueShade2,
          fontFamily: chosenFont_ExtraBold,
          fontSize: 25 + fontSize,
        }}
      >
        {text}
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
        {description}
      </Text>

      <View
        style={[
          styles.evenlySpacedRow,
          {
            width: "100%",
            maxWidth: 400,
            gap: 5,
            paddingHorizontal: 10,
          },
        ]}
      >
        {!leftButtonHide && (
          <View style={{ width: "50%" }}>
            <GenericButton
              text={leftButtonText}
              noText={false}
              disabled={false}
              includeBorder={true}
              textColor={colors.blueShade2}
              cancelButton={false}
              background={colors.white}
              size={""}
              shadowColor={colors.greyShade2}
              action={leftButtonAction}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>
        )}
        {!rightButtonHide && (
          <View style={{ width: "50%" }}>
            <GenericButton
              text={rightButtonText}
              noText={false}
              disabled={false}
              includeBorder={false}
              textColor={"white"}
              cancelButton={false}
              background={colors.blueShade2}
              size={""}
              shadowColor={colors.blueShade3}
              action={rightButtonAction}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>
        )}
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
const ConnectedComponent = connect(mapStateToProps)(NoResults);

export default withColorScheme(ConnectedComponent);

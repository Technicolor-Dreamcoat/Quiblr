import React, { useContext } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import GenericButton from "../../../components/GenericButton";
import { useNavigation } from "@react-navigation/native";

const NoResultsCommunityView = ({
  colors,
  styles,
  fontSize,
  rightButtonHide,
}) => {
  const { chosenFont_Bold, chosenFont_ExtraBold, height, width } =
    useContext(StateContext);
  const navigation = useNavigation();

  return (
    <View
      style={{
        marginTop: 100,
        zIndex: 2,
        height: height / 2,
        alignSelf: "center",
        alignItems: "center",
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
        No Results
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
        This community seems to be empty! Try adjusting your post filter or
        click below to check out your home feed.
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
        {!rightButtonHide && (
          <View style={{ width: "50%" }}>
            <GenericButton
              text={"GO HOME"}
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
const ConnectedComponent = connect(mapStateToProps)(NoResultsCommunityView);

export default withColorScheme(ConnectedComponent);

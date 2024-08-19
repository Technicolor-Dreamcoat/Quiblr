import React, { useContext } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import GenericButton from "../../../components/GenericButton";
import { useNavigation } from "@react-navigation/native";

const NoResultsSearch = ({ colors, styles, fontSize, rightButtonHide }) => {
  const { chosenFont_Bold, chosenFont_ExtraBold, width } =
    useContext(StateContext);
  const navigation = useNavigation();

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
        No Search Results
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
        Hmmm, we couldn't find any search results.
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
const ConnectedComponent = connect(mapStateToProps)(NoResultsSearch);

export default withColorScheme(ConnectedComponent);

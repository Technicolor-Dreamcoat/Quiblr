import React, { useContext, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StateContext } from "../../../StateContext";
import GenericButton from "../../../components/GenericButton";
import { LargeSpace } from "../../../constants";
import { extractWebsiteName } from "../../../actions";
const NsfwWarningCommunity = ({
  colors,
  styles,
  route,
  fontSize,
  instance,
}) => {
  const { chosenFont_ExtraBold, chosenFont_Regular, height, setConfirmedNsfw } =
    useContext(StateContext);
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);

  //############################################
  //               NAVIGATION                 //
  //############################################
  //function for community view (navigation)
  const navigateCommunityView = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.communityName);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.communityInstance)
    );
    navigation.push("CommunityView", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  // Listen to navigation events to update the state
  useFocusEffect(
    React.useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation])
  );

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.push("Quiblr");
    }
  };

  const confirmedOver18 = () => {
    setConfirmedNsfw(true);
    navigateCommunityView(route?.params);
  };

  return (
    <ScrollView style={{ height, backgroundColor: colors.white }}>
      <LargeSpace />
      <LargeSpace />
      <View
        style={{
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: 15,
        }}
      >
        <Text
          style={{
            paddingBottom: 15,
            fontFamily: chosenFont_ExtraBold,
            fontSize: 30 + fontSize,
            paddingLeft: 5,
            color: colors.greyShade5,
            textAlign: "center",
          }}
        >
          You must be 18+ to view this content
        </Text>

        <Text
          style={{
            paddingBottom: 15,
            fontFamily: chosenFont_Regular,
            fontSize: 20 + fontSize,
            paddingLeft: 5,
            maxWidth: 700,
            color: colors.greyShade4,
            textAlign: "center",
          }}
        >
          You must be at least eighteen years old to view this content. Are you
          over eighteen and willing to see adult content?
        </Text>
        <View
          style={[
            styles.evenlySpacedRow,
            { width: "100%", maxWidth: 400, gap: 5, paddingHorizontal: 10 },
          ]}
        >
          <View style={{ width: "49%" }}>
            <GenericButton
              text={"GO BACK"}
              noText={false}
              disabled={false}
              includeBorder={false}
              textColor={"white"}
              cancelButton={false}
              background={colors.blueShade2}
              size={""}
              shadowColor={colors.blueShade3}
              action={handleGoBack}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>

          <View style={{ width: "49%" }}>
            <GenericButton
              text={"YES, I'M OVER 18"}
              noText={false}
              disabled={false}
              includeBorder={true}
              textColor={colors.greyShade3}
              cancelButton={false}
              background={colors.white}
              size={""}
              shadowColor={colors.greyShade3}
              action={confirmedOver18}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(NsfwWarningCommunity);

export default withColorScheme(ConnectedComponent);

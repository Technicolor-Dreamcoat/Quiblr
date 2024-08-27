import React, { useContext } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
import { Overlay } from "react-native-elements";
import XButton from "../components/XButton";
import PostDetailsPage from "../screens/PostDetailsPage";
import LeftBarList from "../sections/LeftBarList";
import { useNavigation } from "@react-navigation/native";
import GenericButton from "../components/GenericButton";

const AllOverlays = ({ styles, colors, showScrollBars }) => {
  const {
    chosenFont_Bold,
    chosenFont_ExtraBold,
    headerHeight,
    height,
    IconBoxMultiple2,
    isPWA,
    jwt,
    overlayHeight,
    overlayRadius,
    overlayWidth,
    postDetail,
    pressedShare,
    pwaHeight,
    setPostDetail,
    setPressedShare,
    setShowLearnMoreRemoveDuplicates,
    setShowSideDrawer,
    showLearnMoreRemoveDuplicates,
    showSideDrawer,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  return (
    <View>
      <Overlay //Post Detail Overlay
        isVisible={pressedShare}
        onBackdropPress={() => setPressedShare(false)}
        fullScreen={false}
        animationType={"fade"}
        overlayStyle={[
          styles.overlayMedium,
          {
            width: overlayWidth,
            borderRadius: overlayRadius,
            height: overlayHeight,
          },
        ]}
      >
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          showsVerticalScrollIndicator={showScrollBars}
        >
          <XButton functionAction={() => setPressedShare(false)} />
          <PostDetailsPage
            item={postDetail}
            setPressedShare={setPressedShare}
            setPostDetail={setPostDetail}
            // setShowComments={conse}
          />
        </ScrollView>
      </Overlay>

      <Overlay //Side Drawer
        isVisible={width > 1000 ? false : showSideDrawer}
        onBackdropPress={() => setShowSideDrawer(false)}
        fullScreen={false}
        backdropStyle={{
          backgroundColor: "rgba(0,0,0,.1)",
          marginTop: isPWA ? headerHeight + pwaHeight : headerHeight,
        }}
        //animationType={"fade"}
        overlayStyle={styles.overlaySideDrawer}
      >
        <TouchableOpacity
          onPress={() => setShowSideDrawer(false)}
          style={{
            height: isPWA ? headerHeight + pwaHeight : headerHeight,
            width: "100%",
            backgroundColor: "transparent",
          }}
        />
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TouchableOpacity
            onPress={() => setShowSideDrawer(false)}
            style={{
              backgroundColor: "transparent",
              width: width < 325 ? width - 240 : width - 300,
              height: isPWA
                ? height - (headerHeight + pwaHeight)
                : height - headerHeight,
            }}
          />
          <View
            style={{
              width: width < 325 ? 240 : 300,
              height: "100%",
              alignItems: "center",
              padding: 0,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: "100%",
                paddingBottom: isPWA ? headerHeight + pwaHeight : headerHeight,
                paddingHorizontal: 10,
                backgroundColor: colors.white,
                borderLeftWidth: 3,
                borderColor: colors.greyShade2,
              }}
            >
              {jwt == null && (
                <View
                  style={{
                    marginVertical: 30,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    gap: 5,
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <GenericButton
                      text={"SIGN UP"}
                      noText={false}
                      disabled={false}
                      includeBorder={true}
                      textColor={colors.blueShade2}
                      cancelButton={false}
                      background={colors.white}
                      size={""}
                      shadowColor={colors.greyShade2}
                      action={() => (
                        setShowSideDrawer(false), navigation.push("Signup")
                      )}
                      includeIcon={false}
                      icon={""}
                      loadingIndicator={false}
                    />
                  </View>
                  <View style={{ width: "45%" }}>
                    <GenericButton
                      text={"LOGIN"}
                      noText={false}
                      disabled={false}
                      includeBorder={false}
                      textColor={"white"}
                      cancelButton={false}
                      background={colors.blueShade2}
                      size={""}
                      shadowColor={colors.blueShade3}
                      action={() => (
                        setShowSideDrawer(false), navigation.push("Login")
                      )}
                      includeIcon={false}
                      icon={""}
                      loadingIndicator={false}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  marginTop: jwt == null ? 0 : 30,
                  width: "100%",
                  marginLeft: -15,
                }}
              >
                <LeftBarList mobileSidebar={true} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Overlay>

      <Overlay //Remove Duplicates Overlay
        isVisible={showLearnMoreRemoveDuplicates}
        onBackdropPress={() => setShowLearnMoreRemoveDuplicates(false)}
        fullScreen={false}
        animationType={"fade"}
        overlayStyle={[
          styles.overlayMedium,
          {
            width: width >= 625 ? 350 : "100%",
            borderRadius: overlayRadius,
            minHeight: 200,
            padding: 15,
          },
        ]}
      >
        {width < 625 && (
          <XButton
            functionAction={() => setShowLearnMoreRemoveDuplicates(false)}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderBottomWidth: 2,
            borderColor: colors.greyShade2,
            padding: 5,
          }}
        >
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 5,
              backgroundColor: colors.blueShade2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconBoxMultiple2 size={26} stroke={1.3} color={colors.white} />
          </View>
          <Text style={styles.boldText}>Remove Duplicates</Text>
        </View>
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text
            style={{
              color: colors.greyShade5,
              fontFamily: chosenFont_Bold,
              fontSize: 13,
            }}
          >
            Remove posts that have the{" "}
            <Text
              style={{
                color: colors.black,
                fontFamily: chosenFont_ExtraBold,
                fontSize: 13,
              }}
            >
              same title
            </Text>{" "}
            and are from the{" "}
            <Text
              style={{
                color: colors.black,
                fontFamily: chosenFont_ExtraBold,
                fontSize: 13,
              }}
            >
              same author
            </Text>
            .
          </Text>
          <Text
            style={{
              color: colors.greyShade5,
              fontFamily: chosenFont_Bold,
              fontSize: 13,
              paddingTop: 10,
            }}
          >
            The first duplicate post is kept in the feed and the others are
            removed.
          </Text>
        </View>
      </Overlay>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(AllOverlays);

export default withColorScheme(ConnectedComponent);

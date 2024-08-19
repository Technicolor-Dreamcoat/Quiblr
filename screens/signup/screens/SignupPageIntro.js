import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { extractWebsiteName } from "../../../actions";
import { SmallSpace, Space } from "../../../constants";
import { StateContext } from "../../../StateContext";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import BackNavigation from "../../../components/BackNavigation";
import AlreadyHaveAnAccount from "../components/AlreadyHaveAnAccount";
import GenericButton from "../../../components/GenericButton";
const FullSignupPage = ({ colors, styles, darkModeSettings }) => {
  const { chosenFont_Regular, height, width } = useContext(StateContext);
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.greyShade1,
          height,
          width,
          padding: 15,
          paddingTop: 0,
        }}
      >
        <View //Instance Info
          style={{ height, width }}
        >
          <Image
            source={require("../../../assets/Quiblr Signup Left.png")}
            style={{
              height: width < 1100 ? 400 : width < 1230 ? 450 : 550,
              width: width < 1100 ? 300 : width < 1230 ? 350 : 450,
              position: "absolute",
              bottom: 0,
              left: -15,
              zIndex: 1,
              // opacity: width < 1050 ? 0.5 : 1,
              opacity: 0.5,
            }}
          />
          <Image
            source={require("../../../assets/Quiblr Signup Right.png")}
            style={{
              height: width < 1100 ? 400 : width < 1230 ? 450 : 550,
              width: width < 1100 ? 300 : width < 1230 ? 350 : 450,
              position: "absolute",
              top: 0,
              right: -15,
              zIndex: 1,
              // opacity: width < 1050 ? 0.5 : 1,
              opacity: 0.5,
            }}
          />

          <BlurView //content
            // intensity={width < 1050 ? 100 : 50}
            intensity={100}
            tint={darkModeSettings ? "dark" : "default"}
            style={{
              backgroundColor: width < 1050 && "transparent",
              position: "absolute",
              top: width < 1050 ? 0 : 0,
              left: width < 1050 ? -15 : -15,
              // width: width < 1050 ? width : 500,
              width,
              justifyContent: "flex-start",
              height,
              alignSelf: "center",
              padding: 15,
              zIndex: 20,
            }}
          >
            <BackNavigation differentText={"FRONT PAGE"} goHome={true} />

            <View
              style={{
                paddingTop: 100,
                width: width < 1050 ? width : 600,
                paddingHorizontal: 30,
                alignSelf: "center",
              }}
            >
              <View //header title
                style={{
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <Image
                  source={require("../../../assets/favicon.png")}
                  style={{
                    height: 75,
                    width: 75,
                    alignSelf: "center",
                  }}
                />
                {/* </View> */}
                <Text style={styles.loginPageTitle}>Let's get started!</Text>
                <Space />
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: width < 800 ? 18 : 21,
                    color: colors.grey,
                    fontFamily: chosenFont_Regular,
                    textAlign: "center",
                  }}
                >
                  Discover diverse communities and genuine interaction, covering
                  everything from the latest news to the cutest cats on the web!
                </Text>
              </View>
              <Space />

              <View
                style={[
                  {
                    flexDirection: width > 450 && "row",
                    justifyContent: width > 450 && "center",
                    alignItems: "center",
                    gap: width > 450 ? 5 : 10,
                  },
                ]}
              >
                <GenericButton
                  text={"CHOOSE AN INSTANCE"}
                  noText={false}
                  disabled={false}
                  includeBorder={true}
                  textColor={colors.greyShade3}
                  cancelButton={false}
                  background={colors.white}
                  size={"medium"}
                  shadowColor={colors.greyShade3}
                  action={() => navigation.push("SignupSelectInstance")}
                  includeIcon={false}
                  icon={""}
                  loadingIndicator={false}
                />
                <GenericButton
                  text={"USE LEMMY.WORLD"}
                  noText={false}
                  disabled={false}
                  includeBorder={false}
                  textColor={"white"}
                  cancelButton={false}
                  background={colors.blueShade2}
                  size={"medium"}
                  shadowColor={colors.blueShade3}
                  action={() =>
                    navigation.push("SignupApplication", {
                      selected_instance: extractWebsiteName(
                        "https://lemmy.world"
                      ),
                    })
                  }
                  includeIcon={false}
                  icon={""}
                  loadingIndicator={false}
                />
              </View>
              <SmallSpace />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.push("LearnMoreInstance")}
                >
                  <Text style={[styles.blueText]}>What's an Instance?</Text>
                </TouchableOpacity>
              </View>
              <SmallSpace />
              <AlreadyHaveAnAccount />
              <Space />
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    darkModeSettings: state.updateItem.reduxGlobal.darkModeSettings,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(FullSignupPage);

export default withColorScheme(ConnectedComponent);

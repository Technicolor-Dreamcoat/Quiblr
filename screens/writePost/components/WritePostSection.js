import React, { useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";

const WritePostSection = ({ colors, styles, inherit }) => {
  const {
    chosenFont_Regular,
    IconLink,
    IconPhoto,
    jwt,
    signedInUserInfo,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [hovered, setHovered] = useState(false);
  return (
    <View
      style={{
        marginBottom: 10,
        width: "100%",
        maxWidth: 700,
      }}
    >
      {jwt != null && (
        <Pressable
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onPress={() =>
            navigation.push("WritePost", {
              // name: community?.community_view?.community?.name,
              // id: community?.community_view?.community?.id,
              inherit: inherit ? inherit : false,
            })
          }
          style={{
            width: "100%",
            marginTop: 10,
            borderRadius: 15,
          }}
        >
          <View
            style={{
              transitionDuration: "150ms",
              borderRadius: 15,
              width: "100%",
              height: 75,
              borderWidth: 2,
              backgroundColor: hovered ? colors.greyShade1 : colors.white,
              borderColor: colors.greyShade2,
              flexDirection: "row",
              paddingHorizontal: 15,
              gap: 10,
              alignItems: "center",
              shadowColor: colors.greyShade2,
              shadowOpacity: 1,
              shadowRadius: 0,
              shadowOffset: {
                height: hovered ? 3 : 4,
                width: 0,
              },
            }}
          >
            <View
              style={{
                borderRadius: 100,
                backgroundColor: colors.greyShade2,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {signedInUserInfo?.person_view?.person?.avatar && (
                <Image
                  style={{
                    borderRadius: 100,
                    width: 50,
                    height: 50,
                  }}
                  source={{
                    uri: signedInUserInfo?.person_view?.person?.avatar,
                  }}
                  placeholder={{
                    uri: signedInUserInfo?.person_view?.person?.avatar,
                  }}
                  priority={"high"}
                  transition={"cross-dissolve"}
                />
              )}
              {!signedInUserInfo?.person_view?.person?.avatar && (
                <Text
                  style={{
                    fontSize: 25,
                    textAlign: "center",
                    color: "white",
                    fontFamily: chosenFont_Regular,
                    textTransform: "uppercase",
                  }}
                >
                  {signedInUserInfo?.person_view?.person?.name[0]}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.mainPage_TextInputContainer,
                {
                  borderColor: colors.greyShade2,
                  height: 50,
                  //width: "75%",
                  flex: 1,
                  justifyContent: "center",
                  borderLeftWidth: 2,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: colors.greyShade1,
                  color: colors.black,
                  padding: 15,
                  justifyContent: "flex-start",
                },
              ]}
            >
              {width < 375 ? (
                <Text style={styles.placeholderInputText}>Post...</Text>
              ) : (
                <Text style={styles.placeholderInputText}>
                  Create a post...
                </Text>
              )}
            </View>

            <IconPhoto
              size={27}
              stroke={2.0}
              color={colors.lightGreyShade4}
              style={{ opacity: 0.7, marginLeft: 10 }}
            />
            <IconLink
              size={27}
              stroke={2.0}
              color={colors.lightGreyShade4}
              style={{ opacity: 0.7 }}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(WritePostSection);

export default withColorScheme(ConnectedComponent);

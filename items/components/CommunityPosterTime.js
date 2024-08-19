import React, { useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { extractWebsiteName, getTimeDifference } from "../../actions";
import { useNavigation } from "@react-navigation/native";

const CommunityPosterTime = ({
  colors,
  styles,
  item,
  chosenFont_ExtraBold,
  chosenFont_Bold,
  fontSize,
  pressCommunity,
  instance,
  setPostHovering,
}) => {
  const navigation = useNavigation();
  const [communityHovering, setCommunityHovering] = useState(false);
  const [posterHovering, setPosterHovering] = useState(false);

  //set dimensions
  const screenDimensions = Dimensions.get("window");
  const width = screenDimensions.width;

  const endGapPercentage = 13; // 10% of the row width will remain empty

  //############################################
  //               NAVIGATION                 //
  //############################################
  //function to see user detail (navigation)
  const pressUser = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedUserInstance = encodeURIComponent(
      extractWebsiteName(item?.creator?.actor_id)
    );
    const encodeduserName = encodeURIComponent(item?.creator?.name);
    navigation.push("User", {
      currentInstance: encodedCurrentInstance,
      userInstance: encodedUserInstance,
      userName: encodeduserName,
    });
  };
  return (
    <View
      style={{
        padding: 5,
        width: "75%",
      }}
    >
      <View style={[styles.preventTouchableRow, { width: "100%" }]}>
        <Pressable
          onHoverIn={() => (setCommunityHovering(true), setPostHovering(true))}
          onHoverOut={() => setCommunityHovering(false)}
          onPress={() => pressCommunity(item)}
          style={{
            marginBottom: 2,
            maxWidth: "100%",
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              transitionDuration: "150ms",
              width: "100%",
              fontFamily: chosenFont_ExtraBold,
              color: colors.greyShade5,
              fontSize: 16 + fontSize * 0.4,
              textDecorationLine: communityHovering && "underline",
            }}
          >
            {item?.community?.title}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          paddingRight: `${endGapPercentage}%`,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: colors.greyShade3,
            fontFamily: chosenFont_Bold,
            fontSize: 14 + fontSize * 0.4,
          }}
        >
          {getTimeDifference(item?.post)}
        </Text>

        <Text style={{ color: colors.greyShade3, marginHorizontal: 3 }}>·</Text>

        <Pressable
          onPress={() => pressUser(item)}
          onHoverIn={() => (setPosterHovering(true), setPostHovering(true))}
          onHoverOut={() => setPosterHovering(false)}
          style={{ marginRight: 6, flexShrink: 1 }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              transitionDuration: "150ms",
              color: colors.greyShade3,
              fontFamily: chosenFont_Bold,
              textDecorationLine: posterHovering && "underline",
              fontSize: 14 + fontSize * 0.4,
            }}
          >
            {item?.creator?.display_name || item?.creator?.name}
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
          {item?.creator?.admin && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: colors.orange,
                fontWeight: "bold",
                fontSize: 14 + fontSize * 0.4,
                marginRight: 6,
              }}
            >
              (Admin)
            </Text>
          )}
          {item?.creator?.bot_account && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: colors.green,
                fontWeight: "bold",
                fontSize: 14 + fontSize * 0.4,
                marginRight: 6,
              }}
            >
              (Bot)
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(CommunityPosterTime);

export default withColorScheme(ConnectedComponent);

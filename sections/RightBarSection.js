import { useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { StateContext } from "../StateContext";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { RenderText } from "../actions";
import { useNavigation } from "@react-navigation/native";
import { formatNumber, extractWebsiteName } from "../actions";
import GenericButton from "../components/GenericButton";
import { LargeSpace, SmallSpace } from "../constants";

const RightBarSection = ({
  colors,
  styles,
  listing,
  instance,
  fontSize,
  showCommunityDetails,
  postDetail,
  blurNSFWSettings,
  updateCommunity,
  hideBanner,
}) => {
  const {
    chosenFont_ExtraBold,
    communities,
    confirmedNsfw,
    followCommunityFunction,
    IconUsers,
    IconServer,
    IconUserCircle,
    jwt,
    loading,
    loadingFollowCommunity,
    rightBarWidth,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  //############################################
  //               NAVIGATION                 //
  //############################################

  //function if NSFW Community (navigation)
  const navigateNSFWCommunity = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("NsfwWarningCommunity", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //function for community view (navigation)
  const navigateCommunityView = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("CommunityView", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //render community item for flatlist -- needs to be in this format
  const renderCommunityRightBar = ({ item }) => (
    <RenderCommunityRightBar item={item} />
  );
  //render community item for flatlist
  const RenderCommunityRightBar = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={() => pressCommunity(item)}
      >
        <View
          activeOpacity={0.7}
          style={{
            transitionDuration: "150ms",
            height: 55,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: hovered ? colors.greyShade1 : "transparent",
            borderRadius: 15,
            borderWidth: 2,
            borderColor: hovered ? colors.greyShade2 : "transparent",
          }}
        >
          <View
            style={{
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.community.icon ? (
              <Image
                blurRadius={blurNSFWSettings && item.community.nsfw && 10}
                source={{ uri: item.community.icon }}
                placeholder={{ uri: item.community.icon }}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "cover",
                  borderRadius: 5,
                  backgroundColor: colors.greyShade2,
                }}
              />
            ) : (
              <IconUsers
                size={19}
                stroke={2.0}
                color={colors.greyShade4}
                style={{
                  backgroundColor: colors.greyShade2,
                  borderRadius: 100,
                  padding: 3,
                  paddingHorizontal: 4,
                }}
              />
            )}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  fontSize: 14 + fontSize,
                  color: colors.greyShade4,
                }}
              >
                {item.community.title}
              </Text>

              {item.community.nsfw && (
                <Text
                  style={{
                    color: colors.red,
                    marginLeft: 5,
                    fontFamily: chosenFont_Regular,
                    fontSize: 11 + fontSize,
                  }}
                >
                  NSFW
                </Text>
              )}
            </View>
            <View
              style={{
                right: 0,
                width: 130,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 0,
              }}
            >
              <View style={{ width: 13, height: 13 }}>
                <IconUserCircle
                  size={13}
                  stroke={2.0}
                  color={colors.greyShade3}
                />
              </View>
              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 11 + fontSize,
                  },
                ]}
              >
                {formatNumber(item.counts.subscribers)}
              </Text>
              <View style={{ marginLeft: 10, width: 13, height: 13 }}>
                <IconServer size={13} stroke={2.0} color={colors.greyShade3} />
              </View>
              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 11 + fontSize,
                  },
                ]}
              >
                {extractWebsiteName(item.community.actor_id)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <View>
      {width > 1000 && (
        <View //right panel
          style={{
            width: width * rightBarWidth,
            borderRadius: 15,
            marginTop: 15,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: width * rightBarWidth,
            }}
            contentContainerStyle={{
              width: width * rightBarWidth,
              overflow: "hidden",
            }}
            showsVerticalScrollIndicator={false}
          >
            {showCommunityDetails && postDetail && (
              <View //community
                style={{
                  minHeight: 390,
                  backgroundColor: colors.white,
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                  borderRadius: 15,
                  width: width * rightBarWidth,
                  overflow: "hidden",
                  marginBottom: 15,
                }}
              >
                {postDetail.community.banner && !hideBanner ? (
                  <Image
                    style={{ width: "100%", height: 150 }}
                    source={{ uri: postDetail.community.banner }}
                    placeholder={{ uri: postDetail.community.banner }}
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: 150,
                      backgroundColor: colors.greyShade1,
                      alignItems: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        width: 0,
                        height: 0,
                        backgroundColor: "transparent",
                        borderStyle: "solid",
                        borderLeftWidth: 250,
                        borderRightWidth: 0,
                        borderBottomWidth: 150,
                        borderLeftColor: colors.greyShade2,
                        borderRightColor: "transparent",
                        borderBottomColor: "transparent",
                        transform: [{ rotate: "180deg" }],
                      }}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    borderRadius: 100,
                    marginTop: -35,
                    width: 90,
                    height: 90,
                    zIndex: 2,
                    borderWidth: 10,
                    borderColor: colors.white,
                    backgroundColor: colors.greyShade1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  disabled
                  onPress={() =>
                    changeCommunityAndGoHome(postDetail.community.id)
                  }
                >
                  {postDetail.community.icon ? (
                    <Image
                      source={{ uri: postDetail.community.icon }}
                      placeholder={{ uri: postDetail.community.icon }}
                      style={{
                        borderRadius: 100,
                        width: 70,
                        height: 70,
                        padding: 0,
                      }}
                    />
                  ) : (
                    <IconUsers
                      size={40}
                      stroke={2.0}
                      color={colors.greyShade3}
                    />
                  )}
                </TouchableOpacity>
                <View style={[styles.paddingMedium, { width: "100%" }]}>
                  <Text style={styles.filterButtonTitle}>
                    {postDetail.community.title}
                  </Text>
                  <SmallSpace />
                  {jwt && postDetail?.subscribed == "NotSubscribed" ? (
                    <GenericButton
                      text={"FOLLOW"}
                      noText={false}
                      disabled={loadingFollowCommunity}
                      includeBorder={false}
                      textColor={"white"}
                      cancelButton={false}
                      background={colors.blueShade2}
                      size={""}
                      shadowColor={colors.blueShade3}
                      action={() => (
                        followCommunityFunction(postDetail), updateCommunity()
                      )}
                      includeIcon={false}
                      icon={""}
                      loadingIndicator={loadingFollowCommunity}
                      tall={false}
                    />
                  ) : jwt &&
                    !loadingFollowCommunity &&
                    postDetail?.subscribed == "Pending" ? (
                    <GenericButton
                      text={"PENDING"}
                      noText={false}
                      disabled={true}
                      includeBorder={false}
                      textColor={colors.greyShade3}
                      cancelButton={false}
                      background={colors.greyShade1}
                      size={""}
                      shadowColor={"transparent"}
                      action={() => (
                        followCommunityFunction(postDetail), updateCommunity()
                      )}
                      includeIcon={false}
                      icon={""}
                      loadingIndicator={loadingFollowCommunity}
                      tall={false}
                    />
                  ) : (
                    jwt &&
                    !loadingFollowCommunity && (
                      <GenericButton
                        text={"UNFOLLOW"}
                        noText={false}
                        disabled={loadingFollowCommunity}
                        includeBorder={true}
                        textColor={colors.greyShade3}
                        cancelButton={false}
                        background={colors.white}
                        size={""}
                        shadowColor={colors.greyShade3}
                        action={() => (
                          followCommunityFunction(postDetail), updateCommunity()
                        )}
                        includeIcon={false}
                        icon={""}
                        loadingIndicator={loadingFollowCommunity}
                        tall={false}
                      />
                    )
                  )}

                  <SmallSpace />
                  <View style={[styles.paddingTopMidMedium]}>
                    <RenderText
                      body={postDetail.community.description}
                      navigation={navigation}
                      colors={colors}
                      fontSize={fontSize}
                      instance={instance}
                    />
                  </View>
                </View>
              </View>
            )}

            <View //popular communities
              style={{
                backgroundColor: colors.white,
                // height: !communities?.length > 0 ? 200 : 415,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                padding: 15,
                marginBottom: 15,
                width: width * rightBarWidth,
              }}
            >
              {listing == "Subscribed" && (
                <Text style={styles.smallSectionTitles}>YOUR COMMUNITIES</Text>
              )}
              {listing != "Subscribed" && (
                <Text style={styles.smallSectionTitles}>
                  POPULAR COMMUNITIES
                </Text>
              )}
              <View style={styles.spaceSmall} />
              {!communities?.length > 0 && !loading && (
                <View
                  style={{
                    width: "100%",
                    padding: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <ActivityIndicator color={colors.greyShade3} size={"small"} />
                </View>
              )}
              <View>
                <FlatList
                  style={styles.radiusMedium}
                  scrollEnabled={false}
                  data={communities}
                  renderItem={renderCommunityRightBar}
                  keyExtractor={(item) => item.community?.id.toString()}
                />
              </View>
              <SmallSpace />

              {communities?.length > 0 && (
                <GenericButton
                  text={"SEE MORE"}
                  noText={false}
                  disabled={false}
                  includeBorder={true}
                  textColor={colors.blueShade2}
                  cancelButton={false}
                  background={colors.white}
                  size={""}
                  shadowColor={colors.greyShade2}
                  action={() => navigation.push("Communities")}
                  includeIcon={false}
                  icon={""}
                  loadingIndicator={false}
                  tall={true}
                />
              )}
              <SmallSpace />
            </View>
            <LargeSpace />
          </View>
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
    listing: state.updateItem.reduxGlobal.listing,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(RightBarSection);

export default withColorScheme(ConnectedComponent);

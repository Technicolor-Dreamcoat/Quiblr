import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import WritePostSection from "../../writePost/components/WritePostSection";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import {
  extractDate,
  extractWebsiteName,
  formatNumber,
} from "../../../actions";
import { SmallSpace } from "../../../constants";
import { StateContext } from "../../../StateContext";
import PageTitle from "../../../components/PageTitle";

const CommunityInfoHeader = ({ colors, styles }) => {
  const { community, PostFilters } = useContext(StateContext);

  return (
    <View
      style={{
        backgroundColor: colors.white,
        height: "100%",
        paddingTop: 0,
      }}
    >
      <PageTitle text={"Community Detail"} />
      <View>
        <SmallSpace />
        <View style={{ maxWidth: 700 }}>
          {community?.community_view?.community?.banner && (
            <View
              style={{
                height: 150,
                width: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderWidth: 3,
                borderBottomWidth: 0,
                borderColor: colors.greyShade2,
              }}
            >
              {community?.community_view?.community?.nsfw && (
                <View //nsfw
                  style={[
                    styles.nsfwContainer,
                    {
                      left: 10,
                      top: 10,
                      marginTop: 0,
                      marginLeft: 0,
                      position: "absolute",
                      zIndex: 10,
                    },
                  ]}
                >
                  <Text style={styles.nsfwText}>NSFW</Text>
                </View>
              )}
              <Image
                style={{
                  borderTopLeftRadius: 7,
                  borderTopRightRadius: 7,
                  width: "100%",
                  height: 150,
                }}
                resizeMode={"cover"}
                source={{
                  uri: community?.community_view?.community?.banner,
                }}
                placeholder={{
                  uri: community?.community_view?.community?.banner,
                }}
                priority={"high"}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              backgroundColor: colors.greyShade1,
              paddingLeft: 15,
              paddingVertical: 15,
              borderTopWidth: community?.community_view?.community?.banner
                ? 0
                : 3,
              borderWidth: 3,
              borderColor: colors.greyShade2,
              borderRadius: 10,
              borderTopLeftRadius: community?.community_view?.community?.banner
                ? 0
                : 10,
              borderTopRightRadius: community?.community_view?.community?.banner
                ? 0
                : 10,
            }}
          >
            {!community?.community_view?.community?.banner &&
              community?.community_view?.community?.nsfw && (
                <View //nsfw
                  style={[
                    styles.nsfwContainer,
                    { right: 10, top: 10, marginTop: 0, marginLeft: 0 },
                  ]}
                >
                  <Text style={styles.nsfwText}>NSFW</Text>
                </View>
              )}
            {community?.community_view?.community?.icon && (
              <Image
                style={{ borderRadius: 10, width: 50, height: 50 }}
                source={{
                  uri: community?.community_view?.community?.icon,
                }}
                placeholder={{
                  uri: community?.community_view?.community?.icon,
                }}
              />
            )}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  paddingLeft: 10,
                  width: "80%",
                }}
              >
                <Text style={styles.filterHeader}>
                  {community?.community_view?.community?.title}
                </Text>
                <Text style={styles.filterSubHeader}>
                  {extractWebsiteName(
                    community?.community_view?.community?.actor_id
                  )}
                </Text>
                <View
                  style={{
                    right: 0,
                    width: 130,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                    gap: 5,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.grey}
                    style={{ marginLeft: 0 }}
                  />
                  <Text
                    style={[
                      styles.cardMeta,
                      { color: colors.greyShade4, fontSize: 13 },
                    ]}
                  >
                    {extractDate(
                      community?.community_view?.community?.published
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    right: 0,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={[
                      styles.cardMeta,
                      { color: colors.greyShade4, fontSize: 13 },
                    ]}
                  >
                    {formatNumber(community?.community_view?.counts?.posts)}{" "}
                    Posts
                  </Text>
                  <Text
                    style={[
                      styles.cardMeta,
                      {
                        color: colors.greyShade4,
                        fontSize: 13,
                        marginLeft: 10,
                      },
                    ]}
                  >
                    {formatNumber(
                      community?.community_view?.counts?.subscribers
                    )}{" "}
                    Subscribers
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  marginLeft: 10,
                  marginTop: 5,
                }}
              ></View>
            </View>
          </View>
        </View>
        <PostFilters />
        <WritePostSection inherit={true} />
        <SmallSpace />
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
const ConnectedComponent = connect(mapStateToProps)(CommunityInfoHeader);

export default withColorScheme(ConnectedComponent);

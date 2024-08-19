import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { externalURL, extractWebsiteName, makeColorLighter } from "../actions";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { SmallSpace, Space } from "../constants";
import { StateContext } from "../StateContext";
import { useNavigation } from "@react-navigation/native";
import GenericButton from "../components/GenericButton";

const PostDetailsPage = ({ colors, styles, item, instance }) => {
  const {
    chosenFont_Regular,
    confirmedNsfw,
    IconClipboard,
    IconExternalLink,
    isPWA,
    setPressedShare,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [hoveredCopy, setHoveredCopy] = useState(false);
  const [hoveredExternal, setHoveredExternal] = useState(false);

  //############################################
  //               NAVIGATION                 //
  //############################################

  //function if NSFW Post (navigation)
  const navigateNSFWPost = (item) => {
    const encodedPostInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("NsfwWarningPost", {
      post_id: item.post.id,
      post_instance: encodedPostInstance,
      post_name: encodedPostName,
    });
  };

  //function for comments (navigation)
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("Comments", {
      post_id: item.post.id,
      post_instance: encodedInstance,
      post_name: encodedPostName,
    });
  };

  //view post
  const viewPost = async (item) => {
    await setPressedShare(false);
    item?.post?.nsfw && !confirmedNsfw
      ? navigateNSFWPost(item)
      : navigateComments(item);
  };

  //copy to clipboard
  const copyLink = async (item) => {
    try {
      await Clipboard.setStringAsync(item);
      alert("Link copied to clipboard!");
    } catch (e) {
      alert("Issue copying link to clipboard");
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        height: "100%",
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        paddingTop: 0,
      }}
    >
      <View //header
        style={[styles.loginContainer]}
      >
        <View>
          <SmallSpace />
          <View //header title
          >
            <View style={{ paddingTop: 10 }} />
            <Text style={styles.loginPageTitle}>Detail View</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View>
          <Space />
          <View //Post Title Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              Title: {item.post.name}
            </Text>
          </View>

          <SmallSpace />
          <View //Post Community Info
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: 5,
            }}
          >
            <View
              style={[
                styles.textInputContainer,
                {
                  justifyContent: "center",
                  flex: 1,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
              >
                Community: {item.community.name}
              </Text>
            </View>
            {/* <Hoverable style={{ width: "10%", minWidth: 55 }}>
              {({ hovered }) => (
                <TouchableOpacity //Copy original Link
                  onPress={() =>
                    copyLink(
                      window.location.href.split("/")[0] +
                        "//" +
                        window.location.href.split("/")[2] +
                        "/instance/" +
                        extractWebsiteName(instance) +
                        "/post/" +
                        item.post.id
                    )
                  }
                  style={[
                    styles.textInputContainer,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: hovered
                        ? makeColorLighter(colors.red)
                        : colors.red,
                      borderColor: colors.darkRed,
                      shadowColor: colors.darkRed,
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      shadowOffset: {
                        height: 6,
                        width: 0,
                      },
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: chosenFont_Bold,
                      fontSize: 13,
                      color: "white",
                    }}
                  >
                    Block
                  </Text>
                </TouchableOpacity>
              )}
            </Hoverable> */}
          </View>
          <SmallSpace />
          <View //Post URL Info
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: 5,
            }}
          >
            <View // post URL Info
              style={[
                styles.textInputContainer,
                {
                  justifyContent: "center",
                  flex: 1,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
              >
                URL:{" "}
                {window.location.href.split("/")[0] +
                  "//" +
                  window.location.href.split("/")[2] +
                  "/instance/" +
                  extractWebsiteName(instance) +
                  "/post/" +
                  item.post.id +
                  "/" +
                  encodeURIComponent(item.post.name)}
              </Text>
            </View>

            <Pressable
              onHoverIn={() => setHoveredCopy(true)}
              onHoverOut={() => setHoveredCopy(false)}
              style={{ width: "10%", minWidth: 55 }}
            >
              <TouchableOpacity //Copy Link
                onPress={() =>
                  copyLink(
                    window.location.href.split("/")[0] +
                      "//" +
                      window.location.href.split("/")[2] +
                      "/instance/" +
                      extractWebsiteName(instance) +
                      "/post/" +
                      item.post.id +
                      "/" +
                      encodeURIComponent(item.post.name) +
                      "/"
                  )
                }
                style={[
                  styles.textInputContainer,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: hoveredCopy
                      ? makeColorLighter(colors.blueShade2)
                      : colors.blueShade2,
                    borderColor: colors.blueShade3,
                    shadowColor: colors.blueShade3,
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowOffset: {
                      height: 6,
                      width: 0,
                    },
                  },
                ]}
              >
                <IconClipboard size={20} stroke={2} color={"white"} />
              </TouchableOpacity>
            </Pressable>
          </View>
          <SmallSpace />
          <View //Original Post URL Info
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: 5,
            }}
          >
            <View //Original post URL Info
              style={[
                styles.textInputContainer,
                {
                  justifyContent: "center",
                  flex: 1,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
              >
                Original URL: {item?.post?.ap_id}
              </Text>
            </View>

            {!isPWA && (
              <Pressable
                onHoverIn={() => setHoveredExternal(true)}
                onHoverOut={() => setHoveredExternal(false)}
                style={{ width: "10%", minWidth: 55 }}
              >
                <TouchableOpacity //Go to external link
                  onPress={() => externalURL(item?.post?.ap_id)}
                  style={[
                    styles.textInputContainer,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: hoveredExternal
                        ? makeColorLighter(colors.orange)
                        : colors.orange,
                      borderColor: colors.darkOrange,
                      shadowColor: colors.darkOrange,
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      shadowOffset: {
                        height: 6,
                        width: 0,
                      },
                    },
                  ]}
                >
                  <IconExternalLink size={20} stroke={2} color={"white"} />
                </TouchableOpacity>
              </Pressable>
            )}
          </View>
          <SmallSpace />
          <View //Post Votes Info
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View //Post Upvote Info
              style={[
                styles.textInputContainer,
                { justifyContent: "center", width: "49%" },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
              >
                Upvotes: {item.counts.upvotes}
              </Text>
            </View>
            <View //Post Downvote Info
              style={[
                styles.textInputContainer,
                { justifyContent: "center", width: "49%" },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
              >
                Downvotes: {item.counts.downvotes}
              </Text>
            </View>
          </View>

          <SmallSpace />
          <View //Post Date Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              Date: {item.post.published}
            </Text>
          </View>

          <SmallSpace />
          <View //Post Date Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              NSFW: {item.post.nsfw ? "True" : "False"}
            </Text>
          </View>

          <SmallSpace />
          <View //Post Author Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              Author: {item.creator.name}
            </Text>
          </View>

          <SmallSpace />
          <View //Post Admin Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              Admin: {item.creator.admin ? "True" : "False"}
            </Text>
          </View>

          <SmallSpace />
          <View //Post Bot Info
            style={[styles.textInputContainer, { justifyContent: "center" }]}
          >
            <Text
              numberOfLines={1}
              style={{ color: colors.grey, fontFamily: chosenFont_Regular }}
            >
              Bot: {item.creator.bot_account ? "True" : "False"}
            </Text>
          </View>

          <SmallSpace />

          <View style={[styles.evenlySpacedRow]}>
            <GenericButton
              text={"VIEW POST"}
              noText={false}
              disabled={false}
              includeBorder={false}
              textColor={"white"}
              cancelButton={false}
              background={colors.blueShade2}
              size={"large"}
              shadowColor={colors.blueShade3}
              action={() => viewPost(item)}
              includeIcon={false}
              loadingIndicator={false}
              icon={""}
            />
          </View>
          <Space />
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostDetailsPage);

export default withColorScheme(ConnectedComponent);

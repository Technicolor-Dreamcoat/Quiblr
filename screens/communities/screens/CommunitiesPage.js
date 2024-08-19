import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import SearchCommunitiesPage from "../components/SearchCommunitiesPage";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { SmallSpace } from "../../../constants";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import { extractWebsiteName, formatNumber } from "../../../actions";
import HeaderSection from "../../../sections/HeaderSection";
import BlankBarSection from "../../../sections/BlankBarSection";
import LeftBarList from "../../../sections/LeftBarList";
import PageTitle from "../../../components/PageTitle";
import SearchDropdownSection from "../../search/components/SearchDropdownSection";
import NextLastButton from "../../../components/NextLastButton";
import SimpleFilterButton from "../../../components/SimpleFilterButton";

const CommunitiesPage = ({
  colors,
  styles,
  listing,
  blurNSFWSettings,
  fontSize,
  instance,
  showScrollBars,
}) => {
  const {
    centerPanelWidthNonDesktop,
    centerPanelWidthMedium,
    chosenFont_ExtraBold,
    communitiesList,
    communitiesPage,
    communitiesPageLoading,
    communityInput,
    communityInputWithInstance,
    CommunityPlaceholders,
    confirmedNsfw,
    fetchCommunitiesPage,
    fetchFollowedCommunities,
    fetchSearchCommunities,
    followCommunityPageFunction,
    followedCommunities,
    followPressedId,
    height,
    IconAlertTriangle,
    IconChevronRight,
    IconServer,
    IconUserCircle,
    IconUsers,
    isPWA,
    jwt,
    luckyResults,
    pwaHeight,
    quickSearchCommunities,
    searchDropdownHovering,
    searchIsFocused,
    searchPage,
    searchText,
    setCommunitiesPage,
    setCommunityInput,
    setSearchPage,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [followedPage, setFollowedPage] = useState(1);
  const [communitiesAllOrFollowed, setCommunitiesAllOrFollowed] =
    useState("All");
  const [selectedViewOnlyInstance, setSelectedViewOnlyInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [focusedKeyboard, setFocusedKeyboard] = useState(false);
  //determine if page is focused
  const isFocused = useIsFocused();

  //ref to scroll flatlist to top
  const flatListRef = useRef(null);

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

  //scroll to top button
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: 0,
    });
  };

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //refresh communities data
  useEffect(() => {
    fetchCommunitiesPage(communitiesPage);
    setCommunityInput("");
  }, [jwt, listing, isFocused]);

  //run quick communities on type
  useEffect(() => {
    setSearchPage(1);
    communityInput.trim() && fetchSearchCommunities(communityInput, 1);
  }, [communityInput]);

  //Initial community load
  useEffect(() => {
    setLoading(true);
    fetchFollowedCommunities();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  //switch to followed
  useEffect(() => {
    scrollToTop();
    !followedCommunities?.length > 0 && fetchFollowedCommunities();
  }, [communitiesAllOrFollowed]);

  //scroll to top of list
  useEffect(() => {
    scrollToTop();
  }, [communityInputWithInstance, searchPage, communitiesPage]);

  const searchFooter = () => {
    return (
      <View //search pagination
        style={{
          width: "100%",
          height: 40,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingHorizontal: 20,
          marginVertical: 10,
        }}
      >
        {searchPage > 1 && (
          <NextLastButton
            type={"last"}
            action={() => (
              !communityInputWithInstance &&
                fetchSearchCommunities(communityInput, searchPage - 1),
              setSearchPage(searchPage - 1)
            )}
          />
        )}
        {quickSearchCommunities?.length > 0 &&
          quickSearchCommunities?.length == 5 && (
            <NextLastButton
              type={"next"}
              action={() => (
                !communityInputWithInstance &&
                  fetchSearchCommunities(communityInput, searchPage + 1),
                setSearchPage(searchPage + 1)
              )}
            />
          )}
      </View>
    );
  };

  const footer = () => {
    return (
      <View //"All" pagination
        style={{
          width: "100%",
          height: 40,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingHorizontal: 20,
          marginVertical: 10,
        }}
      >
        {communitiesPage > 1 && (
          <NextLastButton
            type={"last"}
            action={() => (
              fetchCommunitiesPage(communitiesPage - 1),
              setCommunitiesPage(communitiesPage - 1)
            )}
          />
        )}
        {communitiesList?.length > 0 && communitiesList?.length == 50 && (
          <NextLastButton
            type={"next"}
            action={() => (
              fetchCommunitiesPage(communitiesPage + 1),
              setCommunitiesPage(communitiesPage + 1)
            )}
          />
        )}
      </View>
    );
  };

  const followedFooter = () => {
    return (
      <View //"Followed" pagination
        style={{
          width: "100%",
          height: 40,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {followedPage > 1 && (
          <NextLastButton
            type={"last"}
            action={() => (
              fetchFollowedCommunities(followedPage - 1),
              setFollowedPage(followedPage - 1)
            )}
          />
        )}
        {followedCommunities?.length > 0 &&
          followedCommunities?.length == 50 && (
            <NextLastButton
              type={"next"}
              action={() => (
                fetchFollowedCommunities(followedPage + 1),
                setFollowedPage(followedPage + 1)
              )}
            />
          )}
      </View>
    );
  };

  //find the relevant community based on the Instance Filter
  //communities Component for flatlist
  const RenderCommunityComponent = ({ item }) => {
    const [communityHovered, setCommunityHovered] = useState(false);
    const [followHovered, setFollowHovered] = useState(false);

    return (
      <Pressable
        onHoverIn={() => setCommunityHovered(true)}
        onHoverOut={() => setCommunityHovered(false)}
        activeOpacity={0.7}
        onPress={() => pressCommunity(item)}
        style={{
          height: 65,
          borderBottomWidth: 1,
          borderColor: colors.greyShade2,
          paddingVertical: 2,
        }}
      >
        <View
          style={{
            transitionDuration: "150ms",
            height: 60,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: communityHovered
              ? colors.greyShade1
              : colors.white,
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
                style={{
                  opacity: communityInputWithInstance ? 0.5 : 1,
                  width: 40,
                  height: 40,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
                placeholder={{ uri: item.community.icon }}
              />
            ) : (
              <IconUsers size={25} stroke={2.0} color={colors.grey} />
            )}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.communitiesPageList,
                  { opacity: communityInputWithInstance ? 0.5 : 1 },
                ]}
              >
                {item.community.title}
              </Text>

              {item.community.nsfw && <Text style={styles.nsfwText}>NSFW</Text>}
            </View>
            <View
              style={{
                right: 0,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
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
                    fontSize: 12 + fontSize * 0.5,
                  },
                ]}
              >
                {formatNumber(item.counts.subscribers)}
              </Text>
              <View style={{ marginLeft: 10, width: 13, height: 13 }}>
                <IconServer size={13} stroke={2.0} color={colors.greyShade3} />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 12 + fontSize * 0.5,
                  },
                ]}
              >
                {extractWebsiteName(item.community.actor_id)}
              </Text>
            </View>
          </View>
          {jwt != null && !communityInputWithInstance && (
            <Pressable
              onHoverIn={() => (
                setFollowHovered(true), setCommunityHovered(true)
              )}
              onHoverOut={() => setFollowHovered(false)}
              style={{
                height: "50%",
                width: item.subscribed == "NotSubscribed" ? 60 : 70,
                backgroundColor:
                  item.subscribed == "NotSubscribed"
                    ? followHovered
                      ? colors.blueShade1
                      : colors.blueShade2
                    : item.subscribed == "Pending"
                    ? "transparent"
                    : followHovered
                    ? colors.lightGreyShade4
                    : colors.greyShade2,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => followCommunityPageFunction(item)}
            >
              {followPressedId == item.community.id ? (
                <ActivityIndicator
                  color={item.subscribed == "Subscribed" ? "black" : "white"}
                />
              ) : item.subscribed == "NotSubscribed" ? (
                <Text
                  style={[styles.buttonText, { color: "white", fontSize: 13 }]}
                >
                  Follow
                </Text>
              ) : item.subscribed == "Pending" ? (
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.greyShade5, fontSize: 13 },
                  ]}
                >
                  Pending
                </Text>
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.greyShade5, fontSize: 13 },
                  ]}
                >
                  Unfollow
                </Text>
              )}
            </Pressable>
          )}
          {!communityInputWithInstance && (
            <IconChevronRight
              size={16}
              stroke={2.0}
              color={colors.greyShade3}
              style={{ paddingRight: 10 }}
            />
          )}
        </View>
      </Pressable>
    );
  };
  //render Communities item for flatlist
  const renderCommunity = ({ item }) => (
    <RenderCommunityComponent item={item} />
  );

  //header component
  const HeaderComponent = () => (
    <View>
      <PageTitle text={"Communities"} />

      <SearchCommunitiesPage
        setFocusedKeyboard={setFocusedKeyboard}
        setCommunityInput={setCommunityInput}
        communityInput={communityInput}
        setSelectedViewOnlyInstance={setSelectedViewOnlyInstance}
      />

      {!communityInput.trim() && !communityInputWithInstance.trim() && (
        <SmallSpace />
      )}

      {jwt != null &&
        !communityInput.trim() &&
        !communityInputWithInstance.trim() && (
          <View //All & Followed
            style={{
              flexDirection: width > 300 && "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <SimpleFilterButton
              viewOptions={communitiesAllOrFollowed}
              setViewOptions={setCommunitiesAllOrFollowed}
              selectedOption={"All"}
            />
            <SimpleFilterButton
              viewOptions={communitiesAllOrFollowed}
              setViewOptions={setCommunitiesAllOrFollowed}
              selectedOption={"Followed"}
            />
          </View>
        )}

      <SmallSpace />
    </View>
  );

  if (communitiesPageLoading || loading) {
    return (
      <View
        scrollEnabled={false}
        style={{
          overflow: "hidden",
          height: isPWA ? height - pwaHeight : height,
          width: "100%",
          backgroundColor: colors.white,
        }}
      >
        <HeaderSection />
        <View style={styles.centeredRow}>
          <BlankBarSection />
          <LeftBarList />
          <View
            scrollEnabled={false}
            style={{
              overflow: "hidden",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
            }}
          >
            <CommunityPlaceholders />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          height: isPWA ? height - pwaHeight : height,
          width,
          backgroundColor: colors.white,
        }}
      >
        <HeaderSection />
        {(searchText?.trim().length > 0 || luckyResults?.length > 4) &&
          (searchIsFocused || searchDropdownHovering) &&
          width > 1000 && <SearchDropdownSection />}
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <BlankBarSection />
          <LeftBarList active={"Communities"} />

          <View
            style={{
              backgroundColor: colors.white,
              flex: 1,
            }}
          >
            {!communitiesList?.length > 0 ? (
              <View
                style={{
                  height: "100%",
                  width:
                    width <= 1000
                      ? centerPanelWidthNonDesktop
                      : centerPanelWidthMedium,
                  borderRadius: 10,
                  padding: 5,
                  //backgroundColor: colors.lightGreyShade2,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  gap: 5,
                }}
              >
                <IconAlertTriangle
                  size={22}
                  stroke={2.0}
                  color={colors.greyShade3}
                  style={{ paddingHorizontal: 5 }}
                />
                <Text
                  style={{
                    color: colors.greyShade3,
                    fontSize: 16 + fontSize,
                    fontFamily: chosenFont_ExtraBold,
                  }}
                >
                  NO COMMUNITY RESULTS
                </Text>
              </View>
            ) : communityInput.trim() || communityInputWithInstance.trim() ? (
              quickSearchCommunities?.length == 0 ? (
                <View
                  style={{
                    height: isPWA ? height - pwaHeight : height,
                    padding: 5,
                    paddingHorizontal: 35,
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                    backgroundColor: colors.white,
                  }}
                >
                  <HeaderComponent />
                  <Animatable.View
                    animation={"fadeIn"}
                    delay={1000}
                    style={{
                      height: 250,
                      width: "100%",
                      borderRadius: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 5,
                      gap: 5,
                    }}
                  >
                    <IconAlertTriangle
                      size={22}
                      stroke={2.0}
                      color={colors.greyShade3}
                      style={{ paddingHorizontal: 5 }}
                    />
                    <Text
                      style={{
                        color: colors.greyShade3,
                        fontSize: 16 + fontSize,
                        fontFamily: chosenFont_ExtraBold,
                      }}
                    >
                      NO RESULTS
                    </Text>
                  </Animatable.View>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={showScrollBars}
                  ListHeaderComponent={<HeaderComponent />}
                  ref={flatListRef}
                  ListFooterComponent={searchFooter}
                  contentContainerStyle={{
                    flex: 1,
                    paddingHorizontal: 30,
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                  }}
                  style={styles.smallPadding}
                  data={quickSearchCommunities}
                  renderItem={renderCommunity}
                  keyExtractor={(item) => item.community?.id.toString()}
                />
              )
            ) : communitiesAllOrFollowed == "All" ? (
              <FlatList
                showsVerticalScrollIndicator={showScrollBars}
                contentContainerStyle={{
                  flex: 1,
                  paddingHorizontal: 30,
                  width:
                    width <= 1000
                      ? centerPanelWidthNonDesktop
                      : centerPanelWidthMedium,
                }}
                ListHeaderComponent={<HeaderComponent />}
                ref={flatListRef}
                style={styles.smallPadding}
                ListFooterComponent={footer}
                data={communitiesList}
                renderItem={renderCommunity}
                keyExtractor={(item) => item.community?.id}
                extraData={[communitiesList]}
              />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={showScrollBars}
                contentContainerStyle={{
                  flex: 1,
                  paddingHorizontal: 30,
                  width:
                    width <= 1000
                      ? centerPanelWidthNonDesktop
                      : centerPanelWidthMedium,
                }}
                ListHeaderComponent={<HeaderComponent />}
                ref={flatListRef}
                style={styles.smallPadding}
                ListFooterComponent={followedFooter}
                data={followedCommunities}
                renderItem={renderCommunity}
                keyExtractor={(item) => item.community?.id}
                extraData={communitiesList}
              />
            )}
            <SmallSpace />
          </View>
        </View>
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    listing: state.updateItem.reduxGlobal.listing,
    fontSize: state.updateItem.reduxGlobal.fontSize,
    instance: state.updateItem.reduxGlobal.instance,
  };
};

// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(CommunitiesPage);

export default withColorScheme(ConnectedComponent);

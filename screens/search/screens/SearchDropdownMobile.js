import React, { useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import ItemSeparator from "../../../items/components/ItemSeparator";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { extractWebsiteName, isImageUrl } from "../../../actions";
import { Octicons } from "@expo/vector-icons";

const SearchDropdownMobile = ({ colors, styles, instance, showScrollBars }) => {
  const {
    confirmedNsfw,
    headerHeight,
    height,
    isPWA,
    loadingSearch,
    pwaHeight,
    randomTop5,
    search,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    setSearchDropdownHovering,
    setSearchIsFocused,
    setSearchText,
    setShowSearch,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [xButtonHovered, setXButtonHovered] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [dropdownCommunities, setDropdownCommunities] = useState(false);

  // Listen to navigation events to update the state
  useFocusEffect(
    React.useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation])
  );

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

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.push("Quiblr");
    }
  };
  //ref for scrollview
  const scrollViewRef = useRef();

  //ensure scroll is top of page
  useEffect(() => {
    scrollViewRef && scrollViewRef.current.scrollTo({ y: 0, animated: true });
  }, [navigation]);

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //ref for the text input
  const textInputRef = useRef(null);

  //function to execute search
  const handleOnSubmitEditing = (item) => {
    // fetchSearchPosts(item.trim());
    textInputRef?.current?.blur();
    const encodedValue = encodeURIComponent(item.trim());

    navigation.push("SearchPage", {
      searchText: encodedValue,
    });
  };
  //############################################
  //              Flatlist Items              //
  //############################################
  //render top posts for flatlist
  const RenderSearchDropdown = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => (
            setSearchText(""),
            setSearchIsFocused(false),
            setSearchDropdownHovering(false),
            setShowSearch(false),
            item?.post?.nsfw && !confirmedNsfw
              ? navigateNSFWPost(item)
              : navigateComments(item)
          )}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
            padding: 5,
            marginVertical: 3,
            borderRadius: 10,
            //   paddingLeft: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                //   paddingLeft: "10%",
                width: item?.post?.thumbnail_url
                  ? width < 700
                    ? "70%"
                    : "85%"
                  : width,
                gap: 5,
                paddingRight: 5,
                justifyContent: "center",
              }}
            >
              <Text style={styles.trendingTodayTitle}>{item.post.name}</Text>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                {item.community.icon ? (
                  <Image
                    source={{ uri: item.community.icon }}
                    placeholder={{ uri: item.community.icon }}
                    style={[
                      styles.communityIcon,
                      {
                        backgroundColor: colors.greyShade1,
                        width: 20,
                        height: 20,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.greyShade1,
                      borderRadius: 100,
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}
                  >
                    <Octicons
                      size={15}
                      name={"people"}
                      color={colors.greyShade3}
                    />
                  </View>
                )}
                <Text style={styles.trendingTodayCommunity}>
                  {item.community.title}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: width < 700 ? "30%" : "15%",
                justifyContent: "center",
              }}
            >
              {isImageUrl(item.post.thumbnail_url) && (
                <Image
                  resizeMode="cover"
                  source={{
                    uri: item.post.thumbnail_url,
                  }}
                  placeholder={{
                    uri: item.post.thumbnail_url,
                  }}
                  style={[
                    styles.largeImageThumbnail,
                    {
                      //borderRadius: width < 400 ? 20 : 0
                      borderRadius: 10,
                      marginVertical: 0,
                      marginBottom: 0,
                    },
                  ]}
                />
              )}
              {!isImageUrl(item.post.thumbnail_url) &&
                isImageUrl(item.post.url) && (
                  <Image
                    source={{
                      uri: item.post.url,
                    }}
                    placeholder={{
                      uri: item.post.url,
                    }}
                    resizeMode="cover"
                    style={[
                      styles.largeImageThumbnail,
                      {
                        //borderRadius: width < 400 ? 20 : 0
                        borderRadius: 10,
                        marginVertical: 0,
                        marginBottom: 0,
                      },
                    ]}
                  />
                )}
              {!isImageUrl(item.post.thumbnail_url) &&
                !isImageUrl(item.post.url) && (
                  <View
                    style={{
                      minHeight: 75,
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.greyShade1,
                    }}
                  >
                    <Octicons
                      size={20}
                      name={"image"}
                      color={colors.greyShade3}
                    />
                  </View>
                )}
            </View>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const searchItem = ({ item }) => <RenderSearchDropdown item={item} />;

  //render top posts for flatlist
  const RenderSearchCommunityDropdown = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => pressCommunity(item)}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
            padding: 5,
            marginVertical: 3,
            paddingLeft: 10,
            borderRadius: 10,
            width: "100%",
            gap: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              gap: 3,
              flexDirection: "row",
              paddingRight: 5,
              alignItems: "center",
            }}
          >
            {item.community.nsfw && (
              <View //nsfw
                style={[
                  styles.nsfwContainer,
                  { marginLeft: 0, marginTop: 0, marginBottom: 0 },
                ]}
              >
                <Text style={styles.nsfwText}>NSFW</Text>
              </View>
            )}
            {item.community.icon ? (
              <Image
                source={{ uri: item.community.icon }}
                placeholder={{ uri: item.community.icon }}
                style={[
                  styles.communityIcon,
                  {
                    backgroundColor: colors.greyShade1,
                    width: 30,
                    height: 30,
                  },
                ]}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.greyShade1,
                  borderRadius: 100,
                  width: 30,
                  height: 30,
                  marginRight: 5,
                }}
              >
                <Octicons size={18} name={"people"} color={colors.greyShade3} />
              </View>
            )}
            {item.community.title ? (
              <Text style={styles.trendingTodayTitle}>
                {item.community.title}
              </Text>
            ) : (
              <Text style={styles.trendingTodayTitle}>
                {item.community.name}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.trendingTodayCommunity}>
              ({extractWebsiteName(item.community.actor_id)})
            </Text>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const searchCommunityItem = ({ item }) => (
    <RenderSearchCommunityDropdown item={item} />
  );

  //no recommended search
  const NoRecommendedSearch = () => {
    const [hovered, setHovered] = useState(false);

    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => (
            handleOnSubmitEditing(searchText),
            setSearchText(""),
            setSearchIsFocused(false),
            setSearchDropdownHovering(false)
          )}
          style={{
            flexDirection: "row",
            padding: 5,
            gap: 5,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
          }}
        >
          <Octicons
            size={23}
            name={"search"}
            color={colors.greyShade3}
            style={{ opacity: 0.7 }}
          />

          <Text style={styles.smallSectionTitles}>
            Search For: {searchText}
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  //############################################
  //           Define API Functions           //
  //############################################

  //get searched posts from api
  const fetchSearchCommunities = async (item) => {
    try {
      const fetchedSearch = await search({
        type_: "Communities",
        sort: "TopAll",
        page: 1,
        listing_type: "All",
        q: item,
        limit: 5,
      });
      setDropdownCommunities(fetchedSearch.communities);
    } catch (e) {}
  };

  //run search communities as the input changes
  useEffect(() => {
    searchText?.trim().length > 0 && fetchSearchCommunities(searchText);
  }, [searchText]);
  return (
    <View style={{ backgroundColor: colors.white }}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        style={{
          width: width,
          backgroundColor: colors.white,
          padding: 10,
          paddingTop: 0,
          paddingBottom: height / 1.5,
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              paddingTop: isPWA ? 10 + pwaHeight : 10,
              alignItems: "center",
              backgroundColor: colors.white,
              width: "100%",
              gap: 10,
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <Octicons
                size={18}
                name={"chevron-left"}
                color={colors.greyShade4}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>

            <View //search
              style={{
                flexDirection: "row",
                width: "85%",
                maxWidth: 300,
                alignItems: "center",
                gap: 5,
                paddingLeft: 5,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                borderRadius: 10,
                backgroundColor: searchIsFocused
                  ? colors.white
                  : colors.greyShade1,
              }}
            >
              {loadingSearch && <ActivityIndicator color={colors.blueShade2} />}
              <View style={{ flex: 1 }}>
                <TextInput //Search
                  ref={textInputRef}
                  onFocus={() => setSearchIsFocused(true)}
                  onBlur={() =>
                    !searchDropdownHovering && setSearchIsFocused(false)
                  }
                  style={[
                    styles.mainPage_TextInputContainer,
                    {
                      //width: width < 800 ? 200 : width > 1000 ? 400 : 200,
                      height: headerHeight * 0.7,
                      width: "100%",
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                      backgroundColor: "tranparent",
                      paddingRight: 45,
                    },
                  ]}
                  color={colors.black}
                  autoComplete={"off"}
                  autoCapitalize={"none"}
                  placeholder="Search..."
                  placeholderTextColor={colors.greyShade4}
                  selectionColor={colors.blueShade2}
                  onChangeText={setSearchText}
                  value={searchText}
                  onKeyPress={(e) =>
                    e.key == "Enter" &&
                    searchText.trim() != "" &&
                    handleOnSubmitEditing(searchText)
                  }
                />
              </View>
              {searchText && (
                <Pressable
                  onHoverIn={() => setXButtonHovered(true)}
                  onHoverOut={() => setXButtonHovered(false)}
                  onPress={() => (setSearchText(""), setShowSearch(false))}
                  style={[
                    styles.xButtonContainer,
                    {
                      marginLeft: -45,
                      backgroundColor: xButtonHovered && colors.greyShade1,
                      borderWidth: 2,
                      width: 30,
                      height: 30,
                      borderColor: xButtonHovered
                        ? colors.greyShade2
                        : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.xButtonText, { fontSize: 20 }]}>X</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
        {searchText?.trim().length > 0 ? (
          dropdownCommunities?.length == 0 ? (
            <NoRecommendedSearch />
          ) : (
            <View //Top Communities
              style={{
                flexDirection: "row",
                padding: 5,
                gap: 5,
                alignItems: "center",
              }}
            >
              <Octicons
                size={23}
                name={"people"}
                color={colors.greyShade3}
                style={{ opacity: 0.7 }}
              />

              <Text style={styles.smallSectionTitles}>TOP COMMUNITIES</Text>
            </View>
          )
        ) : (
          <View //Trending Posts
            style={{
              flexDirection: "row",
              padding: 5,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Octicons
              size={23}
              name={"graph"}
              color={colors.greyShade3}
              style={{ opacity: 0.7 }}
            />

            <Text style={styles.smallSectionTitles}>TRENDING TODAY</Text>
          </View>
        )}
        {searchText?.trim().length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={showScrollBars}
            ItemSeparatorComponent={ItemSeparator}
            scrollEnabled={true}
            data={dropdownCommunities}
            renderItem={searchCommunityItem}
            keyExtractor={(item) => item.community?.id.toString()}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={showScrollBars}
            ItemSeparatorComponent={ItemSeparator}
            data={randomTop5}
            renderItem={searchItem}
            keyExtractor={(item) => item.post?.id.toString()}
          />
        )}
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    listing: state.updateItem.reduxGlobal.listing,
    instance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SearchDropdownMobile);

export default withColorScheme(ConnectedComponent);

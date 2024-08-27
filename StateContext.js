import React, {
  useRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Modal,
  Text,
  useColorScheme,
  Pressable,
  ScrollView,
} from "react-native";
import useLemmyApi from "./hooks/useLemmyApi";
import { useFont } from "./FontContext";
import * as Clipboard from "expo-clipboard";
import BlankItemSeparator from "./items/components/BlankItemSeparator";
import ItemSeparator from "./items/components/ItemSeparator";
import { connect, useDispatch, useSelector } from "react-redux";
import { updateItem } from "./redux/actions";
import NetInfo from "@react-native-community/netinfo";
import RenderCard from "./items/posts/RenderCard";
import MenuOptionComponent from "./components/MenuOptionComponent";
import CommunityInfoHeader from "./screens/communities/components/CommunityInfoHeader";
import WritePostSection from "./screens/writePost/components/WritePostSection";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import withColorScheme from "./styles/Formatting";
import ProfileInfoPage from "./screens/user/screens/ProfileInfoPage";

import {
  LoadingPlaceholderCard,
  LoadingPlaceholderCommunity,
  LoadingPlaceholderComments,
  LoadingPlaceholderWithHeader,
} from "./constants";

import {
  IconActivity,
  IconAlertTriangle,
  IconAlignBoxLeftMiddle,
  IconAnalyze,
  IconArrowBigDown,
  IconArrowBigUp,
  IconArrowNarrowUp,
  IconArrowsMoveVertical,
  IconArrowsUpDown,
  IconBell,
  IconBold,
  IconBolt,
  IconBook,
  IconBookmark,
  IconBookmarkOff,
  IconBookmarkPlus,
  IconBoxMultiple2,
  IconBlur,
  IconCalendarClock,
  IconCalendarEvent,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClipboard,
  IconClover,
  IconCode,
  IconCoffee,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconHandStop,
  IconHeading,
  IconHeart,
  IconHelp,
  IconFilterEdit,
  IconFlame,
  IconHome,
  IconInfoCircle,
  IconInfoSquareRounded,
  IconItalic,
  IconLanguage,
  IconLayoutBoard,
  IconLayoutBottombar,
  IconLayoutRows,
  IconLayoutSidebarRightCollapse,
  IconLink,
  IconList,
  IconListDetails,
  IconLogout,
  IconMapPin,
  IconMenu2,
  IconMessageCircle,
  IconMessageCirclePlus,
  IconMessageDots,
  IconMessages,
  IconMoon,
  IconPalette,
  IconPhoto,
  IconArrowsMaximize,
  IconPictureInPicture,
  IconPlanet,
  IconPlayerPlay,
  IconQuote,
  IconRefresh,
  IconScale,
  IconSearch,
  IconSend,
  IconServer,
  IconSettings,
  IconShadow,
  IconShare,
  IconSparkles,
  IconSquareForbid2,
  IconStack2,
  IconStar,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconTextSize,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
  IconTypography,
  IconTrendingUp,
  IconTrendingUp3,
  IconTriangle,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconVolume,
} from "./assets/icons.js";
import { eld } from "eld";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import PageTitle from "./components/PageTitle";

// Create a context
const StateContext = createContext();

export { StateContext };

//set color scheme to device default

export function StateProviderUnconnected({
  children,
  styles,
  colors,
  showNSFWSettings,
  sort,
  listing,
  instance,
  removeDuplicatePosts,
}) {
  //const { navigate } = useNavigationContext();
  const {
    chosenFont_SuperBold,
    chosenFont_ExtraBold,
    chosenFont_Bold,
    chosenFont_Regular,
    chosenFont_Thin,
  } = useFont();
  const {
    client,
    createComment,
    createPost,
    deleteComment,
    deleteImage,
    deletePost,
    editComment,
    editPost,
    followCommunity,
    getComment,
    getComments,
    getSingleCommentThread,
    getCommunity,
    getFederatedInstances,
    getOtherUserDetails,
    getPersonDetails,
    getPersonMentions,
    getPost,
    getPosts,
    getReplies,
    instanceDetail,
    jwt,
    likeComment,
    likePost,
    listCommunities,
    localUser,
    login,
    logout,
    passwordReset,
    signedInUserInfo,
    setSignedInUserInfo,
    saveUserSettings,
    savePost,
    search,
    uploadImage,
    getSite,
    markCommentReplyAsRead,
    markAllAsRead,
    changeInstance,
  } = useLemmyApi();
  const [isConnected, setIsConnected] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [community, setCommunity] = useState("");
  const [confirmedNsfw, setConfirmedNsfw] = useState(false);
  const [didFirstLoad, setDidFirstLoad] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [noSearchPostResults, setNoSearchPostResults] = useState(false);
  const [noCommunityPostResults, setNoCommunityPostResults] = useState(false);
  const [noSearchCommunityResults, setNoSearchCommunityResults] =
    useState(false);
  const [noSearchUserResults, setNoSearchUserResults] = useState(false);
  const [noSearchCommentResults, setNoSearchCommentResults] = useState(false);

  const [postDetail, setPostDetail] = useState("");
  const [savedPosts, setSavedPosts] = useState([]); //ids of saved posts
  const [savedPostItems, setSavedPostItems] = useState([]); //saved post items for flatlist
  const [pressedShare, setPressedShare] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchNavigation, setSearchNavigation] = useState("Posts");
  const [staticSearchValue, setStaticSearchValue] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [postUpVotes, setPostUpVotes] = useState([]);
  const [postDownVotes, setPostDownVotes] = useState([]);
  const [writePost, setWritePost] = useState(false);
  const [loadingFollowCommunity, setLoadingFollowCommunity] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [luckyResults, setLuckyResults] = useState([]);
  const [randomTop5, setRandomTop5] = useState([]);
  const [searchIsFocused, setSearchIsFocused] = useState(false);
  const [onlyShowThreads, setOnlyShowThreads] = useState(false);
  const [communitiesPageLoading, setCommunitiesPageLoading] = useState(true);
  const [communitiesList, setCommunitiesList] = useState([]);
  const [followPressedId, setFollowPressedId] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);
  const [communitiesPage, setCommunitiesPage] = useState(1);
  const [commentPageAttempt, setCommentPageAttempt] = useState(0);
  const [quickSearchCommunities, setQuickSearchCommunities] = useState("");
  const [communityInput, setCommunityInput] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [followedCommunities, setFollowedCommunities] = useState([]);
  const [replies, setReplies] = useState([]);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [comments, setComments] = useState(null);
  const [viewedViaFeelingLucky, setViewedViaFeelingLucky] = useState(false);
  const [noFrontPagePostResults, setNoFrontPagePostResults] = useState(false);
  const [showLearnMoreRemoveDuplicates, setShowLearnMoreRemoveDuplicates] = useState(false);
  //############################################
  //            Show/Hide Content             //
  //############################################
  const [showAbout, setShowAbout] = useState(false);
  const [showingResults, setShowingResults] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showPostActivity, setShowPostActivity] = useState(false);
  const [showLuckyTooltip, setShowLuckyTooltip] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  //############################################
  //                 Content                  //
  //############################################
  const [posts, setPosts] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [post, setPost] = useState("");
  const [searchPosts, setSearchPosts] = useState([]);
  const [noSavedPostResults, setNoSavedPostResults] = useState(false);

  //############################################
  //                  Pages                   //
  //############################################
  const [page, setPage] = useState(1);
  const [communityViewPage, setCommunityViewPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [pageSearchCommunity, setPageSearchCommunity] = useState(1);
  const [pageSearchUsers, setPageSearchUsers] = useState(1);
  const [pageSearchComments, setPageSearchComments] = useState(1);

  //############################################
  //                 Loading                  //
  //############################################
  const [loading, setLoading] = useState(false);
  const [loadingLucky, setLoadingLucky] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [commentPageLoading, setCommentPageLoading] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMoreCommunityPosts, setLoadingMoreCommunityPosts] =
    useState(false);
  const [loadingMoreSearch, setLoadingMoreSearch] = useState(false);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(false);
  const [loadingMoreSavedPosts, setLoadingMoreSavedPosts] = useState(false);
  const [loadingMainPosts, setLoadingMainPosts] = useState(false);
  const [loadingCommunityPosts, setLoadingCommunityPosts] = useState(false);
  //############################################
  //               Search States              //
  //############################################
  const [communityInputWithInstance, setCommunityInputWithInstance] =
    useState("");
  const [searchCommunities, setSearchCommunities] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchComments, setSearchComments] = useState([]);
  const [searchDropdownHovering, setSearchDropdownHovering] = useState(false);

  //############################################
  //            Loading Placeholder           //
  //############################################
  const PostPlaceholders = ({}) => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          paddingTop: 10,
        }}
      >
        <LoadingPlaceholderCard
          styles={styles}
          colors={colors}
          width={width}
          centerPanelPadding={centerPanelPadding}
        />
      </View>
    );
  };

  const CommentsPlaceholders = () => {
    return (
      <LoadingPlaceholderComments
        styles={styles}
        colors={colors}
        width={width}
        centerPanelPadding={centerPanelPadding}
        centerPanelWidthNonDesktop={centerPanelWidthNonDesktop}
        centerPanelWidthMedium={centerPanelWidthMedium}
        rightBarWidth={rightBarWidth}
      />
    );
  };

  const CommunityPlaceholders = () => {
    return (
      <LoadingPlaceholderCommunity
        styles={styles}
        colors={colors}
        width={width}
        centerPanelPadding={centerPanelPadding}
        IconChevronRight={IconChevronRight}
      />
    );
  };

  const PageWithHeaderPlaceholders = () => {
    return (
      <LoadingPlaceholderWithHeader
        styles={styles}
        colors={colors}
        width={width}
        centerPanelPadding={centerPanelPadding}
        centerPanelWidthNonDesktop={centerPanelWidthNonDesktop}
        centerPanelWidthMedium={centerPanelWidthMedium}
      />
    );
  };

  //############################################
  //                  On Start                //
  //############################################

  //Use this to adjust redux on start if needed
  useEffect(() => {
    dispatch(updateItem("dynamicImageSize", false));
  }, []);

  //update the signed in user info whenever jwt changes
  useEffect(() => {
    currentUserInfo != signedInUserInfo && setCurrentUserInfo(signedInUserInfo);
  }, [jwt]);

  //Initial post load
  useEffect(() => {
    fetchCommunities();
    topTwentyFive(); //api call for top 25 posts of the day

    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

    setTimeout(() => {
      setDidFirstLoad(true);
    }, 700);
  }, [instance]);

  //############################################
  //           Set Dimensions & Style         //
  //############################################
  //set dimensions
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);

  //scroll to top position
  const scrollToTopPostion = 65;
  useEffect(() => {
    const onChange = ({ window }) => {
      setWidth(window.width);
      setHeight(window.height);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    // Clean up the event listener
    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

  //Overlay dimensions
  const overlayWidth = width < 625 ? width : width < 900 ? 650 : 850;
  const overlayHeight = width < 625 ? height : height < 725 ? height : 650;
  const overlayRadius = width < 625 || height < 725 ? 0 : 20;

  //left/right bar style
  const blankBarWidth = width >= 1500 ? 0.09 : 0;
  const leftBarWidth = 0.18 - blankBarWidth * 0.5;
  const rightBarWidth = 0.25 - blankBarWidth;

  //center width
  const centerPanelWidthNonDesktop =
    width * (0.54 + 0.25 + 0.03 + leftBarWidth);
  const centerPanelWidthMedium = width * 0.51;
  const centerPanelWidthFull =
    width > 1000
      ? width -
        leftBarWidth * width -
        blankBarWidth * width -
        blankBarWidth * width
      : width - blankBarWidth * width - blankBarWidth * width;

  //center padding
  const centerPanelPadding =
    width > 1600
      ? width * (0.05 + blankBarWidth / 6)
      : width > 1400
      ? width * (0.005 + blankBarWidth / 6)
      : width * (0.015 + blankBarWidth / 6);

  //header style
  const headerHeight = width < 400 ? 60 : 70;

  //PWA
  const pwaHeight = 50;

  //############################################
  //                  REDUX                   //
  //############################################
  //Define dispatch for redux
  const dispatch = useDispatch();
  //Get redux data
  const global = useSelector((state) => state.reduxGlobal.reduxGlobal);
  //############################################
  //                 Network                  //
  //############################################
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      // Poor internet connectivity alert
      alert(
        "No Internet Connection",
        "Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    }
  }, [isConnected]);
  //############################################
  //                  Popups                  //
  //############################################
  //pop up menu
  const PopupMenu = ({ trigger, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const triggerRef = useRef(null);

    const onTriggerPress = () => {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({ x: px, y: py + height });
        setIsVisible(true);
      });
    };

    return (
      <View style={styles.fullWidth}>
        <TouchableOpacity ref={triggerRef} onPress={onTriggerPress}>
          {trigger}
        </TouchableOpacity>

        {isVisible && (
          <Modal transparent={true} onRequestClose={() => setIsVisible(false)}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setIsVisible(false)}
            >
              <View
                style={{
                  width: 170,
                  position: "absolute",
                  backgroundColor: colors.menu,
                  padding: 5,
                  borderRadius: 10,
                  shadowColor: "black",
                  shadowOpacity: 0.15,
                  shadowRadius: 30,
                  borderRadius: 10,
                  shadowOffset: {
                    height: 7,
                    width: 0,
                  },
                  top: position.y - 5,
                  left: position.x - 160,
                }}
              >
                {children}
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  };

  //############################################
  //            Items for Flatlists           //
  //############################################

  //filters for posts
  const PostFilters = ({}) => {
    const [hoveredSort, setHoveredSort] = useState(false);
    const [hoveredTopSort, setHoveredTopSort] = useState(false);
    const [hoveredListing, setHoveredListing] = useState(false);
    const [hoveredFormat, setHoveredFormat] = useState(false);

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          paddingHorizontal: 0,
        }}
      >
        <View />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onHoverIn={() => setHoveredSort(true)}
            onHoverOut={() => setHoveredSort(false)}
          >
            <Menu //sort
              style={[
                styles.commentSortMenu,
                {
                  borderWidth: 2,
                  borderColor: hoveredSort ? colors.greyShade2 : "transparent",
                  backgroundColor: hoveredSort
                    ? colors.greyShade1
                    : "transparent",
                  marginRight:
                    sort == "TopDay" ||
                    sort == "TopWeek" ||
                    sort == "TopMonth" ||
                    sort == "TopYear" ||
                    sort == "TopAll"
                      ? 5
                      : 5,
                },
              ]}
            >
              <MenuTrigger
                style={{
                  height: 30,
                  paddingHorizontal: 5,
                  borderRadius: 100,
                  justifyContent: "center",
                }}
              >
                {sort == "TopDay" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Top</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "TopWeek" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Top</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "TopMonth" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Top</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "TopYear" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Top</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "TopAll" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Top</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "Hot" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Hot</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "Active" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Active</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "New" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>New</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "Old" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Old</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "Scaled" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Scaled</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "Controversial" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>
                      Controversial
                    </Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "MostComments" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>
                      Most Comments
                    </Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : sort == "NewComments" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>
                      New Comments
                    </Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortText}>Sort: </Text>
                    <IconFilterEdit
                      size={15}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                )}
              </MenuTrigger>

              <MenuOptions
                style={styles.smallPadding}
                customStyles={styles.menuOptions}
              >
                <MenuOptionComponent //top
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"TopDay"}
                  showAlertCriteria={false}
                  title={"Top"}
                  includeIcon={true}
                  Icon={
                    <Octicons name="zap" size={18} color={colors.greyShade4} />
                  }
                />
                <MenuOptionComponent //active
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"Active"}
                  showAlertCriteria={false}
                  title={"Active"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      size={18}
                      name={"graph"}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //hot
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"Hot"}
                  showAlertCriteria={false}
                  title={"Hot"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      size={18}
                      name={"flame"}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //new
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"New"}
                  showAlertCriteria={false}
                  title={"New"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      size={18}
                      name={"star"}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //old
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"Old"}
                  showAlertCriteria={false}
                  title={"Old"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      size={18}
                      name={"calendar"}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //scaled
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"Scaled"}
                  showAlertCriteria={false}
                  title={"Scaled"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      size={18}
                      name={"law"}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //controversial
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"Controversial"}
                  showAlertCriteria={false}
                  title={"Controversial"}
                  includeIcon={true}
                  Icon={
                    <IconLayoutBottombar size={18} color={colors.greyShade4} />
                  }
                />
                <View
                  style={{
                    height: 2,
                    marginVertical: 3,
                    width: "100%",
                    backgroundColor: colors.greyShade2,
                  }}
                />
                <MenuOptionComponent //most comments
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"MostComments"}
                  showAlertCriteria={false}
                  title={"Most Comments"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      name="comment-discussion"
                      size={18}
                      color={colors.greyShade4}
                    />
                  }
                />
                <MenuOptionComponent //new comments
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"sort"}
                  reduxValue={"NewComments"}
                  showAlertCriteria={false}
                  title={"New Comments"}
                  includeIcon={true}
                  Icon={
                    <FontAwesome5
                      name="comment-dots"
                      size={18}
                      color={colors.greyShade4}
                    />
                  }
                />
              </MenuOptions>
            </Menu>
          </Pressable>

          {(sort == "TopDay" ||
            sort == "TopWeek" ||
            sort == "TopMonth" ||
            sort == "TopYear" ||
            sort == "TopAll") &&
          (staticSearchValue || community) ? (
            <Pressable
              onHoverIn={() => setHoveredTopSort(true)}
              onHoverOut={() => setHoveredTopSort(false)}
            >
              <Menu //Top Sort
                style={[
                  styles.commentSortMenu,
                  {
                    //backgroundColor: colors.greyShade2,
                    marginRight: 5,
                    borderWidth: 2,
                    borderColor: hoveredTopSort
                      ? colors.greyShade2
                      : "transparent",
                    backgroundColor: hoveredTopSort
                      ? colors.greyShade1
                      : colors.white,
                  },
                ]}
              >
                <MenuTrigger
                  style={{
                    //backgroundColor: colors.lightGreyShade4,
                    height: 30,
                    paddingHorizontal: 5,
                    justifyContent: "center",
                  }}
                >
                  {sort == "TopDay" ? (
                    <View style={styles.centeredRow}>
                      <Text style={styles.commentSortSelection}>Day</Text>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  ) : sort == "TopWeek" ? (
                    <View style={styles.centeredRow}>
                      <Text style={styles.commentSortSelection}>Week</Text>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  ) : sort == "TopMonth" ? (
                    <View style={styles.centeredRow}>
                      <Text style={styles.commentSortSelection}>Month</Text>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  ) : sort == "TopYear" ? (
                    <View style={styles.centeredRow}>
                      <Text style={styles.commentSortSelection}>Year</Text>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  ) : sort == "TopAll" ? (
                    <View style={styles.centeredRow}>
                      <Text style={styles.commentSortSelection}>All</Text>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  ) : (
                    <View style={styles.centeredRow}>
                      <Octicons
                        size={13}
                        name={"chevron-down"}
                        color={colors.greyShade4}
                        style={styles.sortIcons}
                      />
                    </View>
                  )}
                </MenuTrigger>

                <MenuOptions
                  style={styles.smallPadding}
                  customStyles={styles.menuOptionsNarrow}
                >
                  <MenuOptionComponent //top day
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"sort"}
                    reduxValue={"TopDay"}
                    showAlertCriteria={false}
                    title={"Day"}
                    includeIcon={false}
                    icon={""}
                  />
                  <MenuOptionComponent //top week
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"sort"}
                    reduxValue={"TopWeek"}
                    showAlertCriteria={false}
                    title={"Week"}
                    includeIcon={false}
                    icon={""}
                  />
                  <MenuOptionComponent //top month
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"sort"}
                    reduxValue={"TopMonth"}
                    showAlertCriteria={false}
                    title={"Month"}
                    includeIcon={false}
                    icon={""}
                  />
                  <MenuOptionComponent //top year
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"sort"}
                    reduxValue={"TopYear"}
                    showAlertCriteria={false}
                    title={"Year"}
                    includeIcon={false}
                    icon={""}
                  />
                  <MenuOptionComponent //top all
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"sort"}
                    reduxValue={"TopAll"}
                    showAlertCriteria={false}
                    title={"All Time"}
                    includeIcon={false}
                    icon={""}
                  />
                </MenuOptions>
              </Menu>
            </Pressable>
          ) : (
            <View /> //not sure why but this needs to be included to make the filter work
          )}

          <Pressable
            onHoverIn={() => setHoveredListing(true)}
            onHoverOut={() => setHoveredListing(false)}
          >
            <Menu //listing
              style={[
                styles.commentSortMenu,
                {
                  marginRight: 5,
                  borderWidth: 2,
                  borderColor: hoveredListing
                    ? colors.greyShade2
                    : "transparent",
                  backgroundColor: hoveredListing
                    ? colors.greyShade1
                    : "transparent",
                },
              ]}
            >
              <MenuTrigger
                style={{
                  //backgroundColor: colors.lightGreyShade4,
                  height: 30,
                  paddingHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                {listing == "Local" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Local</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : listing == "All" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Global</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : listing == "Subscribed" ? (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortSelection}>Followed</Text>
                    <Octicons
                      size={13}
                      name={"chevron-down"}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                ) : (
                  <View style={styles.centeredRow}>
                    <Text style={styles.commentSortText}>Locality: </Text>
                    <IconFilterEdit
                      size={15}
                      color={colors.greyShade4}
                      style={styles.sortIcons}
                    />
                  </View>
                )}
              </MenuTrigger>
              <MenuOptions
                style={styles.smallPadding}
                customStyles={styles.menuOptions}
              >
                <MenuOptionComponent //local
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"listing"}
                  reduxValue={"Local"}
                  showAlertCriteria={false}
                  title={"Local"}
                  includeIcon={true}
                  Icon={<IconMapPin size={18} color={colors.greyShade4} />}
                />
                <MenuOptionComponent //global
                  onSelectLogic={false}
                  includeOnStateAction={false}
                  onSelectStateAction={console.log}
                  additionalAction={console.log}
                  includeRedux={true}
                  reduxItem={"listing"}
                  reduxValue={"All"}
                  showAlertCriteria={false}
                  title={"Global"}
                  includeIcon={true}
                  Icon={<IconPlanet size={18} color={colors.greyShade4} />}
                />

                {jwt != null && (
                  <MenuOptionComponent //subscribed
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={console.log}
                    includeRedux={true}
                    reduxItem={"listing"}
                    reduxValue={"Subscribed"}
                    showAlertCriteria={false}
                    title={"Followed"}
                    includeIcon={true}
                    Icon={
                      <Octicons
                        name="thumbsup"
                        size={18}
                        color={colors.greyShade4}
                      />
                    }
                  />
                )}
              </MenuOptions>
            </Menu>
          </Pressable>
        </View>
      </View>
    );
  };

  //render the post item for flatlist
  const renderCard = useCallback(
    ({ item }) => (
      <View
        style={{
          paddingHorizontal: centerPanelPadding,
          width:
            width <= 1000 ? centerPanelWidthNonDesktop : centerPanelWidthMedium,
        }}
      >
        <RenderCard item={item} />
      </View>
    ),
    [width]
  );

  //flatlist header community
  const RenderHeaderCommunity = ({ updateCommunity }) => {
    return (
      <View>
        <View>
          <CommunityInfoHeader updateCommunity={updateCommunity} />
        </View>
      </View>
    );
  };

  //flatlist header default
  const RenderHeaderDefault = ({}) => {
    return (
      <View>
        <View style={styles.mediumPadding}>
          <PostFilters />
          <WritePostSection />
        </View>
      </View>
    );
  };

  //flatlist header saved
  const RenderHeaderSaved = ({}) => {
    return (
      <View>
        <View style={styles.mediumPadding}>
          <PageTitle text={"Saved Posts"} />
          <PostFilters />
        </View>
      </View>
    );
  };

  //flatlist header community
  const RenderHeaderSearch = ({}) => {
    const [hoveredPosts, setHoveredPosts] = useState(false);
    const [hoveredCommunities, setHoveredCommunities] = useState(false);
    const [hoveredUsers, setHoveredUsers] = useState(false);
    const [hoveredComments, setHoveredComments] = useState(false);
    return (
      <View>
        <ScrollView
          horizontal
          style={{
            alignSelf:
              width < 1150 ? (width < 570 ? "flex-start" : "center") : "center",
            width: width < 1150 ? (width < 570 ? "100%" : null) : null,
            paddingBottom: 10,
            marginTop:
              searchNavigation == "Posts"
                ? width < 400
                  ? 15
                  : 30
                : width < 400
                ? 10
                : 25,
          }}
        >
          <Pressable //posts
            onHoverIn={() => setHoveredPosts(true)}
            onHoverOut={() => setHoveredPosts(false)}
          >
            <TouchableOpacity
              style={[
                styles.filterButtonSmall,
                {
                  marginLeft: 5,
                  borderWidth: 2,
                  borderColor:
                    searchNavigation == "Posts"
                      ? colors.blueShade2
                      : hoveredPosts
                      ? colors.greyShade2
                      : "transparent",
                  backgroundColor:
                    searchNavigation == "Posts"
                      ? colors.lightBlue
                      : hoveredPosts
                      ? colors.greyShade1
                      : "transparent",
                },
              ]}
              onPress={() => setSearchNavigation("Posts")}
            >
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      searchNavigation == "Posts"
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                Posts
              </Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable //communities
            onHoverIn={() => setHoveredCommunities(true)}
            onHoverOut={() => setHoveredCommunities(false)}
          >
            <TouchableOpacity
              style={[
                styles.filterButtonSmall,
                {
                  marginLeft: 5,
                  borderWidth: 2,
                  borderColor:
                    searchNavigation == "Communities"
                      ? colors.blueShade2
                      : hoveredCommunities
                      ? colors.greyShade2
                      : "transparent",
                  backgroundColor:
                    searchNavigation == "Communities"
                      ? colors.lightBlue
                      : hoveredCommunities
                      ? colors.greyShade1
                      : "transparent",
                },
              ]}
              onPress={() => setSearchNavigation("Communities")}
            >
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      searchNavigation == "Communities"
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                Communities
              </Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable //users
            onHoverIn={() => setHoveredUsers(true)}
            onHoverOut={() => setHoveredUsers(false)}
          >
            <TouchableOpacity
              style={[
                styles.filterButtonSmall,
                {
                  marginLeft: 5,
                  borderWidth: 2,
                  borderColor:
                    searchNavigation == "Users"
                      ? colors.blueShade2
                      : hoveredUsers
                      ? colors.greyShade2
                      : "transparent",
                  backgroundColor:
                    searchNavigation == "Users"
                      ? colors.lightBlue
                      : hoveredUsers
                      ? colors.greyShade1
                      : "transparent",
                },
              ]}
              onPress={() => setSearchNavigation("Users")}
            >
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      searchNavigation == "Users"
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                Users
              </Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable //comments
            onHoverIn={() => setHoveredComments(true)}
            onHoverOut={() => setHoveredComments(false)}
          >
            <TouchableOpacity
              style={[
                styles.filterButtonSmall,
                {
                  // width: 155,
                  marginLeft: 5,
                  borderWidth: 2,
                  borderColor:
                    searchNavigation == "Comments"
                      ? colors.blueShade2
                      : hoveredComments
                      ? colors.greyShade2
                      : "transparent",
                  backgroundColor:
                    searchNavigation == "Comments"
                      ? colors.lightBlue
                      : hoveredComments
                      ? colors.greyShade1
                      : "transparent",
                },
              ]}
              onPress={() => setSearchNavigation("Comments")}
            >
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      searchNavigation == "Comments"
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                Comments
              </Text>
            </TouchableOpacity>
          </Pressable>
        </ScrollView>

        {searchNavigation == "Posts" && <PostFilters />}
      </View>
    );
  };

  //flatlist header user
  const renderHeaderUser = () => {
    return (
      <View>
        {userDetails?.person_view?.person?.name == null ? (
          <View />
        ) : (
          <ProfileInfoPage
            chosenFont_ExtraBold={chosenFont_ExtraBold}
            chosenFont_Bold={chosenFont_Bold}
            renderCard={renderCard}
            BlankItemSeparator={BlankItemSeparator}
            ItemSeparator={ItemSeparator}
            centerPanelPadding={centerPanelPadding}
            userInfo={userDetails}
            headerHeight={headerHeight}
          />
        )}
      </View>
    );
  };

  //############################################
  //                   Design                 //
  //############################################
  //Ensure the search bar is consistent at each size
  useEffect(() => {
    staticSearchValue?.length != 0 && setShowSearch(true);
  }, [staticSearchValue]);

  //############################################
  //                Functions                 //
  //############################################

  const copyLink = async (item) => {
    try {
      await Clipboard.setStringAsync(item);
    } catch (e) {}
  };

  //post detail
  const selectedPostDetail = (item) => {
    setPostDetail(item);
    setPressedShare(!pressedShare);
  };

  //create captcha
  const generateCaptcha = () => {
    const randomNumber1 = Math.floor(Math.random() * 100) + 1;
    const randomNumber2 = Math.floor(Math.random() * 10) + 1;
    return `${randomNumber1} + ${randomNumber2}`;
  };
  //############################################
  //           Define API Functions           //
  //############################################

  //api function to save post
  const saveThisPost = async (post, toggleSaved) => {
    try {
      const savedPost = await savePost({
        post_id: post?.post?.id,
        save: post?.saved ? false : true,
      });
      toggleSaved(savedPost?.post_view?.saved);
    } catch (e) {
      alert(e);
    }
  };

  //function to follow a community
  const followCommunityFunction = async (item) => {
    setLoadingFollowCommunity(true);

    try {
      const followedCommunity = await followCommunity({
        community_id: item.community.id,
        follow: item.subscribed == "Subscribed" ? false : true,
      });

      setLoadingFollowCommunity(false);
    } catch (e) {
      setLoadingFollowCommunity(false);
    }
  };

  //refresh person details
  const refreshPersonDetails = async () => {
    try {
      const refreshDetails = await getPersonDetails({
        username: currentUserInfo?.person_view?.person?.name,
      });
    } catch (e) {
    } finally {
      setCurrentUserInfo(signedInUserInfo);
    }
  };

  //api call to upvote posts
  const voteUpPost = async (item, voteScore, toggleVote) => {
    const score =
      item?.my_vote == -1 && voteScore == 1
        ? 2
        : item?.my_vote == 1 && voteScore == 0
        ? -1
        : !item?.my_vote && voteScore == 1
        ? 1
        : 0;

    try {
      const votedPost = await likePost({
        post_id: item.post.id,
        score: voteScore,
      });
      toggleVote(
        votedPost?.post_view?.my_vote ? votedPost?.post_view?.my_vote : 0,
        score
      );
    } catch (e) {}
  };

  //api call to downvote posts
  const voteDownPost = async (item, voteScore, toggleVote) => {
    const score =
      item?.my_vote == 1 && voteScore == -1
        ? -2
        : item?.my_vote == -1 && voteScore == 0
        ? 1
        : !item?.my_vote && voteScore == -1
        ? -1
        : 0;

    try {
      const votedPost = await likePost({
        post_id: item.post.id,
        score: voteScore,
      });
      toggleVote(
        votedPost?.post_view?.my_vote ? votedPost?.post_view?.my_vote : 0,
        score
      );
    } catch (e) {}
  };

  //api call for top 25 posts of the day
  const topTwentyFive = async () => {
    setLuckyResults([]);
    // console.log("topTwentyFive");
    try {
      const fetchedPosts = await getPosts({
        sort: "TopDay",
        limit: 50,
        type_: "Local",
      });

      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setLuckyResults((prevPosts) => {
        const newposts = addDetectedLanguage;
        //remove duplicate posts

        return removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id)
              )
              .filter((post) => !post.post.nsfw)
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id &&
                      t.post.name === post.post.name
                  )
              )
          : newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id)
              )
              .filter((post) => !post.post.nsfw);
      });
      setRandomTop5((prevPosts) => {
        const newposts = addDetectedLanguage;
        //remove duplicate posts

        return newposts
          .filter(
            (post, index, self) =>
              index === self.findIndex((t) => t.post.id === post.post.id)
          )
          .filter((post) => !post.post.nsfw)
          ?.sort(() => 0.5 - Math.random())
          .slice(0, 15);
      });
    } catch (e) {
    } finally {
    }
  };

  //api call for initial post fetch
  const fetchInitialPosts = async (chosenInstance) => {
    setNoFrontPagePostResults(false);
    setLoadingMainPosts(true);
    try {
      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        limit: 15,
        page: 1,
        type_: listing,
        saved_only: false,
      });
      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setPosts((prevPosts) => {
        const newposts = addDetectedLanguage;
        //remove duplicate posts
        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoadingMainPosts(false);
      }, 1000);
    }
  };

  //api call for saved post fetch
  const fetchSavedPosts = async (chosenInstance) => {
    // console.log("fetchSavedPosts");
    setLoadingSavedPosts(true);
    try {
      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        type_: listing,
        limit: 25,
        page: 1,
        type_: "All",
        saved_only: true,
      });
      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setSavedPostItems((prevPosts) => {
        const newposts = addDetectedLanguage;

        //remove duplicate posts & check nsfw
        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      setSavedPage(savedPage + 0);
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoadingSavedPosts(false);
      }, 1000);
    }
  };

  //get searched posts from api (search all)
  const fetchSearchPosts = async (item) => {
    setLoadingSearch(true);
    setSearchNavigation("Posts");

    setNoSearchPostResults(false);
    setNoSearchCommunityResults(false);
    setNoSearchUserResults(false);
    setNoSearchCommentResults(false);

    setPageSearch(1);
    setPageSearchCommunity(1);
    setPageSearchUsers(1);
    setPageSearchComments(1);

    try {
      const fetchedSearch = await search({
        type_: "All",
        sort: sort,
        listing_type: listing,
        q: item,
        page: 1,
        limit: 25,
      });
      fetchedSearch?.posts?.length == 0 && setNoSearchPostResults(true);
      fetchedSearch?.communities?.length == 0 &&
        setNoSearchCommunityResults(true);
      fetchedSearch?.users?.length == 0 && setNoSearchUserResults(true);
      fetchedSearch?.comments?.length == 0 && setNoSearchCommentResults(true);

      setSearchPosts((prevPosts) => {
        const newposts = fetchedSearch.posts;
        //remove duplicate posts

        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });

      //filter out communities with 1 or fewer posts
      let filteredCommunities = fetchedSearch.communities.filter((item) => {
        return item.counts.posts > 1;
      });

      setSearchCommunities(filteredCommunities);
      setSearchUsers(fetchedSearch.users);
      setSearchComments(fetchedSearch.comments);
    } catch (e) {
      setNoSearchPostResults(true);
    } finally {
      setLoadingSearch(false);
    }
  };

  //api call for more search posts (search posts)
  const fetchMoreSearchPosts = async (searchValue) => {
    setLoadingMoreSearch(true);
    try {
      const fetchedSearch = await search({
        type_: "Posts",
        //sort: "TopAll",
        listing_type: listing,
        q: searchValue,
        page: pageSearch + 1,
        limit: 25,
      });

      setSearchPosts((prevPosts) => {
        const newposts = [...prevPosts, ...fetchedSearch.posts];
        //remove duplicate posts

        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      setPageSearch(pageSearch + 1);
      fetchedSearch?.posts?.length == 0 && setNoSearchPostResults(true);
    } catch (e) {
      setNoSearchPostResults(true);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  //api call for more search communities (search communities)
  const fetchMoreSearchCommunities = async (searchValue) => {
    setLoadingMoreSearch(true);
    try {
      const fetchedSearch = await search({
        type_: "Communities",
        //sort: "TopAll",
        listing_type: listing,
        q: searchValue,
        page: pageSearchCommunity + 1,
        limit: 50,
      });
      //filter out communities with 1 or fewer posts
      let filteredCommunities = fetchedSearch.communities.filter((item) => {
        return item.counts.posts > 1;
      });
      setSearchCommunities((prevPosts) => {
        const newposts = [...prevPosts, ...filteredCommunities];
        return newposts.filter(
          (community, index, self) =>
            index ===
            self.findIndex(
              (t) => t.community.actor_id === community.community.actor_id
            ) //no duplicate id
        );
      });
      setPageSearchCommunity(pageSearchCommunity + 1);
      fetchedSearch?.communities?.length == 0 &&
        setNoSearchCommunityResults(true);
    } catch (e) {
      setNoSearchCommunityResults(true);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  //api call for more search users (search users)
  const fetchMoreSearchUsers = async (searchValue) => {
    setLoadingMoreSearch(true);
    try {
      const fetchedSearch = await search({
        type_: "Users",
        //sort: "TopAll",
        listing_type: listing,
        q: searchValue,
        page: pageSearchUsers + 1,
        limit: 25,
      });

      setSearchUsers((prevPosts) => {
        const newposts = [...prevPosts, ...fetchedSearch.users];
        return newposts.filter(
          (person, index, self) =>
            index === self.findIndex((t) => t.person.id === person.person.id) //no duplicate id
        );
      });
      setPageSearchUsers(pageSearchUsers + 1);
      fetchedSearch?.users?.length == 0 && setNoSearchUserResults(true);
    } catch (e) {
      setNoSearchUserResults(true);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  //api call for more search comments (search comments)
  const fetchMoreSearchComments = async (searchValue) => {
    setLoadingMoreSearch(true);
    try {
      const fetchedSearch = await search({
        type_: "Comments",
        //sort: "TopAll",
        listing_type: listing,
        q: searchValue,
        page: pageSearchComments + 1,
        limit: 25,
      });

      setSearchComments((prevPosts) => {
        const newposts = [...prevPosts, ...fetchedSearch.comments];
        return newposts.filter(
          (comment, index, self) =>
            index === self.findIndex((t) => t.comment.id === comment.comment.id) //no duplicate id
        );
      });
      setPageSearchComments(pageSearchComments + 1);
      fetchedSearch?.comments?.length == 0 && setNoSearchCommentResults(true);
    } catch (e) {
      setNoSearchCommentResults(true);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  //api call for more saved post fetch
  const fetchMoreSavedPosts = async (chosenInstance) => {
    //console.log("fetchMoreSavedPosts");
    setLoadingMoreSavedPosts(true);
    try {
      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        type_: listing,
        limit: 25,
        page: savedPage,
        saved_only: true,
      });

      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setSavedPostItems((prevPosts) => {
        const newposts = [...prevPosts, ...addDetectedLanguage];

        //remove duplicate posts & check nsfw
        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      setSavedPage(savedPage + 1);
      fetchedPosts?.posts?.length == 0 && setNoSavedPostResults(true);
    } catch (e) {
    } finally {
      setLoadingMoreSavedPosts(false);
    }
  };

  //get post from url from api
  const fetchPost = async (postId, instanceURL) => {
    setLoading(true);

    try {
      const fetchedPost = await getPost(postId, instanceURL);
      fetchedPost && setPost(fetchedPost?.post_view);
      fetchedPost && setPostDetail(fetchedPost?.post_view);
      setLoadingFollowCommunity(false); //stop loading follow/unfollow
    } catch (e) {
      setLoadingFollowCommunity(false); //stop loading follow/unfollow
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  //api call for more post fetch
  const fetchMorePosts = async (chosenInstance) => {
    setLoadingMorePosts(true);
    try {
      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        limit: 25,
        page: page + 1,
        type_: listing,
      });

      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setPosts((prevPosts) => {
        const newposts = [...prevPosts, ...addDetectedLanguage];
        //remove duplicate posts

        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      setPage(page + 1);
      fetchedPosts?.posts?.length == 0 && setNoFrontPagePostResults(true);
    } catch (e) {
      setNoFrontPagePostResults(true);
    } finally {
      setLoadingMorePosts(false);
    }
  };

  //api call for more post fetch
  const fetchMoreCommunityPosts = async (chosenInstance) => {
    // console.log("fetchMorePosts");
    setLoadingMoreCommunityPosts(true);

    try {
      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        limit: 25,
        community_id: community.community_view.community.id,
        page: communityViewPage + 1,
        type_: listing,
      });
      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setCommunityPosts((prevPosts) => {
        const newposts = [...prevPosts, ...addDetectedLanguage];
        //remove duplicate posts

        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      setCommunityViewPage(communityViewPage + 1);
      fetchedPosts?.posts?.length == 0 && setNoCommunityPostResults(true);
    } catch (e) {
    } finally {
      setLoadingMoreCommunityPosts(false);
    }
  };

  //api to get community info
  const fetchCommunity = async (chosenInstance, communityName) => {
    setCommunity("");
    try {
      setLoadingCommunityPosts(true);
      const fetchedCommunity = await getCommunity(chosenInstance, {
        name: communityName,
      });
      setCommunity(fetchedCommunity);

      const fetchedPosts = await getPosts(chosenInstance, {
        sort: sort,
        limit: 25,
        community_id: fetchedCommunity.community_view.community.id,
        page: 1,
        type_: listing,
      });
      fetchedPosts?.posts?.length == 0 && setNoCommunityPostResults(true);

      //detect the language of the title
      const addDetectedLanguage = fetchedPosts.posts.map((item) => {
        return {
          ...item,
          detectedLanguage:
            eld.detect(item.post.name).language == ""
              ? "en"
              : eld.detect(item.post.name).language,
        };
      });
      setCommunityPosts((prevPosts) => {
        const newposts = addDetectedLanguage;
        //remove duplicate posts

        return jwt
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
            : newposts.filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
          : !showNSFWSettings
          ? removeDuplicatePosts
            ? newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter(
                  (post, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.post.creator_id === post.post.creator_id && //no dup creator and name
                        t.post.name === post.post.name
                    )
                )
                .filter((post) => !post.post.nsfw) //no nsfw
            : newposts
                .filter(
                  (post, index, self) =>
                    index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
                )
                .filter((post) => !post.post.nsfw) //no nsfw
          : removeDuplicatePosts
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter(
                (post, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.post.creator_id === post.post.creator_id && //no dup creator and name
                      t.post.name === post.post.name
                  )
              )
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
    } catch (e) {
      setNoCommunityPostResults(true);
    } finally {
      setTimeout(() => {
        setLoadingCommunityPosts(false);
      }, 1500);
    }
  };

  //initial api call for community data
  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const fetchedCommunities = await listCommunities({
        sort: "TopAll",
        limit: 5,
        page: 1,
        type_: listing,
      });
      setCommunities(fetchedCommunities?.communities);

      setPage(page + 0);
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  };

  //api delete post
  const deleteSelectedPost = async (id) => {
    try {
      const deleteUserPost = await deletePost({
        post_id: id,
      });
    } catch (e) {
    } finally {
    }
  };

  //############################################
  //               Define Refs                //
  //############################################

  //ref for the text input
  const textInputRef = useRef(null);

  //ref to scroll flatlist to top
  const flatListRef = useRef(null);

  //ref for lottie success animation
  const lottieRef = useRef(null);

  //ref for scrollview
  const scrollViewRef = useRef();

  //ref to scroll community search flatlist to top
  const flatListRefCommunitySearch = useRef(null);

  //ref to scroll comments search flatlist to top
  const flatListRefCommentsSearch = useRef(null);

  //ref to scroll user search flatlist to top
  const flatListRefUserSearch = useRef(null);

  //ref to scroll sign up page to top
  const signupScrollRef = useRef(null);

  //############################################
  //             Search Functions             //
  //############################################

  //show search bar if there is an active search
  useEffect(() => {
    staticSearchValue?.length > 0 && setShowSearch(true);
  }, [width]);

  //############################################
  //            Community Functions          //
  //############################################

  //function to follow a community
  const followCommunityPageFunction = async (item) => {
    setCommunitiesPageLoading(true);
    try {
      const followedCommunity = await followCommunity({
        community_id: item.community.id,
        follow: item.subscribed == "Subscribed" ? false : true,
      });
    } catch (e) {
    } finally {
      fetchCommunitiesPage(communitiesPage);
      fetchFollowedCommunities();
      fetchSearchCommunities(communityInput, searchPage);
      setFollowPressedId(item?.community?.id);
    }
    setCommunitiesPageLoading(false);
  };

  //initial api call for community data
  const fetchFollowedCommunities = async (pageNumber) => {
    if (!communitiesPageLoading) {
      setCommunitiesPageLoading(true);
      try {
        const fetchedCommunities = await listCommunities({
          sort: "TopAll",
          limit: 50,
          page: pageNumber,
          type_: "Subscribed",
        });
        setFollowedCommunities(fetchedCommunities?.communities);
        fetchedCommunities?.communities?.length == 0 &&
          setHasMoreDataFollowed(false);
        setFollowPressedId("");
      } catch (e) {
      } finally {
        setTimeout(() => {
          setCommunitiesPageLoading(false);
        }, 1000);
      }
    }
  };

  //get searched posts from api (search communities)
  const fetchSearchCommunities = async (item, pageNumber) => {
    try {
      const fetchedSearch = await search({
        type_: "Communities",
        sort: "TopAll",
        page: pageNumber,
        listing_type: listing == "Local" ? "Local" : "All",
        q: item,
        limit: 5,
      });
      setQuickSearchCommunities(() => {
        const newposts = fetchedSearch?.communities;

        return jwt
          ? newposts
          : !showNSFWSettings
          ? newposts.filter((community) => !community.community.nsfw)
          : newposts;
      });
      setFollowPressedId("");
    } catch (e) {
    } finally {
    }
  };

  //initial api call for community data
  const fetchCommunitiesPage = async (pageNumber) => {
    pageNumber == 1 && setCommunitiesPageLoading(true);
    try {
      const fetchedCommunities = await listCommunities({
        sort: "TopAll",
        limit: 50,
        page: pageNumber,
        type_: listing == "Local" ? "Local" : listing == "All" ? "All" : "All",
      });

      setCommunitiesList(() => {
        const newposts = fetchedCommunities?.communities;

        return jwt
          ? newposts
          : !showNSFWSettings
          ? newposts.filter((community) => !community.community.nsfw)
          : newposts;
      });
      fetchedCommunities?.communities?.length == 0 && setHasMoreData(false);

      setFollowPressedId("");
    } catch (e) {}
    setTimeout(() => {
      setCommunitiesPageLoading(false);
    }, 1000);
  };

  return (
    <StateContext.Provider
      value={{
        blankBarWidth,
        centerPanelPadding,
        centerPanelWidthFull,
        centerPanelWidthMedium,
        centerPanelWidthNonDesktop,
        changeInstance,
        chosenFont_Bold,
        chosenFont_ExtraBold,
        chosenFont_Regular,
        chosenFont_SuperBold,
        chosenFont_Thin,
        client,
        commentPageAttempt,
        commentPageLoading,
        comments,
        CommentsPlaceholders,
        communities,
        communitiesList,
        communitiesPage,
        communitiesPageLoading,
        community,
        communityInput,
        communityInputWithInstance,
        CommunityPlaceholders,
        communityPosts,
        confirmedNsfw,
        copyLink,
        createComment,
        createPost,
        currentUserInfo,
        deleteComment,
        deleteImage,
        deleteSelectedPost,
        didFirstLoad,
        dispatch,
        editComment,
        editPost,
        fetchCommunities,
        fetchCommunitiesPage,
        fetchCommunity,
        fetchFollowedCommunities,
        fetchInitialPosts,
        fetchMoreCommunityPosts,
        fetchMorePosts,
        fetchMoreSavedPosts,
        fetchMoreSearchPosts,
        fetchMoreSearchCommunities,
        fetchMoreSearchUsers,
        fetchMoreSearchComments,
        fetchPost,
        fetchSavedPosts,
        fetchSearchPosts,
        fetchSearchCommunities,
        flatListRef,
        flatListRefCommentsSearch,
        flatListRefCommunitySearch,
        flatListRefUserSearch,
        followCommunity,
        followCommunityFunction,
        followCommunityPageFunction,
        followedCommunities,
        followPressedId,
        generateCaptcha,
        getComment,
        getComments,
        getSingleCommentThread,
        getCommunity,
        getFederatedInstances,
        getOtherUserDetails,
        getPersonDetails,
        getPersonMentions,
        getPost,
        getPosts,
        getReplies,
        getSite,
        global,
        hasMoreData,
        headerHeight,
        height,
        IconActivity,
        IconAlertTriangle,
        IconAlignBoxLeftMiddle,
        IconAnalyze,
        IconArrowBigDown,
        IconArrowBigUp,
        IconArrowNarrowUp,
        IconArrowsMoveVertical,
        IconArrowsUpDown,
        IconBell,
        IconBold,
        IconBolt,
        IconBook,
        IconBookmark,
        IconBookmarkOff,
        IconBookmarkPlus,
        IconBoxMultiple2,
        IconBlur,
        IconCalendarClock,
        IconCalendarEvent,
        IconChevronDown,
        IconChevronLeft,
        IconChevronRight,
        IconClipboard,
        IconClover,
        IconCoffee,
        IconCode,
        IconDotsVertical,
        IconEdit,
        IconExternalLink,
        IconEye,
        IconEyeOff,
        IconHandStop,
        IconHeading,
        IconHeart,
        IconHelp,
        IconFilterEdit,
        IconFlame,
        IconHome,
        IconInfoCircle,
        IconInfoSquareRounded,
        IconItalic,
        IconLanguage,
        IconLayoutBoard,
        IconLayoutBottombar,
        IconLayoutRows,
        IconLayoutSidebarRightCollapse,
        IconLink,
        IconList,
        IconListDetails,
        IconLogout,
        IconMapPin,
        IconMenu2,
        IconMessageCircle,
        IconMessageCirclePlus,
        IconMessageDots,
        IconMessages,
        IconMoon,
        IconPalette,
        IconPhoto,
        IconArrowsMaximize,
        IconPictureInPicture,
        IconPlanet,
        IconPlayerPlay,
        IconQuote,
        IconRefresh,
        IconScale,
        IconSearch,
        IconSend,
        IconServer,
        IconSettings,
        IconShadow,
        IconShare,
        IconSparkles,
        IconSquareForbid2,
        IconStack2,
        IconStar,
        IconStrikethrough,
        IconSubscript,
        IconSuperscript,
        IconTextSize,
        IconThumbDown,
        IconThumbUp,
        IconTrash,
        IconTypography,
        IconTrendingUp,
        IconTrendingUp3,
        IconTriangle,
        IconUser,
        IconUserCircle,
        IconUsers,
        IconVolume,
        instanceDetail,
        isPWA,
        jwt,
        leftBarWidth,
        likeComment,
        likePost,
        listCommunities,
        loading,
        loadingCommunityPosts,
        loadingFollowCommunity,
        loadingLogin,
        loadingLucky,
        loadingMainPosts,
        loadingMoreCommunityPosts,
        loadingMorePosts,
        loadingMoreSavedPosts,
        loadingMoreSearch,
        loadingSavedPosts,
        loadingSearch,
        localUser,
        login,
        logout,
        lottieRef,
        luckyResults,
        markAllAsRead,
        markCommentReplyAsRead,
        navigationLoading,
        noCommunityPostResults,
        noFrontPagePostResults,
        noSavedPostResults,
        noSearchPostResults,
        noSearchCommunityResults,
        noSearchUserResults,
        noSearchCommentResults,
        onlyShowThreads,
        overlayHeight,
        overlayRadius,
        overlayWidth,
        page,
        pageSearch,
        pageSearchComments,
        pageSearchCommunity,
        PageWithHeaderPlaceholders,
        passwordReset,
        PopupMenu,
        postDetail,
        postDownVotes,
        PostFilters,
        postUpVotes,
        post,
        PostPlaceholders,
        posts,
        pressedShare,
        quickSearchCommunities,
        pwaHeight,
        randomTop5,
        refreshPersonDetails,
        RenderCard,
        renderCard,
        RenderHeaderCommunity,
        RenderHeaderDefault,
        RenderHeaderSaved,
        RenderHeaderSearch,
        renderHeaderUser,
        replies,
        rightBarWidth,
        savedPage,
        savedPostItems,
        savedPosts,
        savePost,
        saveThisPost,
        saveUserSettings,
        scrollToTopPostion,
        scrollViewRef,
        showAbout,
        search,
        searchComments,
        searchCommunities,
        searchDropdownHovering,
        searchIsFocused,
        searchPage,
        searchPosts,
        searchText,
        searchUsers,
        selectedPostDetail,
        setCommentPageAttempt,
        setCommentPageLoading,
        setComments,
        setCommunities,
        setCommunitiesList,
        setCommunitiesPage,
        setCommunitiesPageLoading,
        setCommunity,
        setCommunityInput,
        setCommunityInputWithInstance,
        setCommunityPosts,
        setConfirmedNsfw,
        setCurrentUserInfo,
        setDidFirstLoad,
        setFollowPressedId,
        setFollowedCommunities,
        setHasMoreData,
        setIsPWA,
        setLoading,
        setLoadingCommunityPosts,
        setLoadingFollowCommunity,
        setLoadingLogin,
        setLoadingLucky,
        setLoadingMainPosts,
        setLoadingMorePosts,
        setLoadingSavedPosts,
        setLoadingSearch,
        setLuckyResults,
        setNavigationLoading,
        setNoFrontPagePostResults,
        setNoSearchPostResults,
        setOnlyShowThreads,
        setPage,
        setPageSearch,
        setPageSearchComments,
        setPageSearchCommunity,
        setPost,
        setPostDetail,
        setPostDownVotes,
        setPostUpVotes,
        setPosts,
        setPressedShare,
        setQuickSearchCommunities,
        setRandomTop5,
        setReplies,
        setSavedPage,
        setSavedPostItems,
        setSavedPosts,
        setSearchComments,
        setSearchCommunities,
        setSearchDropdownHovering,
        setSearchIsFocused,
        setSearchPage,
        setSearchPosts,
        setSearchText,
        setSearchUsers,
        setShowAbout,
        setShowEditPost,
        setShowingResults,
        setShowLearnMoreRemoveDuplicates,
        setShowLuckyTooltip,
        setShowPostActivity,
        setShowSearch,
        setShowSideDrawer,
        setSearchNavigation,
        setShowTransition,
        setStaticSearchValue,
        setUserDetails,
        setViewedViaFeelingLucky,
        setWritePost,
        showEditPost,
        showingResults,
        showLearnMoreRemoveDuplicates,
        showLuckyTooltip,
        showPostActivity,
        showSearch,
        showSideDrawer,
        showTransition,
        searchNavigation,
        signedInUserInfo,
        signupScrollRef,
        staticSearchValue,
        textInputRef,
        topTwentyFive,
        uploadImage,
        userDetails,
        viewedViaFeelingLucky,
        voteDownPost,
        voteUpPost,
        width,
        writePost,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
    sort: state.updateItem.reduxGlobal.sort,
    listing: state.updateItem.reduxGlobal.listing,
    instance: state.updateItem.reduxGlobal.instance,
    removeDuplicatePosts: state.updateItem.reduxGlobal.removeDuplicatePosts,
  };
};
// Connect component to the Redux store.
export const StateProvider = withColorScheme(
  connect(mapStateToProps)(StateProviderUnconnected)
);
export function useStates() {
  return useContext(StateContext);
}

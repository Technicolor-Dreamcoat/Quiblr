import { useState, useEffect, useContext } from "react";
import { View, Platform } from "react-native";
import { StateContext } from "../../../StateContext";
import SearchDropdownSection from "../../search/components/SearchDropdownSection";
import LeftBarList from "../../../sections/LeftBarList";
import AllOverlays from "../../../overlays/AllOverlays";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import HeaderSection from "../../../sections/HeaderSection";
import BlankBarSection from "../../../sections/BlankBarSection";
import PostsSection from "../components/PostsSection";
import TransitionOverlay from "../../../overlays/TransitionOverlay";
const MainPage = ({ colors, sort, listing, instance, showNSFWSettings }) => {
  const {
    fetchInitialPosts,
    height,
    jwt,
    loadingMainPosts,
    luckyResults,
    posts,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    width,
  } = useContext(StateContext);

  const [xButtonHovered, setXButtonHovered] = useState(false);

  //api search call
  useEffect(() => {
    // fetchRegularPosts();
    fetchInitialPosts(instance);

    //for some reason, this needs to run again to ensure saved post detail is read successfully
    setTimeout(() => {
      fetchInitialPosts(instance);
    }, 500);
  }, [instance, sort, listing, jwt, showNSFWSettings]);

  //############################################
  //             Animation & Design           //
  //############################################

  useEffect(() => {
    setXButtonHovered(false); //prevent hover style when typing
  }, [searchText]);

  //############################################
  //                  Render                  //
  //############################################
  return (
    <View
      style={{
        flexGrow: 1,
        maxHeight: height,
        backgroundColor: colors.white,
        overflow: "hidden",
      }}
    >
      <TransitionOverlay loadingMainPosts={loadingMainPosts} posts={posts} />
      <AllOverlays />
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
        <LeftBarList active={"Home"} />
        <PostsSection />
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sort: state.updateItem.reduxGlobal.sort,
    instance: state.updateItem.reduxGlobal.instance,
    listing: state.updateItem.reduxGlobal.listing,
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(MainPage);

export default withColorScheme(ConnectedComponent);

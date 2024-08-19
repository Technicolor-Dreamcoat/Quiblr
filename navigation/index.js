import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./StackNavigator";
import { navigationRef } from "./NavigationService";
import { StateContext } from "../StateContext";

export default function Navigation() {
  const config = {
    screens: {
      Quiblr: "/",
      Error: "*",
      Settings: "/settings",
      ProfileSettings: "/profile_settings",
      Login: "/login",
      Signup: "/signup",
      Saved: "/saved",
      ForgotPasswordScreen: "/forgot_password",
      WritePost: "/write_post/:inherit?",
      SignupSelectInstance: "/signup/select_instance",
      SignupApplication: "/signup/select_instance/:selected_instance",
      LearnMoreInstance: "/the_fediverse_and_you",
      LearnMorePostActivity: "/post_activity",
      Communities: "/communities",
      Instance: "/instance",
      NsfwWarningPost:
        "/nsfw/instance/:post_instance/post/:post_id/:post_name/",
      NsfwWarningCommunity:
        "/nsfw/instance/:currentInstance/community/:communityInstance/:communityName",
      User: "/instance/:currentInstance/user/:userInstance/:userName",
      FullImage: "/image/:imageUrl",
      Comments: "/instance/:post_instance/post/:post_id/:post_name?/",
      SpecificComment:
        "/instance/:comment_instance/comment/:comment_id/:post_name?",
      SearchPage: "/search/:searchText",
      SearchDropdownMobile: "/search_mobile/",
      CommunityView:
        "/instance/:currentInstance/community/:communityInstance/:communityName",
    },
  };

  const linking = {
    prefixes: [],
    config,
  };
  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <MainStackNavigator />
    </NavigationContainer>
  );
}

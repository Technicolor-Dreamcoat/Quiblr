import { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainPage from "../../screens/frontpage/screens/MainPage";
import CommentPage from "../../screens/comments/screens/CommentPage";
import CommunitiesPage from "../../screens/communities/screens/CommunitiesPage";
import LoginPage from "../../screens/LoginPage";
import SettingsPage from "../../screens/settings/screens/SettingsPage";
import { StateContext } from "../../StateContext";
import SignupPageIntro from "../../screens/signup/screens/SignupPageIntro";
import SignupPageSelectInstance from "../../screens/signup/screens/SignupPageSelectInstance";
import InstanceLearnMorePage from "../../screens/learnMore/screens/InstanceLearnMorePage";
import PostActivityLearnMorePage from "../../screens/learnMore/screens/PostActivityLearnMorePage";
import SignupPageApplication from "../../screens/signup/screens/SignupPageApplication";
import InstancePage from "../../screens/instance/screens/InstancePage";
import SearchPage from "../../screens/search/screens/SearchPage";
import CommunityViewPage from "../../screens/communities/screens/CommunityViewPage";
import WritePostPage from "../../screens/writePost/screens/WritePostPage";
import Error from "../../screens/errors/Error";
import ErrorAlreadyLoggedIn from "../../screens/errors/ErrorAlreadyLoggedIn";
import ProfileInfoPage from "../../screens/user/screens/ProfileInfoPage";
import SavedPostsPage from "../../screens/saved/screens/SavedPostsPage";
import FullImagePage from "../../screens/comments/screens/FullImagePage";
import SearchDropdownMobile from "../../screens/search/screens/SearchDropdownMobile";
import NsfwWarningCommunity from "../../screens/nsfw/screens/NsfwWarningCommunity";
import NsfwWarningPost from "../../screens/nsfw/screens/NsfwWarningPost";
import ProfileSettingsPage from "../../screens/ProfileSettingsPage";
import ForgotPasswordScreen from "../../screens/ForgotPasswordScreen";
import SpecificCommentPage from "../../screens/comments/screens/SpecificCommentPage";
const Stack = createStackNavigator();

function MainStackNavigator() {
  const { jwt, width } = useContext(StateContext);

  //loading
  return (
    <Stack.Navigator
      initialRouteName="Quiblr"
      screenOptions={{
        header: () => null, // hide the header
      }}
    >
      <Stack.Screen
        name="Quiblr"
        component={MainPage}
        options={{
          title: "Quiblr",
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          title: "Forgot Password",
        }}
      />
      <Stack.Screen
        name="NsfwWarningPost"
        component={NsfwWarningPost}
        options={{
          title: "Are you at least 18?",
        }}
      />
      <Stack.Screen
        name="NsfwWarningCommunity"
        component={NsfwWarningCommunity}
        options={{
          title: "Are you at least 18?",
        }}
      />
      <Stack.Screen
        name="FullImage"
        component={FullImagePage}
        options={({ route }) => ({
          title: decodeURIComponent(route?.params?.imageUrl),
        })}
      />
      <Stack.Screen
        name="Saved"
        component={jwt ? SavedPostsPage : LoginPage}
        options={{
          title: "Saved",
        }}
      />
      <Stack.Screen
        name="User"
        component={ProfileInfoPage}
        options={({ route }) => ({
          title: decodeURIComponent(route?.params?.userName),
        })}
      />
      <Stack.Screen
        name="WritePost"
        component={jwt ? WritePostPage : LoginPage}
        options={{
          title: "Write Post",
        }}
      />
      <Stack.Screen
        name="CommunityView"
        component={CommunityViewPage}
        options={({ route }) => ({
          title: decodeURIComponent(route?.params?.communityName),
        })}
      />

      <Stack.Screen
        name="Instance"
        component={InstancePage}
        options={{
          title: "Instance",
        }}
      />
      <Stack.Screen
        name="SearchPage"
        component={SearchPage}
        options={({ route }) => ({
          title: "Search - " + decodeURIComponent(route?.params?.searchText),
        })}
      />

      <Stack.Screen
        name="SearchDropdownMobile"
        component={width > 1000 ? MainPage : SearchDropdownMobile}
        options={({ route }) => ({
          title: "Search",
        })}
      />
      <Stack.Screen
        name="Communities"
        component={CommunitiesPage}
        options={{
          title: "Communities",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={jwt ? ProfileSettingsPage : LoginPage}
        options={{
          title: "Profile Settings",
        }}
      />
      <Stack.Screen
        name="Login"
        component={jwt ? ErrorAlreadyLoggedIn : LoginPage}
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="Signup"
        component={jwt ? ErrorAlreadyLoggedIn : SignupPageIntro}
        options={{
          title: "Signup",
        }}
      />
      <Stack.Screen
        name="SignupSelectInstance"
        component={jwt ? ErrorAlreadyLoggedIn : SignupPageSelectInstance}
        options={{
          title: "Signup - Select Instance",
        }}
      />
      <Stack.Screen
        name="SignupApplication"
        component={jwt ? ErrorAlreadyLoggedIn : SignupPageApplication}
        options={{
          title: "Signup - Application",
        }}
      />
      <Stack.Screen
        name="LearnMoreInstance"
        component={InstanceLearnMorePage}
        options={{
          title: "The Fediverse and You",
        }}
      />

      <Stack.Screen
        name="LearnMorePostActivity"
        component={PostActivityLearnMorePage}
        options={{
          title: "Post Activity",
        }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentPage}
        options={({ route }) => ({
          title: route?.params?.post_name
            ? decodeURIComponent(route?.params?.post_name)
            : "Post: " +
              route?.params?.post_instance +
              "/" +
              route?.params?.post_id,
        })}
      />
      <Stack.Screen
        name="SpecificComment"
        component={SpecificCommentPage}
        options={({ route }) => ({
          title: route?.params?.post_name
            ? decodeURIComponent(route?.params?.post_name)
            : "Thread: " +
              route?.params?.comment_instance +
              "/" +
              route?.params?.comment_id,
        })}
      />
      <Stack.Screen name="Error" component={Error} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;

import React, { useState, useContext } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { MenuTrigger, Menu, MenuOptions } from "react-native-popup-menu";
import { StateContext } from "../../StateContext";
import MenuOptionComponent from "../../components/MenuOptionComponent";
import { extractWebsiteName } from "../../actions";
import * as Speech from "expo-speech";

const MoreButton = ({
  styles,
  colors,
  instance,
  post,
  toggleSaved,
  setShowCopiedMore,
}) => {
  const {
    copyLink,
    IconBook,
    IconBookmarkOff,
    IconBookmarkPlus,
    IconDotsVertical,
    IconPlayerPlay,
    IconShare,
    jwt,
    saveThisPost,
    selectedPostDetail,
  } = useContext(StateContext);
  const [moreHovering, setMoreHovering] = useState(false);
  const [playingSpeech, setPlayingSpeech] = useState(false);
  //############################################
  //              TEXT TO SPEECH              //
  //############################################
  const speak = (text, language) => {
    const options = {
      pitch: 1.3,
      rate: 0.9,
      quality: Speech.VoiceQuality.Enhanced,
      language,
      onStart: () => {
        setPlayingSpeech(true);
      },
      onDone: () => {
        setPlayingSpeech(false);
      },
    };
    Speech.speak(text, options);
  };
  return (
    <Menu //more button
      style={[
        styles.commentSortMenu,
        {
          borderWidth: 2,
          borderColor: "transparent",
          backgroundColor: "transparent",
        },
      ]}
    >
      <MenuTrigger
        style={{
          height: 40,
          width: 40,
          alignItems: "center",
          paddingHorizontal: 5,
          borderRadius: 100,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            transitionDuration: "150ms",
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
            borderWidth: 2,
            borderColor: moreHovering ? colors.lightGreyShade4 : "transparent",
            backgroundColor: moreHovering ? colors.greyShade2 : "transparent",
          }}
          onMouseEnter={() => setMoreHovering(true)}
          onMouseLeave={() => setMoreHovering(false)}
        >
          <IconDotsVertical size={18} stroke={2} color={colors.greyShade4} />
        </View>
      </MenuTrigger>

      <MenuOptions
        style={styles.smallPadding}
        customStyles={styles.menuOptions}
      >
        <MenuOptionComponent //post detail
          onSelectLogic={false}
          includeOnStateAction={false}
          onSelectStateAction={console.log}
          additionalAction={() => selectedPostDetail(post)}
          includeRedux={false}
          reduxItem={"sort"}
          reduxValue={"TopDay"}
          showAlertCriteria={false}
          title={"Details"}
          includeIcon={true}
          Icon={<IconBook size={18} stroke={2.0} color={colors.greyShade4} />}
        />
        <MenuOptionComponent //play audio
          onSelectLogic={false}
          includeOnStateAction={false}
          onSelectStateAction={console.log}
          additionalAction={() =>
            !playingSpeech && speak(post.post.name, post.detectedLanguage)
          }
          includeRedux={false}
          reduxItem={"sort"}
          reduxValue={"TopDay"}
          showAlertCriteria={false}
          title={playingSpeech ? "Playing..." : "Read Aloud"}
          includeIcon={true}
          Icon={
            <IconPlayerPlay size={18} stroke={2.0} color={colors.greyShade4} />
          }
        />

        <MenuOptionComponent //share
          onSelectLogic={false}
          includeOnStateAction={false}
          onSelectStateAction={console.log}
          additionalAction={() => (
            setShowCopiedMore(true),
            copyLink(
              window.location.href.split("/")[0] +
                "//" +
                window.location.href.split("/")[2] +
                "/instance/" +
                extractWebsiteName(instance) +
                "/post/" +
                post.post.id +
                "/" +
                encodeURIComponent(post.post.name) +
                "/"
            )
          )}
          includeRedux={false}
          reduxItem={"sort"}
          reduxValue={"Active"}
          showAlertCriteria={false}
          title={"Share"}
          includeIcon={true}
          Icon={<IconShare size={18} stroke={2.0} color={colors.greyShade4} />}
        />
        {jwt && (
          <MenuOptionComponent //bookmark
            onSelectLogic={false}
            includeOnStateAction={false}
            onSelectStateAction={console.log}
            additionalAction={() => saveThisPost(post, toggleSaved)}
            includeRedux={false}
            reduxItem={"sort"}
            reduxValue={"Active"}
            showAlertCriteria={false}
            title={post?.saved ? "Unsave" : "Save"}
            includeIcon={true}
            Icon={
              post?.saved ? (
                <IconBookmarkOff
                  size={18}
                  stroke={2.0}
                  color={colors.greyShade4}
                />
              ) : (
                <IconBookmarkPlus
                  size={18}
                  stroke={2.0}
                  color={colors.greyShade4}
                />
              )
            }
          />
        )}
      </MenuOptions>
    </Menu>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(MoreButton);

export default withColorScheme(ConnectedComponent);

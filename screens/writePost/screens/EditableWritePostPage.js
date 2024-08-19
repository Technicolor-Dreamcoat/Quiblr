import React, { useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
} from "react-native";
import CommunitiesSearch from "../components/CommunitiesSearch";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import {
  Octicons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toggle from "react-native-toggle-element";
import { SmallSpace } from "../../../constants";
import { StateContext } from "../../../StateContext";
import * as Animatable from "react-native-animatable";
import {
  RenderText,
  addBold,
  addItalics,
  addStrikethrough,
  addLink,
  addList,
  addHeader,
  addQuote,
  addCode,
  addSubscript,
  addSuperscript,
} from "../../../actions";
import MenuOptionComponent from "../../../components/MenuOptionComponent";
import GenericButton from "../../../components/GenericButton";
import WritePostOptions from "../../comments/components/WritePostOptions";

const EditableWritePostPage = ({
  colors,
  styles,
  instance,
  nsfwTrueFalse_imported,
  linkInput_imported,
  bodyInput_imported,
  titleInput_imported,
  communityInput_imported,
  fullSelectedCommunity_imported,
  writeLinkImage_imported,
  fontSize,
  setShowEditPost,
  refreshPostDetail,
  post_id,
}) => {
  const { chosenFont_Regular, editPost, generateCaptcha, uploadImage, width } =
    useContext(StateContext);
  const [captcha, setCaptcha] = useState(generateCaptcha()); //captcha puzzle
  const [userInput, setUserInput] = useState(""); //user captcha answer
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [errorPosting, setErrorPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postOptions, setPostOptions] = useState(writeLinkImage_imported);
  const [uploadedImage, setUploadedImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [fullSelectedCommunity, setFullSelectedCommunity] = useState(
    fullSelectedCommunity_imported
  );
  const [communityInput, setCommunityInput] = useState(communityInput_imported);
  const [titleInput, setTitleInput] = useState(titleInput_imported);
  const [bodyInput, setBodyInput] = useState(bodyInput_imported);
  const [linkInput, setLinkInput] = useState(linkInput_imported);
  const [nsfwTrueFalse, setNsfwTrueFalse] = useState(nsfwTrueFalse_imported);
  const [hoveredBold, setHoveredBold] = useState(false);
  const [hoveredItalics, setHoveredItalics] = useState(false);
  const [hoveredStrikethrough, setHoveredStrikethrough] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [hoveredList, setHoveredList] = useState(false);
  const [hoveredMore, setHoveredMore] = useState(false);

  useEffect(() => {
    userInput?.length > 0 && setWrongAnswer(false);
  }, [userInput]);

  //action to update edited post
  const submitPost = async () => {
    setLoading(true);
    const captchaNumbers = captcha.split(" + ");
    const correctAnswer =
      parseInt(captchaNumbers[0]) + parseInt(captchaNumbers[1]);
    if (parseInt(userInput) === correctAnswer) {
      try {
        await editPost({
          name: titleInput,
          body: bodyInput,
          nsfw: nsfwTrueFalse,
          url: postOptions == "Link" ? linkInput : null,
          post_id: post_id,
        });
        refreshPostDetail();
        setShowEditPost(false);
        setLoading(false);
      } catch (e) {
        setErrorPosting(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setWrongAnswer(true);
      setUserInput("");
      setCaptcha(generateCaptcha());
    }
  };

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
      <View>
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
                  width: 230,
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
                  // Add other styling as needed
                  top: width < 500 ? position.y - 300 : position.y - 230,
                  left: position.x - 35,
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

  //delete uploaded image
  const deleteUploadedImage = () => {
    try {
      /*  deleteImage({
        filename: imageFileName,
        token: imageDeleteToken,
      }).then((result) => {
        console.log(result);
      }); */
      setUploadedImage("");
    } catch (e) {
      // alert(e);
    }
  };

  //convert image uri to blob
  function dataURItoBlob(dataURI) {
    // Convert Base64 to raw binary data held in a string.

    var byteString = atob(dataURI.split(",")[1]);

    // Separate the MIME component.
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // Write the bytes of the string to an ArrayBuffer.
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Write the ArrayBuffer to a BLOB and you're done.
    var bb = new Blob([ab]);

    return bb;
  }

  //create image url
  const createImageUrl = async (imageURI) => {
    uploadImage({
      image: dataURItoBlob(imageURI),
    }).then((result) => {});
  };

  //pick image for upload
  const pickImage = async () => {
    setImageUploadLoading(true);
    setTimeout(() => {
      setImageUploadLoading(false);
    }, 3000);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setUploadedImage(result?.assets[0]?.uri);
      createImageUrl(result?.assets[0]?.uri);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        height: "100%",

        padding: 15,
        paddingTop: 0,
      }}
    >
      <View>
        <View //header
          style={[styles.loginContainer]}
        >
          <View>
            <View //header title
            >
              <View style={{ paddingTop: 10 }} />
              <Text style={styles.loginPageTitle}>Edit Post</Text>
            </View>
          </View>
        </View>
        <View>
          <SmallSpace />
          <WritePostOptions
            postOptions={postOptions}
            setPostOptions={setPostOptions}
          />

          <SmallSpace />
          <CommunitiesSearch
            setCommunityInput={setCommunityInput}
            communityInput={communityInput}
            setFullSelectedCommunity={setFullSelectedCommunity}
            selectedCommunity_imported={true}
          />

          <SmallSpace />

          {postOptions == "Image" && (
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <GenericButton
                text={uploadedImage ? "RE-UPLOAD IMAGE" : "UPLOAD IMAGE"}
                noText={false}
                disabled={loading}
                includeBorder={uploadedImage ? true : false}
                cancelButton={false}
                textColor={uploadedImage ? colors.blueShade2 : "white"}
                background={uploadedImage ? colors.white : colors.blueShade2}
                size={"large"}
                shadowColor={
                  uploadedImage ? colors.greyShade2 : colors.blueShade3
                }
                action={pickImage}
                includeIcon={false}
                icon={"heart"}
                loadingIndicator={false}
                tall={false}
              />

              {uploadedImage && ( //uploaded image
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => deleteUploadedImage()}
                    style={[
                      styles.xButtonContainer,
                      {
                        width: 30,
                        height: 30,
                        backgroundColor: "black",
                        opacity: 0.7,
                        position: "absolute",
                        zIndex: 2,
                        top: 5,
                        right: 5,
                      },
                    ]}
                  >
                    <Text style={[styles.xButtonText, { color: "white" }]}>
                      X
                    </Text>
                  </TouchableOpacity>
                  <Image
                    style={{
                      height: 200,
                      width: "100%",
                      resizeMode: "contain",
                      borderRadius: 10,
                      backgroundColor: "black",
                    }}
                    source={{ uri: uploadedImage }}
                  />
                </View>
              )}
            </View>
          )}
          {postOptions == "Link" && (
            <TextInput //Link
              style={[
                styles.mainPage_TextInputContainer,
                {
                  width: "100%",
                  height: 50,
                  borderLeftWidth: 2,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 15,
                  borderWidth: 1,
                  backgroundColor: colors.greyShade1,
                  color: colors.black,
                },
              ]}
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"Post Link..."}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setLinkInput}
              value={linkInput}
            />
          )}
          {(postOptions == "Link" || postOptions == "Image") && <SmallSpace />}
          <TextInput //Title
            style={[
              styles.mainPage_TextInputContainer,
              {
                width: "100%",
                height: 50,
                borderLeftWidth: 2,
                backgroundColor: colors.greyShade1,
                borderRadius: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                padding: 15,
              },
            ]}
            color={colors.black}
            autoComplete={"off"}
            autoCapitalize={"none"}
            placeholder={"Post Title..."}
            placeholderTextColor={colors.greyShade3}
            selectionColor={colors.blueShade2}
            onChangeText={setTitleInput}
            value={titleInput}
          />
          <SmallSpace />

          <View
            style={{
              width: "100%",
              height: 200,
              borderWidth: 2,
              borderColor: colors.greyShade2,
              borderRadius: 10,
            }}
          >
            <TextInput //body input
              style={[
                styles.mainPage_TextInputContainer,
                {
                  backgroundColor: colors.white,
                  width: "100%",
                  height: 160,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  padding: 15,
                  paddingBottom: 0,
                },
              ]}
              placeholder={"Post Body..."}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              color={colors.black}
              multiline
              onChangeText={setBodyInput}
              value={bodyInput}
              onSelectionChange={({ nativeEvent }) =>
                setSelection(nativeEvent.selection)
              }
            />
            <View //body formatting
              style={{
                height: 40,
                width: "100%",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: colors.lightGreyShade2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  heigth: "100%",
                  width: "60%",
                  gap: 8,
                }}
              >
                <Pressable //bold
                  onHoverIn={() => setHoveredBold(true)}
                  onHoverOut={() => setHoveredBold(false)}
                >
                  <View
                    style={[
                      {
                        backgroundColor: hoveredBold
                          ? colors.greyShade1
                          : "tranparent",
                      },
                      styles.fontButton,
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        borderRadius: 5,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        addBold(bodyInput, selection, setBodyInput)
                      }
                    >
                      <Octicons
                        name="bold"
                        size={23}
                        color={colors.grey}
                        style={{
                          opacity: 0.7,
                          padding: 3,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </Pressable>
                <Pressable //italic
                  onHoverIn={() => setHoveredItalics(true)}
                  onHoverOut={() => setHoveredItalics(false)}
                >
                  <View
                    style={[
                      {
                        backgroundColor: hoveredItalics
                          ? colors.greyShade1
                          : "tranparent",
                      },
                      styles.fontButton,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        addItalics(bodyInput, selection, setBodyInput)
                      }
                    >
                      <Octicons
                        name="italic"
                        size={23}
                        color={colors.grey}
                        style={{
                          opacity: 0.7,
                          borderRadius: 5,
                          padding: 3,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </Pressable>
                {width > 425 && (
                  <Pressable //strikethrough
                    onHoverIn={() => setHoveredStrikethrough(true)}
                    onHoverOut={() => setHoveredStrikethrough(false)}
                  >
                    <View
                      style={[
                        {
                          backgroundColor: hoveredStrikethrough
                            ? colors.greyShade1
                            : "tranparent",
                        },
                        styles.fontButton,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          addStrikethrough(bodyInput, selection, setBodyInput)
                        }
                      >
                        <Octicons
                          name="strikethrough"
                          size={23}
                          color={colors.grey}
                          style={{
                            opacity: 0.7,
                            borderRadius: 5,
                            padding: 3,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                )}
                {width > 325 && (
                  <Pressable //link
                    onHoverIn={() => setHoveredLink(true)}
                    onHoverOut={() => setHoveredLink(false)}
                  >
                    <View
                      style={[
                        {
                          backgroundColor: hoveredLink
                            ? colors.greyShade1
                            : "tranparent",
                        },
                        styles.fontButton,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          addLink(bodyInput, selection, setBodyInput)
                        }
                      >
                        <Octicons
                          name="link"
                          size={23}
                          color={colors.grey}
                          style={{
                            opacity: 0.7,
                            borderRadius: 5,
                            padding: 3,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                )}

                {width > 370 && (
                  <Pressable //list
                    onHoverIn={() => setHoveredList(true)}
                    onHoverOut={() => setHoveredList(false)}
                  >
                    <View
                      style={[
                        {
                          backgroundColor: hoveredList
                            ? colors.greyShade1
                            : "tranparent",
                        },
                        styles.fontButton,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          addList(bodyInput, selection, setBodyInput)
                        }
                      >
                        <Octicons
                          name="list-unordered"
                          size={23}
                          color={colors.grey}
                          style={{
                            opacity: 0.7,
                            borderRadius: 5,
                            padding: 3,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                )}

                <PopupMenu
                  trigger={
                    <Ionicons
                      name="ellipsis-vertical"
                      size={23}
                      color={colors.grey}
                      style={{
                        opacity: 0.7,
                        borderRadius: 5,
                        paddingVertical: 3,
                        paddingHorizontal: 5,
                        width: 30,
                        backgroundColor: hoveredMore
                          ? colors.greyShade1
                          : "tranparent",
                      }}
                    />
                  }
                >
                  {width <= 325 && (
                    <MenuOptionComponent //link
                      onSelectLogic={false}
                      includeOnStateAction={false}
                      onSelectStateAction={console.log}
                      additionalAction={() =>
                        addLink(bodyInput, selection, setBodyInput)
                      }
                      includeRedux={false}
                      reduxItem={""}
                      reduxValue={""}
                      showAlertCriteria={false}
                      title={"Link"}
                      includeIcon={true}
                      Icon={
                        <Octicons
                          name="link"
                          size={18}
                          color={colors.greyShade4}
                          style={{
                            opacity: 0.7,
                          }}
                        />
                      }
                    />
                  )}
                  {width <= 370 && (
                    <MenuOptionComponent //list
                      onSelectLogic={false}
                      includeOnStateAction={false}
                      onSelectStateAction={console.log}
                      additionalAction={() =>
                        addList(bodyInput, selection, setBodyInput)
                      }
                      includeRedux={false}
                      reduxItem={""}
                      reduxValue={""}
                      showAlertCriteria={false}
                      title={"List"}
                      includeIcon={true}
                      Icon={
                        <Octicons
                          name="list"
                          size={18}
                          color={colors.greyShade4}
                          style={{
                            opacity: 0.7,
                          }}
                        />
                      }
                    />
                  )}

                  {width <= 400 && (
                    <MenuOptionComponent //strikethrough
                      onSelectLogic={false}
                      includeOnStateAction={false}
                      onSelectStateAction={console.log}
                      additionalAction={() =>
                        addStrikethrough(bodyInput, selection, setBodyInput)
                      }
                      includeRedux={false}
                      reduxItem={""}
                      reduxValue={""}
                      showAlertCriteria={false}
                      title={"Strikethrough"}
                      includeIcon={true}
                      Icon={
                        <Octicons
                          name="strikethrough"
                          size={18}
                          color={colors.greyShade4}
                          style={{
                            opacity: 0.7,
                          }}
                        />
                      }
                    />
                  )}
                  <MenuOptionComponent //header
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      addHeader(bodyInput, selection, setBodyInput)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Header"}
                    includeIcon={true}
                    Icon={
                      <FontAwesome
                        name="header"
                        size={18}
                        color={colors.greyShade4}
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    }
                  />
                  <MenuOptionComponent //quote
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      addQuote(bodyInput, selection, setBodyInput)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Quote"}
                    includeIcon={true}
                    Icon={
                      <Octicons
                        name="quote"
                        size={18}
                        color={colors.greyShade4}
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    }
                  />
                  <MenuOptionComponent //code
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      addCode(bodyInput, selection, setBodyInput)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Code"}
                    includeIcon={true}
                    Icon={
                      <Octicons
                        name="code"
                        size={18}
                        color={colors.greyShade4}
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    }
                  />
                  <MenuOptionComponent //subscript
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      addSubscript(bodyInput, selection, setBodyInput)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Subscript"}
                    includeIcon={true}
                    Icon={
                      <FontAwesome5
                        name="subscript"
                        size={18}
                        color={colors.greyShade4}
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    }
                  />
                  <MenuOptionComponent //superscript
                    onSelectLogic={false}
                    includeOnStateAction={false}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      addSuperscript(bodyInput, selection, setBodyInput)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Superscript"}
                    includeIcon={true}
                    Icon={
                      <FontAwesome5
                        name="superscript"
                        size={18}
                        color={colors.greyShade4}
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    }
                  />
                </PopupMenu>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  width: "40%",
                  heigth: "100%",
                  gap: 15,
                }}
              ></View>
            </View>
          </View>
          <SmallSpace />
          {bodyInput && (
            <Animatable.View
              animation={"flipInX"}
              duration={500}
              style={{
                padding: 15,
                backgroundColor: colors.greyShade1,
                borderRadius: 10,
              }}
            >
              <Text style={styles.smallSectionTitles}>Preview</Text>
              <RenderText
                body={bodyInput}
                colors={colors}
                fontSize={fontSize}
                instance={instance}
              />
            </Animatable.View>
          )}
          <SmallSpace />
          <View
            style={[
              styles.spreadCenteredRow,
              {
                flex: 1,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                borderRadius: 10,
                height: 55,
                padding: 15,
              },
            ]}
          >
            <Text style={styles.boldText}>NSFW: </Text>
            <Toggle
              value={nsfwTrueFalse}
              containerStyle={{ width: 55 }}
              trackBar={{ width: 76 }}
              trackBarStyle={{
                width: 60,
                height: 35,
                borderRadius: 5,
                backgroundColor: nsfwTrueFalse ? colors.red : "#d6d6d6",
                overflow: "hidden",
              }}
              thumbStyle={{
                width: 30,
                height: 30,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "white",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: {
                  height: 1,
                  width: 0,
                },
              }}
              onPress={() => setNsfwTrueFalse(!nsfwTrueFalse)}
            />
          </View>
          <SmallSpace />
          <View //captcha
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  color: colors.black,
                  fontFamily: chosenFont_Regular,
                }}
              >
                {captcha}
              </Text>
            </View>
            <TextInput
              style={[
                styles.mainPage_TextInputContainer,
                {
                  height: 40,
                  width: 150,
                  borderLeftWidth: 2,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 10,
                  alignSelf: "center",
                  backgroundColor: colors.greyShade1,
                },
              ]}
              color={colors.black}
              value={userInput}
              placeholder={"Answer..."}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setUserInput}
              keyboardType="number-pad"
            />
          </View>
          <SmallSpace />

          {errorPosting && (
            <Text
              style={{
                color: colors.red,
                fontStyle: "italic",
                fontFamily: chosenFont_Regular,
              }}
            >
              Post failed, please try again later
            </Text>
          )}
          {wrongAnswer && (
            <Text
              style={{
                color: colors.red,
                fontStyle: "italic",
                fontFamily: chosenFont_Regular,
              }}
            >
              Incorrect Captcha, please try again
            </Text>
          )}
          <SmallSpace />
          <View
            style={{
              flexDirection: width > 350 && "row",
              alignSelf: "center",
              gap: width > 350 ? 5 : 10,
            }}
          >
            <GenericButton
              text={"CANCEL"}
              noText={false}
              disabled={loading ? true : false}
              includeBorder={true}
              cancelButton={true}
              textColor={colors.greyShade3}
              background={colors.white}
              size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
              shadowColor={colors.greyShade3}
              action={() => setShowEditPost(false)}
              includeIcon={false}
              icon={"heart"}
              loadingIndicator={false}
              tall={false}
            />
            <GenericButton
              text={"UPDATE POST"}
              noText={false}
              disabled={
                postOptions == "Write"
                  ? fullSelectedCommunity == "" ||
                    userInput.trim() == "" ||
                    titleInput.trim() == "" ||
                    loading
                  : postOptions == "Image"
                  ? fullSelectedCommunity == "" ||
                    uploadedImage == "" ||
                    userInput.trim() == "" ||
                    titleInput.trim() == "" ||
                    loading
                  : postOptions == "Link"
                  ? fullSelectedCommunity == "" ||
                    linkInput == "" ||
                    userInput.trim() == "" ||
                    titleInput.trim() == "" ||
                    loading
                  : false
              }
              includeBorder={false}
              cancelButton={false}
              textColor={
                postOptions == "Write"
                  ? fullSelectedCommunity != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? "white"
                    : colors.greyShade3
                  : postOptions == "Image"
                  ? fullSelectedCommunity != "" &&
                    uploadedImage != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? "white"
                    : colors.greyShade3
                  : postOptions == "Link"
                  ? fullSelectedCommunity != "" &&
                    linkInput != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? "white"
                    : colors.greyShade3
                  : colors.greyShade3
              }
              background={
                postOptions == "Write"
                  ? fullSelectedCommunity != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade2
                    : colors.greyShade2
                  : postOptions == "Image"
                  ? fullSelectedCommunity != "" &&
                    uploadedImage != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade2
                    : colors.greyShade2
                  : postOptions == "Link"
                  ? fullSelectedCommunity != "" &&
                    linkInput != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade2
                    : colors.greyShade2
                  : colors.greyShade2
              }
              size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
              shadowColor={
                postOptions == "Write"
                  ? fullSelectedCommunity != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade3
                    : "transparent"
                  : postOptions == "Image"
                  ? fullSelectedCommunity != "" &&
                    uploadedImage != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade3
                    : "transparent"
                  : postOptions == "Link"
                  ? fullSelectedCommunity != "" &&
                    linkInput != "" &&
                    userInput.trim() != "" &&
                    titleInput.trim() != "" &&
                    !loading
                    ? colors.blueShade3
                    : "transparent"
                  : "transparent"
              }
              action={() => submitPost()}
              includeIcon={false}
              icon={"heart"}
              loadingIndicator={loading}
              tall={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(EditableWritePostPage);

export default withColorScheme(ConnectedComponent);

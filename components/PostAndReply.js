import React, { useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import {
  Ionicons,
  Octicons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import MenuOptionComponent from "../components/MenuOptionComponent";
import {
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
} from "../actions";
import GenericButton from "./GenericButton";
import { StateContext } from "../StateContext";
const PostAndReply = ({
  colors,
  styles,
  placeholder,
  existingText,
  addDelete,
  postAction,
  actionButtonText,
  deleteAction,
  disabled,
  autoFocus,
  inputHeight,
  enterToSubmit,
  clearText,
  fontSize,
  loadingDelete,
}) => {
  const { chosenFont_ExtraBold, width } = useContext(StateContext);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [postOrReply, setPostOrReply] = useState(existingText);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredBold, setHoveredBold] = useState(false);
  const [hoveredItalics, setHoveredItalics] = useState(false);
  const [hoveredStrikethrough, setHoveredStrikethrough] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [hoveredList, setHoveredList] = useState(false);
  const [hoveredMore, setHoveredMore] = useState(false);
  const [hoveredDelete, setHoveredDelete] = useState(false);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);

  //textinput ref
  const textInputRef = useRef(null);

  //pressed action button
  const pressedAction = () => {
    postOrReply.trim() != "" && setLoading(true);
    postOrReply.trim() != "" && postAction(postOrReply);
    postOrReply.trim() != "" && setPostOrReply("");
    postOrReply.trim() != "" &&
      setTimeout(() => {
        setLoading(false);
      }, 1000);
  };

  //detect if text should be cleared
  useEffect(() => {
    existingText ? setPostOrReply(existingText) : setPostOrReply("");
    //textInputRef.current.focus();
  }, [clearText]);

  //hotkeys
  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      enterToSubmit && event.preventDefault(); // Prevent the default Enter key action
      enterToSubmit && pressedAction();
      textInputRef.current.focus(); // Refocus the TextInput
    }
    if (event.key == "b" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addBold(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "i" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addItalics(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "s" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addStrikethrough(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "l" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addLink(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addList(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "h" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addHeader(postOrReply, selection, setPostOrReply);
    }
    if (event.key == "j" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addQuote(postOrReply, selection, setPostOrReply);
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
        <TouchableOpacity
          disabled={disabled}
          ref={triggerRef}
          onPress={onTriggerPress}
        >
          {trigger}
        </TouchableOpacity>

        {isVisible && (
          <Modal transparent={true} onRequestClose={() => setIsVisible(false)}>
            <TouchableOpacity
              disabled={disabled}
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

  return (
    <View
      style={{
        height: inputHeight + 40,
        borderWidth: 2,
        borderColor: colors.greyShade2,
        borderRadius: 12,
      }}
    >
      {!deleteConfirmation && (
        <TextInput
          ref={textInputRef}
          editable={!disabled}
          style={{
            height: inputHeight,
            width: "100%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            color: colors.black,
            padding: 15,
            justifyContent: "flex-start",
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          placeholderTextColor={colors.grey}
          color={colors.black}
          multiline={!enterToSubmit}
          onChangeText={setPostOrReply}
          value={postOrReply}
          selectionColor={colors.blueShade2}
          onKeyPress={handleKeyPress}
          onSelectionChange={({ nativeEvent }) =>
            setSelection(nativeEvent.selection)
          }
        />
      )}
      {!deleteConfirmation && (
        <View //formatting
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
                    addBold(postOrReply, selection, setPostOrReply)
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

            <Pressable //italics
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
                    addItalics(postOrReply, selection, setPostOrReply)
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
                      addStrikethrough(postOrReply, selection, setPostOrReply)
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
                      addLink(postOrReply, selection, setPostOrReply)
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
                      addList(postOrReply, selection, setPostOrReply)
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
                    addLink(postOrReply, selection, setPostOrReply)
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
                    addList(postOrReply, selection, setPostOrReply)
                  }
                  includeRedux={false}
                  reduxItem={""}
                  reduxValue={""}
                  showAlertCriteria={false}
                  title={"List"}
                  includeIcon={true}
                  Icon={
                    <Octicons
                      name="list-unordered"
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
                    addStrikethrough(postOrReply, selection, setPostOrReply)
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
                  addHeader(postOrReply, selection, setPostOrReply)
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
                  addQuote(postOrReply, selection, setPostOrReply)
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
                  addCode(postOrReply, selection, setPostOrReply)
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
                  addSubscript(postOrReply, selection, setPostOrReply)
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
                  addSuperscript(postOrReply, selection, setPostOrReply)
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
              gap: 5,
            }}
          >
            {addDelete && (
              <Pressable //delete
                onHoverIn={() => setHoveredDelete(true)}
                onHoverOut={() => setHoveredDelete(false)}
              >
                <TouchableOpacity onPress={() => setDeleteConfirmation(true)}>
                  <Octicons
                    name="trash"
                    size={23}
                    color={colors.red}
                    style={{
                      opacity: 0.7,
                      borderRadius: 5,
                      padding: 3,
                    }}
                  />
                </TouchableOpacity>
              </Pressable>
            )}
            <Pressable //submit
              onHoverIn={() => setHoveredSubmit(true)}
              onHoverOut={() => setHoveredSubmit(false)}
              style={[
                {
                  width: width < 340 ? 75 : 90,
                },
                styles.writeComponentSubmit,
              ]}
            >
              <TouchableOpacity
                disabled={
                  loading
                    ? true
                    : postOrReply.trim().length > 0
                    ? disabled
                    : true
                }
                onPress={pressedAction}
                style={[
                  {
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      postOrReply.trim().length > 0
                        ? hoveredSubmit
                          ? colors.blueShade1
                          : colors.blueShade2
                        : colors.lightGreyShade4,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.greyShade4} />
                ) : (
                  <Text
                    style={{
                      fontFamily: chosenFont_ExtraBold,
                      fontSize: width < 800 && 13,
                      color:
                        postOrReply.trim().length > 0 ? "white" : colors.grey,
                    }}
                  >
                    {actionButtonText}
                  </Text>
                )}
              </TouchableOpacity>
            </Pressable>
          </View>
        </View>
      )}
      {deleteConfirmation && (
        <View
          style={{
            height: 211,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.boldText,
              {
                fontSize: 17 + fontSize,
                textAlign: "center",
                paddingHorizontal: 10,
              },
            ]}
          >
            Are you sure you want to delete this item?
          </Text>
        </View>
      )}
      {deleteConfirmation && (
        <View
          style={{
            marginTop: 5,
            flexDirection: width > 350 && "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <GenericButton
            text={"CANCEL"}
            noText={false}
            disabled={loadingDelete}
            includeBorder={true}
            textColor={colors.greyShade3}
            cancelButton={true}
            background={colors.red}
            size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
            shadowColor={colors.greyShade3}
            action={() => setDeleteConfirmation(false)}
            includeIcon={false}
            icon={"pencil"}
            loadingIndicator={false}
            tall={false}
          />
          <GenericButton
            text={"DELETE"}
            noText={false}
            disabled={loadingDelete}
            includeBorder={false}
            textColor={"white"}
            cancelButton={false}
            background={colors.red}
            size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
            shadowColor={colors.darkRed}
            action={deleteAction}
            includeIcon={false}
            icon={"pencil"}
            loadingIndicator={loadingDelete}
            tall={false}
          />
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostAndReply);

export default withColorScheme(ConnectedComponent);

import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { formatNumber } from "../../actions";
import { StateContext } from "../../StateContext";
import { useNavigation } from "@react-navigation/native";

const Voting = ({
  colors,
  styles,
  voteDownAction,
  voteUpAction,
  item,
  toggleVote,
  backgroundColor,
  borderWidth,
  borderRadius,
  borderColor,
  setPostHovering,
  downArrowHovering,
  setDownArrowHovering,
  upArrowHovering,
  setUpArrowHovering,
  flipVotingArrows,
}) => {
  const { IconArrowBigDown, IconArrowBigUp, instanceDetail, jwt } =
    useContext(StateContext);
  const navigation = useNavigation();

  return (
    <View //voting & reply
      style={[styles.row, { gap: 5 }]}
    >
      <View
        style={[
          styles.updownvotes,
          {
            justifyContent: instanceDetail?.site_view?.local_site
              ?.enable_downvotes
              ? "space-evenly"
              : "center",
            width: instanceDetail?.site_view?.local_site?.enable_downvotes
              ? 90
              : 70,
            backgroundColor,
            borderWidth,
            borderColor,
            borderRadius,
          },
        ]}
      >
        {!flipVotingArrows &&
          instanceDetail?.site_view?.local_site?.enable_downvotes && (
            <Pressable
              onHoverIn={() => (
                setDownArrowHovering(true), setPostHovering(true)
              )}
              onHoverOut={() => setDownArrowHovering(false)}
              style={[
                styles.voteContainer,
                {
                  transitionDuration: "150ms",
                  justifyContent: "center",
                  backgroundColor:
                    downArrowHovering || item?.my_vote == -1
                      ? colors.lightRed
                      : "transparent",

                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor:
                    downArrowHovering || item?.my_vote == -1
                      ? colors.red
                      : "transparent",
                },
              ]}
              onPress={() =>
                jwt == null
                  ? navigation.push("Login")
                  : voteDownAction(
                      item,
                      item?.my_vote == -1 ? 0 : -1,
                      toggleVote
                    )
              }
            >
              <IconArrowBigDown
                size={23}
                stroke={2.0}
                color={
                  downArrowHovering || item?.my_vote == -1
                    ? colors.red
                    : colors.greyShade4
                }
                style={styles.extraSmallPadding}
              />
            </Pressable>
          )}
        {flipVotingArrows && (
          <Pressable
            onHoverIn={() => (setUpArrowHovering(true), setPostHovering(true))}
            onHoverOut={() => setUpArrowHovering(false)}
            style={[
              styles.voteContainer,
              {
                transitionDuration: "150ms",
                justifyContent: "center",
                backgroundColor:
                  upArrowHovering || item?.my_vote == 1
                    ? colors.lightBlue
                    : "transparent",
                borderRadius: 100,
                borderWidth: 1,
                borderColor:
                  upArrowHovering || item?.my_vote == 1
                    ? colors.blue
                    : "transparent",
              },
            ]}
            onPress={() =>
              jwt == null
                ? navigation.push("Login")
                : voteUpAction(item, item?.my_vote == 1 ? 0 : 1, toggleVote)
            }
          >
            <IconArrowBigUp
              size={23}
              stroke={2.0}
              style={styles.extraSmallPadding}
              color={
                upArrowHovering || item?.my_vote == 1
                  ? colors.blue
                  : colors.greyShade4
              }
            />
          </Pressable>
        )}

        <Text style={[styles.voteCount]}>
          {formatNumber(item?.counts?.score)}
        </Text>
        {flipVotingArrows &&
          instanceDetail?.site_view?.local_site?.enable_downvotes && (
            <Pressable
              onHoverIn={() => (
                setDownArrowHovering(true), setPostHovering(true)
              )}
              onHoverOut={() => setDownArrowHovering(false)}
              style={[
                styles.voteContainer,
                {
                  transitionDuration: "150ms",
                  justifyContent: "center",
                  backgroundColor:
                    downArrowHovering || item?.my_vote == -1
                      ? colors.lightRed
                      : "transparent",

                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor:
                    downArrowHovering || item?.my_vote == -1
                      ? colors.red
                      : "transparent",
                },
              ]}
              onPress={() =>
                jwt == null
                  ? navigation.push("Login")
                  : voteDownAction(
                      item,
                      item?.my_vote == -1 ? 0 : -1,
                      toggleVote
                    )
              }
            >
              <IconArrowBigDown
                size={23}
                stroke={2.0}
                color={
                  downArrowHovering || item?.my_vote == -1
                    ? colors.red
                    : colors.greyShade4
                }
                style={styles.extraSmallPadding}
              />
            </Pressable>
          )}
        {!flipVotingArrows && (
          <Pressable
            onHoverIn={() => (setUpArrowHovering(true), setPostHovering(true))}
            onHoverOut={() => setUpArrowHovering(false)}
            style={[
              styles.voteContainer,
              {
                transitionDuration: "150ms",
                justifyContent: "center",
                backgroundColor:
                  upArrowHovering || item?.my_vote == 1
                    ? colors.lightBlue
                    : "transparent",
                borderRadius: 100,
                borderWidth: 1,
                borderColor:
                  upArrowHovering || item?.my_vote == 1
                    ? colors.blue
                    : "transparent",
              },
            ]}
            onPress={() =>
              jwt == null
                ? navigation.push("Login")
                : voteUpAction(item, item?.my_vote == 1 ? 0 : 1, toggleVote)
            }
          >
            <IconArrowBigUp
              size={23}
              stroke={2.0}
              style={styles.extraSmallPadding}
              color={
                upArrowHovering || item?.my_vote == 1
                  ? colors.blue
                  : colors.greyShade4
              }
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    flipVotingArrows: state.updateItem.reduxGlobal.flipVotingArrows,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(Voting);

export default withColorScheme(ConnectedComponent);

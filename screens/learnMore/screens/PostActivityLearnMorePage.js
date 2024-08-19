import React, { useContext } from "react";
import { View, Text, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { Space, LargeSpace } from "../../../constants";
import { StateContext } from "../../../StateContext";
import KnowledgeCenterHeader from "../components/KnowledgeCenterHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import GenericButton from "../../../components/GenericButton";
const PostActivityLearnMorePage = ({ colors, styles }) => {
  const { chosenFont_ExtraBold, width } = useContext(StateContext);
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);

  // Listen to navigation events to update the state
  useFocusEffect(
    React.useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation])
  );

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.push("Quiblr");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <KnowledgeCenterHeader
        backdropColor={colors.green}
        date={"MARCH 07, 2024"}
        title={"Understanding your Post Activity Score"}
        by={"By Quiblr"}
      />

      <View style={{ width: width < 700 ? "100%" : 700, alignSelf: "center" }}>
        <LargeSpace />
        <View
          style={[
            styles.backgroundColor,
            ,
            {
              height: 55,
              paddingHorizontal: 15,
            },
          ]}
        >
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            The Post Activity Score is a simple algorithm created by Quiblr to
            indicate the velocity of a post. This score is only visible to the
            OP and can give a quick indication on how active their post is!
            Below outlines how it works:
          </Text>
          <Space />
          <Text
            style={[
              styles.commonText,
              {
                backgroundColor: colors.greyShade1,
                padding: 10,
                borderRadius: 5,
                color: colors.greyShade4,
                fontStyle: "italic",
                textAlign: "center",
              },
            ]}
          >
            (upVotes - downVotes + commentCounts * 2) / timeSinceSubmission
          </Text>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              ⬆️ Vote Counts:{" "}
            </Text>
            The algorithm calculates the net vote count by subtracting the
            number of downvotes from the number of upvotes. This reflects the
            overall sentiment towards the post.
          </Text>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              💬 Comment Counts:{" "}
            </Text>
            This metric considers the number of comments on the post. The number
            of comments is multiplied by 2, thus giving comments a more weight
            in the Post Activity Score due to their contribution to engagement
            and discussion.
          </Text>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              ⏰ Time Since Submission:{" "}
            </Text>
            This calculates the time difference between the current time and the
            time the post was submitted. This metric reflects the recency of the
            post. Typically, newer posts are considered more relevant and may
            receive higher Post Activity Scores. By dividing the Post Activity
            Score by the time difference, the algorithm accounts for time decay,
            ensuring that recent posts are given more weight in the ranking.
          </Text>
          <Space />
          <View
            style={{
              width: 100,
              height: 3,
              backgroundColor: colors.greyShade2,
              alignSelf: "center",
            }}
          />
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            In summary, the Post Activity Score combines vote counts, comment
            counts, and the time since submission to represent the overall
            engagement and relevance of a post, thus giving a snapshot of a
            post's velocity!
          </Text>
          <Space />

          <View style={[styles.preventTouchableRow, { alignSelf: "center" }]}>
            <GenericButton
              text={"CLOSE"}
              noText={false}
              disabled={false}
              includeBorder={true}
              textColor={colors.greyShade3}
              cancelButton={false}
              background={colors.white}
              size={"large"}
              shadowColor={colors.greyShade3}
              action={() => handleGoBack()}
              includeIcon={false}
              icon={"pencil"}
              loadingIndicator={false}
              tall={true}
            />
          </View>
          <LargeSpace />
        </View>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostActivityLearnMorePage);

export default withColorScheme(ConnectedComponent);

import { Skeleton } from "react-native-skeletons";
import { View, Text, ScrollView } from "react-native";

//small space
export const SmallSpace = () => {
  return <View style={{ width: "100%", height: 20 }} />;
};

//space
export const Space = () => {
  return <View style={{ width: "100%", height: 45 }} />;
};

//space large
export const LargeSpace = () => {
  return <View style={{ width: "100%", height: 70 }} />;
};

//today
export const today = new Date();

//all the possible image extension endings
export const imageExtensions = [".png", ".jpg", ".jpeg", ".gif"];

//comment border colors
export const borderColors = {
  6: "#FF3B30", // bright red
  5: "#FF9500", // bright orange
  4: "#FFCC00", // bright yellow
  3: "#4CD964", // bright green
  2: "#5AC8FA", // bright blue
  1: "#007AFF", // deep blue
  7: "#5856D6", // purple
  8: "#FF2D55", // deep pink
  9: "#E6C200", // gold
  10: "#C69C6D", // copper
  11: "#8E8E93", // cool gray
  12: "#57575b", // dark gray
};

// loading placeholder (Card)
export const LoadingPlaceholderCard = ({
  colors,
  styles,
  width,
  centerPanelPadding,
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      style={{ padding: 0, width: "100%", height: "100%" }}
    >
      <View
        style={[
          {
            paddingHorizontal: centerPanelPadding,
            width: "100%",
          },
        ]}
      >
        <View
          style={{
            paddingHorizontal: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        />
        <View
          style={{
            paddingHorizontal: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Skeleton
              color={colors.greyShade2}
              width={75}
              height={18}
              style={[styles.skeletonLeftMargin, { marginRight: 10 }]}
            />
            <Skeleton
              color={colors.greyShade2}
              width={60}
              height={18}
              style={styles.skeletonLeftMargin}
            />
          </View>
        </View>
        <View
          style={[
            styles.itemContainer,
            {
              marginVertical: 5,
              borderWidth: 0,
              borderColor: colors.greyShade2,
            },
          ]}
        >
          <View style={styles.mainInfos}>
            <View>
              <View style={styles.postInfo}>
                <Skeleton
                  color={colors.greyShade2}
                  style={styles.communityIcon}
                />
                <View>
                  <Skeleton
                    color={colors.greyShade2}
                    style={styles.skeletonLeftMargin}
                  />
                  <View style={styles.centeredRow}>
                    <Skeleton
                      color={colors.greyShade2}
                      width={20}
                      height={10}
                      style={styles.skeletonLeftMargin}
                    />
                    <Text
                      style={[
                        styles.metaDataSpacer,
                        { color: colors.greyShade2 },
                      ]}
                    >
                      ·
                    </Text>

                    <Skeleton
                      color={colors.greyShade2}
                      width={40}
                      height={10}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.popupContainer}>
              <View //post popup settings
                style={styles.skeletonPopupContainer}
              >
                <Skeleton color={colors.greyShade2} width={10} height={28} />
              </View>
            </View>
          </View>
          <Skeleton
            color={colors.greyShade2}
            width={"55%"}
            height={25}
            style={styles.skeletonBoxThree}
          />
          <Skeleton
            color={colors.greyShade2}
            width={"100%"}
            height={300}
            borderRadius={20}
            style={styles.marginTopSmall}
          />

          <View style={styles.meta}>
            <View style={styles.iconContainer}>
              <View style={{ width: 40, height: 20 }} />
            </View>

            <View //voting
              style={styles.row}
            >
              <View style={styles.updownvotes}></View>
            </View>
          </View>
        </View>

        {/* //////////////////////////////////////////////////////// */}

        <View
          style={[
            styles.itemContainer,
            {
              marginVertical: 5,
              borderWidth: 0,
              borderColor: colors.greyShade2,
            },
          ]}
        >
          <View style={styles.mainInfos}>
            <View>
              <View style={styles.postInfo}>
                <Skeleton
                  color={colors.greyShade2}
                  style={styles.communityIcon}
                />
                <View>
                  <Skeleton
                    color={colors.greyShade2}
                    style={styles.skeletonLeftMargin}
                  />
                  <View style={styles.centeredRow}>
                    <Skeleton
                      color={colors.greyShade2}
                      width={20}
                      height={10}
                      style={styles.skeletonLeftMargin}
                    />
                    <Text
                      style={[
                        styles.metaDataSpacer,
                        { color: colors.greyShade2 },
                      ]}
                    >
                      ·
                    </Text>

                    <Skeleton
                      color={colors.greyShade2}
                      width={40}
                      height={10}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.popupContainer}>
              <View //post popup settings
                style={styles.skeletonPopupContainer}
              >
                <Skeleton color={colors.greyShade2} width={10} height={28} />
              </View>
            </View>
          </View>

          <Skeleton
            color={colors.greyShade2}
            width={"55%"}
            height={15}
            style={styles.skeletonBoxOne}
          />
          <Skeleton
            color={colors.greyShade2}
            width={"25%"}
            height={15}
            style={styles.skeletonBoxTwo}
          />

          <View style={styles.meta}>
            <View style={styles.iconContainer}>
              <View style={{ width: 40, height: 20 }} />
            </View>

            <View //voting
              style={styles.row}
            >
              <View style={styles.updownvotes}></View>
            </View>
          </View>
        </View>

        {/* //////////////////////////////////////////////////////// */}

        <View
          style={[
            styles.itemContainer,
            {
              marginVertical: 5,
              borderWidth: 0,
              borderColor: colors.greyShade2,
            },
          ]}
        >
          <View style={styles.mainInfos}>
            <View>
              <View style={styles.postInfo}>
                <Skeleton
                  color={colors.greyShade2}
                  style={styles.communityIcon}
                />
                <View>
                  <Skeleton
                    color={colors.greyShade2}
                    style={styles.skeletonLeftMargin}
                  />
                  <View style={styles.centeredRow}>
                    <Skeleton
                      color={colors.greyShade2}
                      width={20}
                      height={10}
                      style={styles.skeletonLeftMargin}
                    />
                    <Text
                      style={[
                        styles.metaDataSpacer,
                        { color: colors.greyShade2 },
                      ]}
                    >
                      ·
                    </Text>

                    <Skeleton
                      color={colors.greyShade2}
                      width={40}
                      height={10}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.popupContainer}>
              <View //post popup settings
                style={styles.skeletonPopupContainer}
              >
                <Skeleton color={colors.greyShade2} width={10} height={28} />
              </View>
            </View>
          </View>

          <Skeleton
            color={colors.greyShade2}
            width={"55%"}
            height={25}
            style={styles.skeletonBoxThree}
          />

          <View style={styles.meta}>
            <View style={styles.iconContainer}>
              <View style={{ width: 40, height: 20 }} />
            </View>

            <View //voting
              style={styles.row}
            >
              <View style={styles.updownvotes}></View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// loading placeholder (Community)
export const LoadingPlaceholderCommunity = ({
  colors,
  styles,
  width,
  IconChevronRight,
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      style={{ padding: 0, width: "100%", height: "100%" }}
    >
      <View
        scrollEnabled={false}
        style={{
          paddingTop: 15,
          paddingHorizontal: 30,
          width: "100%",
        }}
      >
        <SmallSpace />
        <SmallSpace />
        <Skeleton color={colors.greyShade2} width={215} height={40} />
        <SmallSpace />
        <Skeleton
          color={colors.greyShade2}
          width={width < 625 ? "100%" : 290}
          height={40}
        />
        <Space />
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
        <View
          style={{
            height: 80,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderColor: colors.greyShade2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View style={{ gap: 5 }}>
              <Skeleton color={colors.greyShade2} width={100} height={30} />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Skeleton color={colors.greyShade2} width={40} height={20} />
                <Skeleton color={colors.greyShade2} width={80} height={20} />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={60}
              height={35}
            />
            <IconChevronRight color={colors.greyShade2} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// loading placeholder (Comment Page)
export const LoadingPlaceholderComments = ({
  colors,
  styles,
  width,
  centerPanelWidthNonDesktop,
  centerPanelWidthMedium,
  rightBarWidth,
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      style={{ padding: 0, width: "100%", height: "100%" }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          scrollEnabled={false}
          style={{
            paddingTop: 15,
            paddingHorizontal: 30,
            width:
              width <= 1000
                ? centerPanelWidthNonDesktop
                : centerPanelWidthMedium,
          }}
        >
          <SmallSpace />
          <SmallSpace />
          <Skeleton color={colors.greyShade2} width={215} height={40} />
          <SmallSpace />
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Skeleton
              borderRadius={100}
              color={colors.greyShade2}
              width={40}
              height={40}
            />
            <View>
              <Skeleton color={colors.greyShade2} width={150} height={20} />
              <Skeleton
                color={colors.greyShade2}
                width={100}
                height={20}
                style={{ marginTop: 5 }}
              />
            </View>
          </View>
          <Space />
          <Skeleton
            borderRadius={10}
            color={colors.greyShade2}
            width={"100%"}
            height={350}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: width * rightBarWidth,
            paddingTop: 15,
          }}
        >
          <Skeleton
            borderRadius={20}
            color={colors.greyShade2}
            width={"100%"}
            height={"150%"}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// loading placeholder (with header)
export const LoadingPlaceholderWithHeader = ({
  colors,
  styles,
  width,
  centerPanelWidthNonDesktop,
  centerPanelWidthMedium,
}) => {
  return (
    <ScrollView
      scrollEnabled={false}
      style={{ padding: 0, width: "100%", height: "100%" }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          scrollEnabled={false}
          style={{
            paddingTop: 15,
            paddingHorizontal: 30,
            width:
              width <= 1000
                ? centerPanelWidthNonDesktop
                : centerPanelWidthMedium,
          }}
        >
          <SmallSpace />
          <SmallSpace />
          <Skeleton color={colors.greyShade2} width={215} height={40} />
          <SmallSpace />
          <Skeleton
            borderRadius={10}
            color={colors.greyShade2}
            width={"100%"}
            height={125}
          />

          <Space />
          <SmallSpace />
          <View
            style={[
              styles.itemContainer,
              {
                marginVertical: 5,
                borderWidth: 0,
                borderColor: colors.greyShade2,
              },
            ]}
          >
            <View style={styles.mainInfos}>
              <View>
                <View style={styles.postInfo}>
                  <Skeleton
                    color={colors.greyShade2}
                    style={styles.communityIcon}
                  />
                  <View>
                    <Skeleton
                      color={colors.greyShade2}
                      style={styles.skeletonLeftMargin}
                    />
                    <View style={styles.centeredRow}>
                      <Skeleton
                        color={colors.greyShade2}
                        width={20}
                        height={10}
                        style={styles.skeletonLeftMargin}
                      />
                      <Text
                        style={[
                          styles.metaDataSpacer,
                          { color: colors.greyShade2 },
                        ]}
                      >
                        ·
                      </Text>

                      <Skeleton
                        color={colors.greyShade2}
                        width={40}
                        height={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.popupContainer}>
                <View //post popup settings
                  style={styles.skeletonPopupContainer}
                >
                  <Skeleton color={colors.greyShade2} width={10} height={28} />
                </View>
              </View>
            </View>

            <Skeleton
              color={colors.greyShade2}
              width={"55%"}
              height={15}
              style={styles.skeletonBoxOne}
            />
            <Skeleton
              color={colors.greyShade2}
              width={"25%"}
              height={15}
              style={styles.skeletonBoxTwo}
            />

            <View style={styles.meta}>
              <View style={styles.iconContainer}>
                <View style={{ width: 40, height: 20 }} />
              </View>

              <View //voting
                style={styles.row}
              >
                <View style={styles.updownvotes}></View>
              </View>
            </View>
          </View>
          <SmallSpace />
          <View
            style={[
              styles.itemContainer,
              {
                marginVertical: 5,
                borderWidth: 0,
                borderColor: colors.greyShade2,
              },
            ]}
          >
            <View style={styles.mainInfos}>
              <View>
                <View style={styles.postInfo}>
                  <Skeleton
                    color={colors.greyShade2}
                    style={styles.communityIcon}
                  />
                  <View>
                    <Skeleton
                      color={colors.greyShade2}
                      style={styles.skeletonLeftMargin}
                    />
                    <View style={styles.centeredRow}>
                      <Skeleton
                        color={colors.greyShade2}
                        width={20}
                        height={10}
                        style={styles.skeletonLeftMargin}
                      />
                      <Text
                        style={[
                          styles.metaDataSpacer,
                          { color: colors.greyShade2 },
                        ]}
                      >
                        ·
                      </Text>

                      <Skeleton
                        color={colors.greyShade2}
                        width={40}
                        height={10}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.popupContainer}>
                <View //post popup settings
                  style={styles.skeletonPopupContainer}
                >
                  <Skeleton color={colors.greyShade2} width={10} height={28} />
                </View>
              </View>
            </View>

            <Skeleton
              color={colors.greyShade2}
              width={"55%"}
              height={15}
              style={styles.skeletonBoxOne}
            />
            <Skeleton
              color={colors.greyShade2}
              width={"25%"}
              height={15}
              style={styles.skeletonBoxTwo}
            />

            <View style={styles.meta}>
              <View style={styles.iconContainer}>
                <View style={{ width: 40, height: 20 }} />
              </View>

              <View //voting
                style={styles.row}
              >
                <View style={styles.updownvotes}></View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

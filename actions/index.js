import React from "react";
import { View, Text, Platform } from "react-native";
import { useFont } from "../FontContext";
import { DateTime } from "luxon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Color from "color";

//make color lighter
export const makeColorLighter = (hexColor, factor = 0.2) => {
  // Ensure that the factor is between 0 and 1
  factor = Math.min(1, Math.max(0, factor));

  // Convert hex color to RGB
  const rgbColor = Color(hexColor).rgb();

  // Calculate lighter shade
  const lighterColor = rgbColor.lighten(factor);

  // Convert RGB back to hex
  const lighterHexColor = lighterColor.hex();

  return lighterHexColor;
};

// Utility function to remove the last character if it is "/"
export const removeTrailingSlash = (inputString) => {
  if (inputString.endsWith("/")) {
    return inputString.slice(0, -1);
  }
  return inputString;
};

//abbreviated date format (Ex: Jan 01, '23)
export const formatDateAbbreviated = (dateString) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(dateString);
  const year = date.getFullYear().toString().substr(-2);
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, '${year}`;
};

//get time in user's timezone
export const extractLocalTime = (dateString) => {
  //post date in utc
  const dateUTC = DateTime.fromISO(dateString, { zone: "utc" });

  //convert the date to the user's local timezone
  const userLocalTime = dateUTC.toLocal();

  return userLocalTime.toLocaleString(DateTime.TIME_WITH_SECONDS);
};

//italics formatting
export const addItalics = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "*" + selectionToFormat + "*" + suffix);
};

//bold formatting
export const addBold = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "**" + selectionToFormat + "**" + suffix);
};

//strikethrough formatting
export const addStrikethrough = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "~~" + selectionToFormat + "~~" + suffix);
};

//link formatting
export const addLink = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "[" + selectionToFormat + "]()" + suffix);
};

//header formatting
export const addHeader = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + `\n# ` + selectionToFormat + suffix);
};

//quote formatting
export const addQuote = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + `\n>` + selectionToFormat + suffix);
};

//list formatting
export const addList = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + `\n- ` + selectionToFormat + suffix);
};

//code formatting
export const addCode = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "`" + selectionToFormat + "`" + suffix);
};

//subscript formatting
export const addSubscript = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "~" + selectionToFormat + "~" + suffix);
};

//superscript formatting
export const addSuperscript = (text, selection, setState) => {
  const prefix = text.slice(0, selection.start);
  const selectionToFormat = text.slice(selection.start, selection.end);
  const suffix = text.slice(selection.end);
  selection.start + selection.end != 0 &&
    setState(prefix + "^" + selectionToFormat + "^" + suffix);
};

//open external URL link
export const externalURL = (link) => {
  // Open the link in a new tab
  window.open(link, "_blank");
};

//extract date from date/time
export function extractDate(datetimeStr) {
  try {
    const date = new Date(datetimeStr);
    return date.toISOString().split("T")[0];
  } catch {
    return;
  }
}

//extract site name from url
export function extractWebsiteName(url) {
  let formattedUrl = url?.replace(/(^\w+:|^)\/\//, "");
  let match = formattedUrl?.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);

  if (match && match?.length > 1) {
    return match[1];
  }

  return null;
}

//check if a post's url is an image
export function isImageUrl(url) {
  const imageExtensions = /\.(png|jpe?g|gif|bmp|svg|webp)$/i;
  return imageExtensions.test(url);
}

//check if a video file is supported
export function isVideo(file) {
  const videoExtensions = /\.(mp4|mpeg|avi|mkv|mov|flv|webm|3gp|m4v|vob|ts)$/i;
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i;

  // Test for video file extension
  if (videoExtensions.test(file)) {
    return true;
  }

  // Test for YouTube URL
  if (youtubePattern.test(file)) {
    return true;
  }

  // If neither, return false
  return false;
}

//return the diff between now and when the post was published (no units)
export function getTimeDifferenceNoUnits(post) {
  const postLocalTime = DateTime.fromISO(post?.published, {
    zone: "utc",
  }).toLocal();
  const currentTime = DateTime.local();

  const timeDiffInMinutes = Math.floor(
    currentTime.diff(postLocalTime, "minutes").minutes
  );
  return timeDiffInMinutes;
}

//return the diff between now and when the post was published
export function getTimeDifference(post) {
  const postLocalTime = DateTime.fromISO(post?.published, {
    zone: "utc",
  }).toLocal();
  const currentTime = DateTime.local();

  const timeDiffInMinutes = Math.floor(
    currentTime.diff(postLocalTime, "minutes").minutes
  );
  let number, unit;

  if (timeDiffInMinutes < 60) {
    number = timeDiffInMinutes;
    unit = timeDiffInMinutes === 1 ? "m" : "m";
  } else {
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    if (timeDiffInHours < 24) {
      number = timeDiffInHours;
      unit = timeDiffInHours === 1 ? "hr" : "hr";
    } else {
      const timeDiffInDays = Math.floor(timeDiffInHours / 24);
      if (timeDiffInDays < 365) {
        number = timeDiffInDays;
        unit = timeDiffInDays === 1 ? "d" : "d";
      } else {
        const timeDiffInYears = Math.floor(timeDiffInDays / 365);
        number = timeDiffInYears;
        unit = timeDiffInYears === 1 ? "yr" : "yr";
      }
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ marginRight: 2 }}>{number} </Text>
      <Text style={{}}>{unit}</Text>
    </View>
  );
}

//check if valid url
export function isValidUrl(url) {
  // Regular expression pattern for URL validation
  const urlPattern =
    /^(?:https?|ftp):\/\/(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\/(?:[^\s/]*))?$/;

  // Test the URL against the pattern
  return urlPattern.test(url);
}

//format number to condensed form
export function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number >= 1000 && number < 100000) {
    const roundedNumber = (number / 1000).toFixed(1);
    return roundedNumber.toString() + "k";
  } else if (number >= 100000 && number < 1000000) {
    const roundedNumber = Math.round(number / 1000);
    return roundedNumber.toString() + "k";
  } else if (number >= 1000000) {
    const roundedNumber = (number / 1000000).toFixed(1);
    return roundedNumber.toString() + "m";
  }
}

export const RenderText = ({ colors, body, instance, textColor, fontSize }) => {
  //fonts
  const { chosenFont_ExtraBold, chosenFont_Bold, chosenFont_Regular } =
    useFont();

  if (!body) return null;

  //this is needed to make the spoiler functionality work
  const prerender = (body) => {
    // Apply superscript formatting
    let processed = body.replace(/\^([^\^]+)\^/g, "<sup>$1</sup>");

    // Apply strikethrough formatting, important if using similar markers as subscript
    processed = processed.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // Apply subscript formatting, adjusted to not conflict with strikethrough
    processed = processed.replace(
      /(?<!~)~(?!~)([^~]+)(?<!~)~(?!~)/g,
      "<sub>$1</sub>"
    );

    // handle links to users
    processed = processed.replace(
      /\[@(\w+)@(\w+\.\w+)\]\(https?:\/\/\S+\)/g,
      "[$1](https://quiblr.com/instance/" +
        extractWebsiteName(instance) +
        "/user/" +
        "$2" +
        "/$1)"
    );

    // handle directs to users
    processed = processed.replace(
      /@(\w+)@(\w+\.\w+)/g,
      "[$1](https://quiblr.com/instance/" +
        extractWebsiteName(instance) +
        "/user/" +
        "$2" +
        "/$1)"
    );

    // handle links to users
    processed = processed.replace(
      /@(\w+)@(\w+\.\w+)/g,
      "[$1](https://quiblr.com/instance/" +
        extractWebsiteName(instance) +
        "/user/" +
        "$2" +
        "/$1)"
    );

    // handle links to communities
    processed = processed.replace(
      /!(\w+)@(\w+\.\w+)/g,
      "[$1](https://quiblr.com/instance/" +
        extractWebsiteName(instance) +
        "/community/" +
        "$2" +
        "/$1)"
    );

    //update post links to direct to quiblr
    processed = processed.replace(
      /(https:\/\/)(\w+\.\w+)(\/post\/)(\d+)/g,
      "$1quiblr.com/instance/$2$3$4/"
    );

    //update comment links to direct to quiblr
    processed = processed.replace(
      /(https:\/\/)(\w+\.\w+)(\/comment\/)(\d+)/g,
      "$1quiblr.com/instance/$2$3$4/"
    );

    // Replace custom spoiler syntax with details and summary tags
    processed = processed.replace(
      /::: ?spoiler ([\s\S]*?)\n([\s\S]*?):::/g,
      (match, p1, p2) => {
        // Convert Markdown links to HTML <a> tags, excluding image URLs
        let contentProcessed = p2.replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)(?<!\.(jpg|jpeg|png|gif))\)/g,
          '<a href="$2">$1</a>'
        );

        // Initialize variables for list processing
        let finalContent = "";
        let listItems = contentProcessed
          .split("\n")
          .map((line) => line.trimStart());
        let inOrderedList = false;
        let inUnorderedList = false;

        listItems.forEach((line) => {
          if (line.match(/^\d+\./)) {
            // Ordered list items
            if (!inOrderedList) {
              finalContent += inUnorderedList ? "</ul>" : "";
              inUnorderedList = false;
              finalContent += "<ol>";
              inOrderedList = true;
            }
            finalContent += `<li>${line.replace(/^\d+\.\s*/, "")}</li>`;
          } else if (line.startsWith("*")) {
            // Unordered list items
            if (!inUnorderedList) {
              finalContent += inOrderedList ? "</ol>" : "";
              inOrderedList = false;
              finalContent += "<ul>";
              inUnorderedList = true;
            }
            finalContent += `<li>${line.substring(1).trim()}</li>`;
          } else {
            // Non-list items
            if (inOrderedList) {
              finalContent += "</ol>";
              inOrderedList = false;
            }
            if (inUnorderedList) {
              finalContent += "</ul>";
              inUnorderedList = false;
            }
            finalContent += `${line}\n`;
          }
        });

        if (inOrderedList) finalContent += "</ol>";
        if (inUnorderedList) finalContent += "</ul>";

        // Return the formatted content within <details> and <summary>
        return `<details style="color:${
          colors.greyShade5
        };font-family:${chosenFont_Regular};font-size:${
          14 + fontSize
        }px"><summary style="color:${
          colors.greyShade5
        };font-family:${chosenFont_Bold};font-size:${
          14 + fontSize
        }px">${p1}</summary>${finalContent}</details>\n`;
      }
    );

    return processed;
  };

  if (Platform.OS == "ios" || Platform.OS == "android") {
    return;
  }
  if (Platform.OS !== "ios" || Platform.OS !== "android") {
    return (
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        rehypePlugins={[rehypeRaw]}
        children={prerender(body)}
        //children={body}
        components={{
          // a: CustomLinkRenderer,
          p(props) {
            const { node, ...rest } = props;
            return (
              <p
                style={{
                  fontFamily: chosenFont_Regular,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 14 + fontSize,
                  flexWrap: "wrap",
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          strong(props) {
            const { node, ...rest } = props;
            return (
              <strong
                style={{
                  fontFamily: chosenFont_Bold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 14 + fontSize,
                  lineHeight: 1.45,
                  flexWrap: "wrap",
                }}
                {...rest}
              />
            );
          },
          code(props) {
            const { node, ...rest } = props;
            return (
              <Text
                style={{
                  fontFamily: chosenFont_Regular,
                  color: "orange",
                  backgroundColor: colors.lightGreyShade2,
                  fontSize: 14 + fontSize,
                  flexWrap: "wrap",
                }}
                {...rest}
              />
            );
          },
          h1(props) {
            const { node, ...rest } = props;
            return (
              <h1
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 18 + fontSize,
                  // lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          h2(props) {
            const { node, ...rest } = props;
            return (
              <h2
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 17 + fontSize,
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          h3(props) {
            const { node, ...rest } = props;
            return (
              <h3
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 16 + fontSize,
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          h4(props) {
            const { node, ...rest } = props;
            return (
              <h4
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 15 + fontSize,
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          h5(props) {
            const { node, ...rest } = props;
            return (
              <h5
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 14 + fontSize,
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          h6(props) {
            const { node, ...rest } = props;
            return (
              <h6
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 13 + fontSize,
                  lineHeight: 1.45,
                }}
                {...rest}
              />
            );
          },
          a(props) {
            const { node, ...rest } = props;
            return (
              <a
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: textColor ? textColor : colors.blueShade2,
                  textDecorationLine: "underline",
                  fontSize: 14 + fontSize,
                  lineHeight: 1.45,
                  flexWrap: "wrap",
                }}
                {...rest}
              />
            );
          },
          img(props) {
            const { node, ...rest } = props;
            return (
              <img
                style={{
                  objectFit: "contain",
                  backgroundColor: "black",
                  aspectRatio: 1,
                  maxHeight: 300,
                  maxWidth: "100%",
                  marginVertical: 5,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
                {...rest}
              />
            );
          },
          li(props) {
            const { node, ...rest } = props;
            return (
              <li
                style={{
                  fontFamily: chosenFont_Regular,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 14 + fontSize,
                  lineHeight: 1.45,
                  flexWrap: "wrap",
                }}
                {...rest}
              />
            );
          },
          table(props) {
            const { node, ...rest } = props;
            return (
              <table
                style={{
                  borderCollapse: "collapse",
                  fontFamily: chosenFont_Regular,
                  color: textColor ? textColor : colors.greyShade5,
                  fontSize: 14 + fontSize,
                  textAlign: "center",
                }}
                {...rest}
              />
            );
          },
          th(props) {
            const { node, ...rest } = props;
            return (
              <th
                style={{
                  border: "1px solid " + colors.black,
                  padding: "8px",
                  textAlign: "center",
                }}
                {...rest}
              />
            );
          },
          td(props) {
            const { node, ...rest } = props;
            return (
              <td
                style={{
                  border: "1px solid " + colors.black,
                  padding: "8px",
                  textAlign: "center",
                }}
                {...rest}
              />
            );
          },
          hr(props) {
            const { node, ...rest } = props;
            return (
              <hr
                style={{
                  border: "none",
                  height: "2px",
                  backgroundColor: colors.black,
                  margin: "20px 0",
                }}
                {...rest}
              />
            );
          },

          blockquote(props) {
            const { node, ...rest } = props;
            return (
              <View
                style={{
                  justifyItems: "center",
                  backgroundColor: textColor
                    ? colors.blueShade3
                    : colors.lightGreyShade2,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  flex: 1,
                  borderLeftWidth: 5,
                  borderColor: textColor ? colors.darkBlue : colors.greyShade3,
                  marginVertical: 3,
                }}
              >
                <blockquote
                  style={{
                    fontFamily: chosenFont_Regular,
                    color: textColor ? textColor : colors.greyShade5,
                    fontStyle: "italic",
                    fontSize: 14 + fontSize,
                    lineHeight: 1.45,
                    flexWrap: "wrap",
                    overflowWrap: "break-word",
                  }}
                  {...rest}
                />
              </View>
            );
          },
        }}
      />
    );
  }
};

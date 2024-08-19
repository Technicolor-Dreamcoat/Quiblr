import React, { createContext, useEffect, useState } from "react";
import { LemmyHttp } from "lemmy-js-client";
import { connect, useDispatch } from "react-redux";
import { updateItem } from "../redux/actions";
export const LemmyAPIContext = createContext(undefined);

const LemmyAPIProviderPreMap = ({
  instance,
  children,
  jwtRedux,
  personDetailsRedux,
  reduxInstance,
}) => {
  const [client, setClient] = useState(reduxInstance);
  const [jwt, setJwt] = useState(null);
  const [signedInUserInfo, setSignedInUserInfo] = useState(null);
  const [loggedInInstance, setLoggedInInstance] = useState(instance);
  const [showConsoleLog, setShowConsoleLog] = useState(false);
  const [instanceDetail, setInstanceDetail] = useState("");

  //Define dispatch for redux
  const dispatch = useDispatch();

  useEffect(() => {
    jwtRedux?.length > 0 && setJwt(jwtRedux);
    personDetailsRedux && setSignedInUserInfo(personDetailsRedux);
  }, []);

  //update redux
  useEffect(() => {
    async function updateinfo(jwt) {
      dispatch(updateItem("jwtRedux", jwt));
      dispatch(updateItem("personDetailsRedux", signedInUserInfo));
      dispatch(
        updateItem(
          "blurNSFWSettings",
          instanceDetail?.my_user?.local_user_view?.local_user?.blur_nsfw
        )
      );
      dispatch(
        updateItem(
          "openInSeparateTab",
          instanceDetail?.my_user?.local_user_view?.local_user
            ?.open_links_in_new_tab
        )
      );
      dispatch(
        updateItem(
          "showNSFWSettings",
          instanceDetail?.my_user?.local_user_view?.local_user?.show_nsfw
        )
      );
      !jwt?.length > 0 && getSite();
      jwt?.length > 0 && getSite(jwt);
      //need to run this twice... running with delay catches login for some reason...
      setTimeout(() => {
        jwt?.length > 0 && getSite(jwt);
      }, 3000);
    }
    updateinfo(jwt);
  }, [jwt, signedInUserInfo, client]);

  const blockCommunity = async (options) => {
    showConsoleLog && console.log("blockCommunity");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.blockCommunity({ ...options, auth: jwt });
    return response;
  };

  const changeInstance = async (instanceName) => {
    showConsoleLog && console.log("changeInstance");
    const newClient = new LemmyHttp(instanceName, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    dispatch(updateItem("instance", instanceName));
    setClient(newClient);
  };

  const createComment = async (options) => {
    showConsoleLog && console.log("createComment");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.createComment({ ...options, auth: jwt });
    return response;
  };

  const createPost = async (options) => {
    showConsoleLog && console.log("createPost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.createPost({ ...options, auth: jwt });
    return response;
  };

  const deleteComment = async (options) => {
    showConsoleLog && console.log("deleteComment");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.deleteComment({ ...options, auth: jwt });
    return response;
  };

  const deleteImage = async (options) => {
    showConsoleLog && console.log("deleteImage");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.deleteImage({ ...options, auth: jwt });
    return response;
  };

  const deletePost = async (options) => {
    showConsoleLog && console.log("deletePost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.deletePost({
      ...options,
      auth: jwt,
      deleted: true,
    });
    return response;
  };

  const editComment = async (options) => {
    showConsoleLog && console.log("editComment");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.editComment({ ...options, auth: jwt });
    return response;
  };

  const editPost = async (options) => {
    showConsoleLog && console.log("editPost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.editPost({ ...options, auth: jwt });
    return response;
  };

  const followCommunity = async (options) => {
    showConsoleLog && console.log("followCommunity");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.followCommunity({ ...options, auth: jwt });
    return response;
  };

  const getComments = async (
    postId,
    instanceURL,
    sortComments,
    max_depth,
    limit
  ) => {
    showConsoleLog && console.log("getComments");
    try {
      const newClient = new LemmyHttp(instanceURL, {
        mode: "no-cors",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
      });

      const response = await newClient.getComments({
        post_id: postId,
        max_depth: max_depth,
        sort: sortComments,
        type_: "All",
        limit: limit,
        auth: jwt,
      });
      return response;
    } catch (e) {
      throw new Error("Error fetching comments");
    }
  };

  const getSingleCommentThread = async (
    commentId,
    instanceURL,
    max_depth,
    limit
  ) => {
    showConsoleLog && console.log("getSingleCommentThread");
    try {
      const newClient = new LemmyHttp(instanceURL, {
        mode: "no-cors",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
      });

      const response = await newClient.getComments({
        parent_id: commentId,
        max_depth: max_depth,
        type_: "All",
        limit: limit,
        auth: jwt,
      });
      return response;
    } catch (e) {
      throw new Error("Error fetching comments");
    }
  };

  const getCommunity = async (chosenInstance, options) => {
    showConsoleLog && console.log("getCommunity");
    const newClient = new LemmyHttp(chosenInstance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getCommunity({ ...options, auth: jwt });
    return response;
  };

  const getFederatedInstances = async (options) => {
    showConsoleLog && console.log("getFederatedInstances");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getFederatedInstances({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const getOtherUserDetails = async (chosenInstance, options) => {
    showConsoleLog && console.log("getOtherUserDetails");
    const newClient = new LemmyHttp(chosenInstance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getPersonDetails({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const getPersonDetails = async (options) => {
    showConsoleLog && console.log("getPersonDetails");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getPersonDetails({
      ...options,
      auth: jwt,
    });

    setSignedInUserInfo(response);
    return response;
  };

  const getPersonMentions = async (options) => {
    showConsoleLog && console.log("getPersonMentions");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getPersonMentions({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const getPost = async (postId, instanceURL) => {
    showConsoleLog && console.log("getPost");

    try {
      const newClient = new LemmyHttp(instanceURL, {
        mode: "no-cors",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
      });

      const response = await newClient.getPost({
        id: postId,
        auth: jwt,
      });
      return response;
    } catch (e) {
      throw new Error("Error fetching post");
    }
  };

  const getComment = async (commentId, instanceURL) => {
    showConsoleLog && console.log("getComment");

    try {
      const newClient = new LemmyHttp(instanceURL, {
        mode: "no-cors",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
      });

      const response = await newClient.getComment({
        id: commentId,
        auth: jwt,
      });
      return response;
    } catch (e) {}
  };

  const getPosts = async (chosenInstance, options) => {
    showConsoleLog && console.log("getPosts");

    const checkChosenInstance =
      chosenInstance?.length > 0 ? chosenInstance : reduxInstance;
    const newClient = new LemmyHttp(checkChosenInstance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.getPosts({ ...options, auth: jwt });
    return response;
  };

  const getReplies = async (options) => {
    showConsoleLog && console.log("getReplies");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.getReplies({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const getSite = async (auth) => {
    showConsoleLog && console.log("getSite");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: auth ? { Authorization: `Bearer ${auth}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.getSite({ auth: auth });
    response && setInstanceDetail(response);
    return response;
  };

  const language = async (options) => {
    showConsoleLog && console.log("language");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.language({ ...options, auth: jwt });
    return response;
  };

  const likeComment = async (options) => {
    showConsoleLog && console.log("likeComment");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.likeComment({ ...options, auth: jwt });
    return response;
  };

  const likePost = async (options) => {
    showConsoleLog && console.log("likePost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;

    const response = await newClient.likePost({ ...options, auth: jwt });
    return response;
  };

  const listCommunities = async (options) => {
    showConsoleLog && console.log("listCommunities");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.listCommunities({ ...options, auth: jwt });
    return response;
  };

  const localUser = async (options) => {
    showConsoleLog && console.log("localUser");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.leaveAdmin({ ...options, auth: jwt });
    return response;
  };

  const login = async (
    username_or_email,
    password,
    nonReduxInstance,
    totp_2fa_token
  ) => {
    showConsoleLog && console.log("login");
    //dont login if no instance
    if (!client) return;

    try {
      const newClient = new LemmyHttp(nonReduxInstance, {
        mode: "no-cors",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
      });
      //set instance
      setLoggedInInstance(nonReduxInstance);

      const response = await newClient.login({
        username_or_email: username_or_email,
        password: password,
        totp_2fa_token: totp_2fa_token,
      });
      if (response.jwt) {
        const personDetails = await newClient.getPersonDetails({
          username: username_or_email,
        });
        setJwt(response.jwt);
        //set user info (which will be accessed globally)
        setSignedInUserInfo(personDetails);
        dispatch(updateItem("personDetailsRedux", response));
        dispatch(updateItem("instance", nonReduxInstance));
        //set jwt (which will be accessed globally)
      }
      return response;
    } catch (e) {}
  };

  const logout = async () => {
    showConsoleLog && console.log("logout");
    setJwt(null);
    dispatch(updateItem("jwtRedux", ""));
    dispatch(updateItem("personDetailsRedux", ""));
    dispatch(updateItem("viewedCommunitiesIcon", []));
    dispatch(updateItem("viewedCommunities", []));
    dispatch(updateItem("viewedCommunitiesAPIName", []));
    dispatch(updateItem("viewedCommunitiesId", []));
    dispatch(updateItem("allViewedCommunitiesInfo", []));
    dispatch(updateItem("listing", "All"));
    const newClient = new LemmyHttp(reduxInstance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    const response = await newClient.logout({ auth: jwt });
    getSite();
    return response;
  };

  const markAllAsRead = async (options) => {
    showConsoleLog && console.log("savePost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.markAllAsRead({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const markCommentReplyAsRead = async (options) => {
    showConsoleLog && console.log("markCommentReplyAsRead");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.markCommentReplyAsRead({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const saveComment = async (options) => {
    showConsoleLog && console.log("saveComment");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.saveComment({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const savePost = async (options) => {
    showConsoleLog && console.log("savePost");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.savePost({
      ...options,
      auth: jwt,
    });
    return response;
  };

  const saveUserSettings = async (options) => {
    showConsoleLog && console.log("saveUserSettings");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.saveUserSettings({
      ...options,
      auth: jwt,
    });
    await getSite(jwt);
    return response;
  };

  const search = async (options) => {
    showConsoleLog && console.log("search");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.search({ ...options, auth: jwt });
    return response;
  };

  const uploadImage = async (options) => {
    showConsoleLog && console.log("uploadImage");
    const newClient = new LemmyHttp(instance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.uploadImage({ ...options, auth: jwt });
    return response;
  };

  const passwordReset = async (chosenInstance, options) => {
    showConsoleLog && console.log("uploadImage");
    const newClient = new LemmyHttp(chosenInstance, {
      mode: "no-cors",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    if (!newClient) return null;
    const response = await newClient.passwordReset({ ...options, auth: jwt });
    return response;
  };

  return (
    <LemmyAPIContext.Provider
      value={{
        client,
        jwt,
        signedInUserInfo,
        login,
        logout,
        getPosts,
        deletePost,
        getPost,
        getCommunity,
        getComment,
        getComments,
        getSingleCommentThread,
        search,
        localUser,
        getPersonDetails,
        listCommunities,
        createComment,
        followCommunity,
        likePost,
        likeComment,
        getSite,
        getFederatedInstances,
        language,
        editComment,
        deleteComment,
        blockCommunity,
        saveUserSettings,
        changeInstance,
        uploadImage,
        deleteImage,
        createPost,
        editPost,
        getOtherUserDetails,
        getReplies,
        getPersonMentions,
        markCommentReplyAsRead,
        saveComment,
        savePost,
        markAllAsRead,
        instanceDetail,
        setSignedInUserInfo,
        passwordReset,
      }}
    >
      {children}
    </LemmyAPIContext.Provider>
  );
};
const mapStateToProps = (state) => {
  return {
    jwtRedux: state.updateItem.reduxGlobal.jwtRedux,
    personDetailsRedux: state.updateItem.reduxGlobal.personDetailsRedux,
    reduxInstance: state.updateItem.reduxGlobal.instance,
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
  };
};
export const LemmyAPIProvider = connect(mapStateToProps)(
  LemmyAPIProviderPreMap
);

import React, { useState } from "react";
import { Image, Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import { TextInput } from "react-native";
import useInput from "../hooks/useInput";

export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: String!, $text: String!) {
    addComment(postId: $postId, text: $text){
      text
    }
  }
`;

const Container = styled.View`
  margin-bottom: 40px;
`;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
  font-weight: 500;
`;
const Location = styled.Text`
  font-size: 12px;
`;
const IconsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;
const IconContainer = styled.View`
  margin-right: 10px;
`;
const InfoContainer = styled.View`
  padding: 10px;
`;
const Caption = styled.Text`
  margin: 5px 0px;
`;
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`;

const Post = ({
  id,
  user,
  location,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  isLiked: isLikedProp,
  navigation,
  comment,
  refresh2
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [showComments, setShowComments] = useState(false);
  const toggleLikeMutaton = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id
    }
  });

  const addCommentMutation = useMutation(ADD_COMMENT, {
    variables: {
      postId: id
      , text: comment.value
    }
  });



  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await toggleLikeMutaton();
    } catch (e) {}
  };

  const handleComments = () => {
    setShowComments(!showComments);
  }

  const onSubmitEditing = async () => {

    try {
      const {
        data: { addComment }
      } = await addCommentMutation();
      comment.setValue("");
      await refresh2();
    } catch(error) {
      console.log(error);
    }

  };

  return (
    <Container>
      <Header>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.name })
          }
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.name })
          }
        >
          <HeaderUserContainer>
            <Bold>{user.name}</Bold>
            <Location>{location}</Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
      <Swiper
        showsPagination={false}
        style={{ height: constants.height / 2.5 }}
      >
        {files.map(file => (
          <Image
            style={{ width: constants.width, height: constants.height / 2.5 }}
            key={file.id}
            source={{ uri: file.url }}
          />
        ))}
      </Swiper>
      <InfoContainer>
        <IconsContainer>
          <Touchable onPress={handleLike}>
            <IconContainer>
              <Ionicons
                size={24}
                color={isLiked ? styles.redColor : styles.blackColor}
                name={
                  Platform.OS === "ios"
                    ? isLiked
                      ? "ios-heart"
                      : "ios-heart-empty"
                    : isLiked
                    ? "md-heart"
                    : "md-heart-empty"
                }
              />
            </IconContainer>
          </Touchable>
          <Touchable>
            <IconContainer>
              <Ionicons
                color={styles.blackColor}
                size={24}
                name={Platform.OS === "ios" ? "ios-text" : "md-text"}
              />
            </IconContainer>
          </Touchable>
        </IconsContainer>
        <Touchable>
          <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
        </Touchable>
        <Caption>
          <Bold>{user.name}</Bold> {caption}
        </Caption>
        {showComments && comments && 
          comments.map(comment => 
            <Caption key={comment.id}>
              <Bold>{comment.user.name}</Bold> {comment.text}
            </Caption>
          )
        }
        <Touchable onPress={handleComments}>
          <CommentCount>{showComments ? "Hide" : "Show"} all {comments.length} comments</CommentCount>
        </Touchable>
        <TextInput
          style={{
            width: constants.width,
            height: 40,
            backgroundColor: "#fbfbfb",
            padding: 10,
            borderRadius: 5,
            textAlign: "center"
          }}
          keyboardType="default"
          returnKeyType="send"
          placeholder="댓글달기"
          autoCapitalize="none"
          onSubmitEditing={onSubmitEditing}
          autoCorrect={true}
          value={comment.value}
          onChangeText={comment.onChange}
        />

      </InfoContainer>
    </Container>
  );
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default withNavigation(Post);

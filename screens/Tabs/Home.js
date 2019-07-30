import React, { useState, useRef } from "react";
import { ScrollView, RefreshControl } from "react-native";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import Post from "../../components/Post";
import { POST_FRAGMENT } from "../../fragments";
import useInput from "../../hooks/useInput";

export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;



export default () => {

  console.log('tabs/Home.js enter...');

  const [refreshing, setRefreshing] = useState(false);
  const [postId, setPostId] = useState("");
  const { loading, data, refetch } = useQuery(FEED_QUERY);
  const comment = useInput("");
  

  //console.log(`data : ${JSON.stringify(data, null, 2)}`);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const refresh2 = async () => {
    try {
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

  

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeFeed &&
        data.seeFeed.map(post => <Post key={post.id} {...post} comment={comment} refresh2={refresh2}/>)
      )}
    </ScrollView>
  );
};

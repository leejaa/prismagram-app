import React from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { POST_FRAGMENT } from "../fragments";
import Loader from "../components/Loader";
import Post from "../components/Post";
import { ScrollView } from "react-native";
import useInput from "../hooks/useInput";

const POST_DETAIL = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(POST_DETAIL, {
    variables: { id: navigation.getParam("id") }
  });
  
  const comment = useInput("");

  const refresh2 = async () => {
    try {
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <ScrollView>
      {loading ? (
        <Loader />
      ) : (
        data && data.seeFullPost && <Post {...data.seeFullPost} comment={comment} refresh2={refresh2} />
      )}
    </ScrollView>
  );
};

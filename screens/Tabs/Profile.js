import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";
import useInput from "../../hooks/useInput";

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
  const { loading, data } = useQuery(ME);
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
      {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} comment={comment} refresh2={refresh2}/>}
    </ScrollView>
  );
};

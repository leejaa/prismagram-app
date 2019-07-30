import React from "react";
import { ScrollView } from "react-native";
import { gql } from "apollo-boost";
import styled from "styled-components";
import Loader from "../../components/Loader"
import Messages from "../../components/Messages"
import { useQuery } from "react-apollo-hooks";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export const SEE_ROOMS = gql`
    query seeRooms {
        seeRooms{
            id
            participants{
                id
                name
                avatar
            }
            messages{
                id
                text
            }
        }
    }
`;

export default () => {

    console.log('Message.js enter...');

//    const { loading, data, error } = useQuery(SEE_ROOMS);

    const { data, loading, refetch } = useQuery(SEE_ROOMS);

    console.log(`loading : ${loading}`);

    console.log(`data : ${JSON.stringify(data)}`);

    return (
        <View>
          {loading ? (
            <Loader />
          ) : (
            data && data.seeRooms && 
                <Messages seeRooms={data.seeRooms}/>
          )}
        </View>
      );
  };

import React, { useState } from "react";
import styled from "styled-components";
import { Image, View, TouchableHighlight, FlatList, StyleSheet } from "react-native";
import { List, ListItem } from 'react-native-elements'
import PropTypes from "prop-types";

const Text = styled.Text``;

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
    },  
    item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,  
    },  
})

const Messages = ({
    seeRooms
}) => {
    
    let list = [];
    seeRooms.map(seeRoom => {
        seeRoom.key = seeRoom.id;
        list.push(seeRoom);
    });

    console.log(`list : ${JSON.stringify(list)}`);

  return (
        // <FlatList  
        //     data={list}  
        //     renderItem={({item}) =>
        //         <Text style={styles.item}>{item.id}</Text>}
        // />

        <FlatList
        data={list}
        renderItem={({item, index, separators}) => (
            <View>
                
                <View>
                    <Text>{item.id}</Text>
                </View>
            </View>
        )}
      />
        
  );
};

// Messages.propTypes = {
//   id: PropTypes.string.isRequired,
//   participants: PropTypes.arrayOf(
//     PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//         avatar: PropTypes.string.isRequired
//     })
//   ),
//   messages: PropTypes.arrayOf(
//     PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         text: PropTypes.string.isRequired
//     })
//   )
// };
export default Messages;

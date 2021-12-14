
import React, { memo } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { ActionTypes } from '../Redux/Constants';

 const ActionButton = React.memo(function ActionButton({ onClick, count }) {
    console.log('rendering...')
    return (
        <View style={{ width: 200, height: 50, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            <TouchableOpacity onPress={onClick}>
                <Text>OK</Text>
            </TouchableOpacity>
        </View>
    )
})
export default ActionButton

/**
 *  console.log('rendering...')
    return (
        <View style={{width:200,height:50,backgroundColor:'blue',justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
            <TouchableOpacity>
                <Text>OK</Text>
            </TouchableOpacity>
        </View>
    )
 */
import { View, Button } from "react-native";
import React from 'react'
export default function Category({ navigation }) {
    return (
        <View>
            <Button
                title='sport'
                onPress={() => navigation.push('home', { kind: 'sport' })}
            />
        </View>
    )
}
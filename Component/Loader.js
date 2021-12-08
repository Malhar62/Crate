import { ActivityIndicator, View } from "react-native";
import React from 'react'

export default function Loader() {
    return (
        <View style={{ flex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(52,52,52,0.5)' }}>
            <ActivityIndicator
                size={large}
                color={'navy'}
            />
        </View>
    )
}
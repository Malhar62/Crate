import React from 'react';
import { View, Text, Animated } from 'react-native'

const BottomMessage = React.forwardRef((props, ref) => {

    return (
        <Animated.View style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,

            height: props.Anime.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 70],
                extrapolate: 'clamp'
            }),
            backgroundColor: 'rgba(52,52,52,1)', alignItems: 'center',
        }}>
            <Text style={{ fontSize: 20, color: '#fff' }}>{props.text}</Text>
        </Animated.View>
    )
}
)
export default BottomMessage;
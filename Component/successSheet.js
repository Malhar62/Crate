import React from 'react';
import { View, ActivityIndicator, Text, Animated } from 'react-native';
import { Modalize } from 'react-native-modalize';
import RBSheet from "react-native-raw-bottom-sheet";
import { vh, vw } from './Scale';

const SuccessSheet = React.forwardRef((props, ref) => {
    const modalizeRef = React.createRef < Modalize > (null);
    const animatedValue = props.animatedValue;
    return (
        <RBSheet
            ref={ref}
            height={props.height}
            openDuration={250}
            closeOnPressBack={true}
            closeOnPressMask={true}
            draggableIcon={true}
            dragFromTopOnly={true}

            customStyles={{
                draggableIcon: {
                    color: 'red'
                },
                container: {
                    ...props.style,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopEndRadius: 10,
                    borderTopStartRadius: 10,
                }
            }}
            onClose={props.closing}
            onOpen={props.opening}
        >
            <Animated.Image
                source={require('../Images/success.png')}
                style={{
                    width: vw(100), height: vh(120),
                    transform: [
                        {
                            rotate: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        },
                        {
                            scale: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }
                    ],
                }}
            />
            <Text style={{ fontFamily: 'rayjoe', fontSize: 18, marginTop: 20 }}>{props.title}</Text>
            {/* //{props.data} */}
        </RBSheet>
    );
});
export default SuccessSheet;

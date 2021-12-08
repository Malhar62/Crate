import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import RBSheet from "react-native-raw-bottom-sheet";

const Sheet = React.forwardRef((props, ref) => {
    const modalizeRef = React.createRef < Modalize > (null);
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
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopEndRadius: 10,
                    borderTopStartRadius: 10
                }
            }}

        >
            <props.data />
            {/* //{props.data} */}
        </RBSheet>
    );
});
export default Sheet;

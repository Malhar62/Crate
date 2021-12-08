import React from "react";
import { View, TouchableHighlight, TouchableOpacity, Button, FlatList, Image, Dimensions, Text, PermissionsAndroid } from "react-native";
import Share from 'react-native-share';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from "react-redux";
import { CrateAction } from "../Redux/Actions/CrateAction";
import { vh } from "../Component/Scale";

function ShareScreen() {
    const [img, setImg] = React.useState([])
    const requestCameraPermission = async (callback) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
                callback()
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const onShare = (urls, callback) => {
        Share.open({
            message: `This has been shared with you from Saga. Follow the link to view! `,
            urls: urls
        })
            .then((result) => { console.log('result', result); callback() })
            .catch((errorMsg) => { console.log(errorMsg), callback() });
    }
    console.log(img)

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                data={img}
                key='#'
                numColumns={3}
                contentContainerStyle={{ alignSelf: 'center' }}
                renderItem={({ item, index }) => (
                    <View style={{ marginHorizontal: 5 }}>
                        <Image
                            resizeMode='cover'
                            source={{ uri: item.path }}
                            style={{ width: Dimensions.get('screen').width / 3, height: 150 }}
                        />
                    </View>
                )}
                ListEmptyComponent={<View>
                    <Text>Nothing Selected....</Text>
                </View>}
            />
            <View style={{
                position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: '#ed682f',
                height: vh(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5
            }}>
                {/* <Button title='ADD'
                    onPress={() => {
                        // var dupli = img.map((item) => {
                        //     return item.path
                        // })
                        // onShare(dupli, () => {
                        //     setImg([])
                        // })
                    }}
                /> */}
                <TouchableOpacity >
                    <Text style={{ fontSize: 18, opacity: img.length > 0 ? 1 : 0.5 }}>ADD PHOTOS</Text>
                </TouchableOpacity>
            </View>
            <TouchableHighlight
                onPress={() => {
                    ImagePicker.openPicker({
                        multiple: true
                    }).then(images => {
                        console.log('response-->', images);
                        if (img.length) {
                            var array = [...img, ...images]
                            setImg(array)
                            console.log('here')
                        } else {
                            setImg(images)
                        }
                    });
                }}
                style={{ position: 'absolute', bottom: 50, right: 10 }}
            >
                <Image
                    source={{ uri: 'https://picaflor-azul.com/images/plus-circle1.png' }}
                    style={{ width: 50, height: 50 }}
                />
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => {
                    requestCameraPermission(() => {
                        ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                        }).then(images => {
                            console.log(images)
                        });
                    })
                    // getAddressFromCoordinates(37.785834, -122.406417)
                }}
                style={{ position: 'absolute', bottom: 50, left: 10 }}
            >
                <Image
                    source={{ uri: 'https://image.similarpng.com/thumbnail/2020/08/Digital-camera-Premium-Vector-PNG.png' }}
                    style={{ width: 50, height: 50 }}
                />
            </TouchableHighlight>
        </View>
    )
}
const mapStateToProps = (state) => ({
    photos: state.crateDetailReducer.photos
})
const mapDispatchToProps = (dispatch) => ({
    addPhoto: (data) => {
        dispatch(CrateAction.addPhoto)(data);
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ShareScreen)
/**
 * {"height": 1280,
 *  "mime": "image/jpeg",
 *  "modificationDate": "1638427563000",
 *  "path": "file:///storage/emulated/0/DCIM/Camera/IMG_20211202_121521.jpg",
 *  "size": 198831,
 *  "width": 960}]
 */
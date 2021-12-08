
import React from 'react';
import { TouchableOpacity, View, Text, FlatList, Image, Dimensions, PermissionsAndroid, TouchableWithoutFeedback, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { CrateAction } from '../Redux/Actions/CrateAction';
import ImagePicker from 'react-native-image-crop-picker';
import { vw, vh } from '../Component/Scale';

function ImageScreen(props) {
    const { route, navigation, photos, addPhoto, addCrate, emptyName, removePhoto, editCratePhoto } = props
    const ID = route.params.id;
    const isFocused = useIsFocused()

    React.useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to go back?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "YES", onPress: () => {
                        emptyName(),
                            navigation.goBack()
                    }
                }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    function backButtonHandler() {
        Alert.alert(
            "Are you sure?",
            "Your selected photos will be lost!",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => ConfirmBack }
            ]
        );
    }
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
    function OpenGallery() {
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            console.log('response-->', images);
            let temp = images.map((item) => {
                let obj = {
                    ...item,
                    kind: 'gallery',
                }
                return obj;
            })
            temp.forEach(element => {
                addPhoto(element, () => { })
            });
        })
    }
    console.log(photos)
    function OpenCamera() {
        requestCameraPermission(() => {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            }).then(images => {
                console.log(images)
                let obj = {
                    ...images,
                    kind: 'camera',
                }
                addPhoto(obj, () => { })
            });
        })
    }
    function AddIcon() {
        return (
            <View style={{ backgroundColor: '#e64ca5', alignSelf: 'flex-end', width: vw(100), height: vh(30), justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 5 }}>
                <TouchableOpacity onPress={() => {
                    if (route.params.tag == 'gallery') {
                        OpenGallery()
                    } else {
                        requestCameraPermission(() => {
                            OpenCamera()
                        })
                    }
                }}>
                    <Text style={{ color: '#fff' }}>+ ADD MORE</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, marginHorizontal: 0 }}>
            <AddIcon />
            <FlatList
                data={photos}
                numColumns={3}
                renderItem={({ item, index }) => (
                    <View style={{ width: Dimensions.get('screen').width / 3, height: vh(220), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Image
                            source={{ uri: item.path }}
                            style={{ width: vw(120), height: vh(200) }}
                        />

                        <View style={{ overflow: 'visible', position: 'absolute', right: 0, top: 0, width: 20, height: 20, borderRadius: 10 }}>
                            <TouchableWithoutFeedback
                                style={{}}
                                onPress={() => {
                                    removePhoto(index)
                                }}>
                                <Image
                                    source={require('../Images/cancel.png')}
                                    style={{ width: 20, height: 20, borderRadius: 10 }}
                                    resizeMode='contain'
                                />
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                )}
                keyExtractor={index => index + Math.random()}
                contentContainerStyle={{ marginTop: 20 }}
                ItemSeparatorComponent={() =>
                    <View
                        style={{ width: 10 }}
                    />}
                ListEmptyComponent={() =>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No Photos Selected</Text>
                    </View>
                }
            />
            {photos.length != 0 ? <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, height: 50, backgroundColor: '#e65517', borderRadius: 10 }}>
                <TouchableOpacity onPress={() => {
                    editCratePhoto(ID, () => {
                        emptyName()
                        navigation.goBack()
                    })
                }}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>SAVE</Text>
                </TouchableOpacity>
            </View> : null}
        </View>
    )
}
const mapStateToProps = (state) => ({
    photos: state.crateDetailReducer.photos
})
const mapDispatchToProps = (dispatch) => ({
    addPhoto: (data, callback) => {
        dispatch(CrateAction.addPhoto(data, callback))
    },
    addCrate: (callback) => {
        dispatch(CrateAction.addCrate(callback))
    },
    emptyName: () => {
        dispatch(CrateAction.emptyName())
    },
    removePhoto: (id) => {
        dispatch(CrateAction.removePhoto(id))
    },
    editCratePhoto: (data, id, callback) => {
        dispatch(CrateAction.editCratePhoto(data, id, callback))
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(ImageScreen)
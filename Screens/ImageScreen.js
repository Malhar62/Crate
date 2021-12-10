
import React from 'react';
import { TouchableOpacity, View, Text, FlatList, Image, SafeAreaView, Dimensions, PermissionsAndroid, TouchableWithoutFeedback, Alert, BackHandler } from 'react-native';
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
            if (photos.length != 0) {
                Alert.alert("Hold on!", "Are you sure you want to go back?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    {
                        text: "YES", onPress: () => {
                            emptyName()
                            navigation.goBack()
                        }
                    }
                ]);
            } else {
                emptyName(),
                    navigation.goBack()
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
    const [deviceOrientation, setDeviceOrientation] = React.useState(Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape')
    console.log(deviceOrientation, Dimensions.get('screen').width)
    React.useEffect(() => {
        const deviceOrientation = () => {
            if (Dimensions.get('window').width < Dimensions.get('window').height) {
                setDeviceOrientation('portrait');
            } else {
                setDeviceOrientation('landscape');
            }
        };
        const orientationHandler = Dimensions.addEventListener('change', deviceOrientation);
        return () => orientationHandler.remove()
    });

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
                    kind: item.mime.split('/')[0],
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
                    kind: 'image',
                }
                addPhoto(obj, () => { })
            });
        })
    }
    function AddIcon() {
        return (
            <View style={{ backgroundColor: '#2e39b3', position: 'absolute', right: 0, top: 10, borderRadius: 5, marginHorizontal: 5 }}>
                <TouchableOpacity onPress={() => {
                    if (route.params.tag == 'gallery') {
                        OpenGallery()
                    } else {
                        requestCameraPermission(() => {
                            OpenCamera()
                        })
                    }
                }}>
                    <Text style={{ color: '#fff', marginVertical: 5, marginHorizontal: 5 }}>+ ADD MORE</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const renderItem = React.useCallback(({ item, index }) => {
        return (
            <View style={{ width: deviceOrientation == 'portrait' ? Dimensions.get('screen').width / 3 : vw(270), justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Image
                    source={{ uri: item.path }}
                    style={{ width: deviceOrientation == 'portrait' ? vw(120) : vw(250), height: deviceOrientation == 'portrait' ? vh(200) : vh(250) }}
                />
                <View style={{ overflow: 'visible', position: 'absolute', right: -1, top: -1, width: 20, height: 20, borderRadius: 10 }}>
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
                {item.kind == 'video' &&
                    <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../Images/play.png')}
                            style={{ width: vw(30), height: vh(30) }}
                        />
                    </View>
                }
            </View>
        )
    }, [deviceOrientation])
    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: 0 }}>
            <FlatList
                data={photos}
                numColumns={3}
                renderItem={renderItem}
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
            {photos.length != 0 ? <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, height: 50, backgroundColor: '#424fdb', borderRadius: 10 }}>
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
            <AddIcon />
        </SafeAreaView>
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
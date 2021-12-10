import React from 'react';
import { connect } from "react-redux"
import { StatusBar, Animated, SafeAreaView, View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Linking, TouchableOpacity, Easing, Alert } from 'react-native'
import { vh, vw } from "../Component/Scale";
import { usericon } from '../Redux/Constants'
import ImageViewer from 'react-native-image-zoom-viewer';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider, renderers
} from 'react-native-popup-menu';
import Carousel from 'react-native-snap-carousel';
import { CrateAction } from '../Redux/Actions/CrateAction';
import Share from 'react-native-share';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import Sheet from '../Component/Sheet';
import { TabRouter, useIsFocused } from '@react-navigation/native';

function ViewMedia(props) {
    const { route, navigation, crates, deleteCrateItem } = props;
    const { crateId, itemId, kind } = route.params;
    const [flag, setFlag] = React.useState(false)
    var crateInd = crates.findIndex(x => x.crateId == crateId);
    var galleryArray = crates[crateInd].photos;
    var contactArray = crates[crateInd].contacts;
    var starter = kind == 'contact' ? crates[crateInd].contacts.findIndex(x => x.itemId == itemId) : crates[crateInd].photos.findIndex(x => x.itemId == itemId);
    const anime = new Animated.Value(0);
    const menuref = React.createRef()
    const isFocused = useIsFocused()
    const [currentItem, setCurrentItem] = React.useState(itemId)
    const successRef = React.createRef()
    const videoPlayer = React.createRef()

    const [deviceOrientation, setDeviceOrientation] = React.useState(Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape')

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
    // React.useEffect(() => {
    //     if (deviceOrientation == 'landscape') {
    //         if (videoPlayer.current) {
    //             videoPlayer.current.presentFullscreenPlayer();
    //         }
    //     } else {
    //         if (videoPlayer.current) {
    //             videoPlayer.current.dismissFullscreenPlayer();
    //         }
    //     }
    // }, [deviceOrientation])

    const renderGallery = React.useCallback(({ item, index }) => {
        if (item.kind == 'image') {
            if (deviceOrientation == 'portrait') {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: item.path }}
                            style={{ width: '100%', height: 400 }}
                        />
                    </View>
                )
            } else {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            resizeMode='cover'
                            source={{ uri: item.path }}
                            style={{ width: 350, height: '100%' }}
                        />
                    </View>
                )
            }
        } else {
            if (item.kind == 'video') {
                if (deviceOrientation == 'portrait') {
                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <VideoPlayer
                                ref={ref => (videoPlayer.current = ref)}
                                source={{ uri: item.path }}
                                style={{
                                    backgroundColor: 'transaprent', flex: 1, position: 'absolute', height: vh(400), width: Dimensions.get('screen').width
                                }}
                                disableFullscreen={true}
                                paused={true}
                                //controls={true}
                                toggleResizeModeOnFullscreen={true}
                                showOnStart={true}
                                repeat={true}
                            //poster={'https://static.vecteezy.com/system/resources/thumbnails/001/826/199/small/progress-loading-bar-buffering-download-upload-and-loading-icon-vector.jpg'}
                            />
                        </View>
                    )
                } else {
                    return (
                        <View style={{ flex: 1 }}>
                            <VideoPlayer
                                disableBack
                                disableVolume
                                ref={ref => (videoPlayer.current = ref)}
                                source={{ uri: item.path }}
                                style={{
                                    backgroundColor: 'transaprent', flex: 1, position: 'absolute', height: vh(400), width: Dimensions.get('screen').width
                                }}
                                disableFullscreen={true}
                                paused={true}
                                //controls={true}
                                toggleResizeModeOnFullscreen={true}
                                showOnStart={true}
                                repeat={true}
                            //poster={'https://static.vecteezy.com/system/resources/thumbnails/001/826/199/small/progress-loading-bar-buffering-download-upload-and-loading-icon-vector.jpg'}
                            />
                        </View>
                    )
                }
            }
        }
    }, [deviceOrientation])
    function ContactDetails({ label, value }) {
        return (
            <View style={styles.contactdetail}>
                <Text style={[styles.txt, { color: 'blue' }]}>{label}</Text>
                <Text style={styles.txt}>{value}</Text>
            </View>
        )
    }
    function onDelete() {
        deleteCrateItem(crateId, currentItem, kind, () => {
            if (kind == 'image' || kind == 'video') {
                crates[crateInd].photos.length ? null : navigation.goBack()
            } else {
                if (kind == 'contact') {
                    crates[crateNum].contacts.length ? null : navigation.goBack()
                } else {
                    null
                }
            }
        })
    }

    const renderCors = React.useCallback(({ item, index }) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <Image
                    resizeMode='contain'
                    source={item.photoUrl ? { uri: item.photoUrl } : usericon}
                    style={{ width: vw(200), height: vh(200) }}
                />
                <TouchableOpacity onPress={() => {
                    if (item.phoneNumbers.length != 0) {
                        Linking.openURL(`tel:${item.phoneNumbers[0].number}`)
                    } else {
                        Alert.alert('Number not available')
                    }
                }}>
                    <ContactDetails
                        label={'Name :'}
                        value={item.userName}
                    />
                    <ContactDetails
                        label={'Number :'}
                        value={item.phoneNumbers.length != 0 ? item.phoneNumbers[0].number : null}
                    />
                </TouchableOpacity>
            </View>
        )
    }, [crates])
    const onShare = (callback) => {
        let title = '';
        let message = '';
        let link = '';
        switch (kind) {
            case ('image' || 'video'):
                var sharedItem = crates[crateInd].photos.find(x => x.itemId == currentItem);
                title = `${kind} is shared to you from SAGA`;
                message = 'Open the link to view!';
                link = sharedItem.path
                break;
            case 'contact':
                var sharedItem = crates[crateInd].contacts.find(x => x.itemId == currentItem);
                title = `${kind} is shared to you from SAGA`;
                message = `${sharedItem.userName} : ${sharedItem.phoneNumbers.length != 'undefined' ? sharedItem.phoneNumbers[0].number : 'nothing'}`;
                link = null
                break;
            default:
                message = '';
                link = ''
        }

        Share.open({
            title: title,
            message: message,
            url: link
        })
            .then((result) => {
                console.log('result', result);
                if (isFocused) {
                    callback()
                }
            })
            .catch((errorMsg) => { console.log(errorMsg) });
    }
    function onSuccess() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    resizeMode='contain'
                    source={require('../Images/success.png')}
                    style={{
                        width: vw(100), height: vh(100),
                        transform: [{
                            scale: anime.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                                extrapolate: 'clamp'
                            }),
                        }]
                    }}
                />
                <Text style={{ fontSize: 18, marginTop: 5 }}>{kind.toUpperCase()} Shared Successfully !</Text>
            </View>
        )
    }
    const Dot = React.useCallback(() => {
        return (
            <View style={[styles.hdr, { width: '100%', paddingBottom: 5 }]}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Image
                        resizeMode='contain'
                        source={require('../Images/previous.png')}
                        style={styles.icon}
                    />
                </TouchableWithoutFeedback>
                <Menu ref={menuref}>
                    <MenuTrigger >
                        <Image
                            source={require('../Images/more.png')}
                            resizeMode='contain'
                            style={styles.icon}
                        />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => {
                            onShare(() => {
                                successRef.current.open();
                                setTimeout(() => {
                                    successRef.current.close();
                                }, 2000)
                            })
                        }} >
                            <Text style={{ color: 'green' }}>Share</Text>
                        </MenuOption>
                        <MenuOption onSelect={onDelete} >
                            <Text style={{ color: 'red' }}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        )
    }, [crates])
    return (
        <SafeAreaView
            onPress={() => menuref.current.close()}
            style={{ flex: 1, backgroundColor: '#a0e0f2', paddingTop: 0 }}>
            <Carousel
                //ref={sheetRef}
                layout='default'
                data={kind == 'contact' ? contactArray : galleryArray}
                renderItem={kind == 'contact' ? renderCors : renderGallery}
                onSnapToItem={(index) => {
                    if (kind == 'contact') {
                        setCurrentItem(crates[crateInd].contacts[index].itemId)
                    } else {
                        setCurrentItem(crates[crateInd].photos[index].itemId)
                    }
                }}
                firstItem={starter}
                sliderWidth={Dimensions.get('screen').width}
                itemWidth={kind == 'contact' ? vw(300) : Dimensions.get('screen').width}
                itemHeight={vh(400)}
                sliderHeight={vh(400)}
                centerContent={true}
                contentContainerCustomStyle={{ backgroundColor: 'transparent', }}
            />
            <Sheet
                ref={successRef}
                data={onSuccess}
                height={vh(250)}
                closing={() => navigation.goBack()}
                opening={() => {
                    Animated.timing(anime, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: false,
                        easing: Easing.bounce
                    }).start()
                }}
                style={{ backgroundColor: '#bbbfbf', borderTopWidth: 2, borderTopColor: 'grey' }}
            />


            <View style={{ width: '100%', height: vh(70), position: 'absolute' }}>
                <MenuProvider>
                    <Dot />
                </MenuProvider>
            </View>

        </SafeAreaView>
    )
}
const mapStateToProps = (state) => ({
    crates: state.crateReducer.crates
})
const mapDispatchToProps = (dispatch) => ({
    deleteCrateItem: (crateId, itemId, kind, callback) => {
        dispatch(CrateAction.deleteCrateItem(crateId, itemId, kind, callback))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewMedia);

const styles = StyleSheet.create({
    txt: {
        fontSize: 18,

    },
    contactdetail:
    {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10, borderBottomWidth: 0.5,
    },
    icon: {
        width: vw(30), height: vh(30)
    },
    hdr: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center',
    }
})
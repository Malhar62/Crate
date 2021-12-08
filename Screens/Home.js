import React from 'react';
import { TouchableWithoutFeedback, View, Text, FlatList, Image, Button, Animated, Dimensions } from "react-native";
import { connect } from 'react-redux';
import { fetchNews } from '../Redux/Actions/extra';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import Sheet from '../Component/Sheet';
import BottomMessage from '../Component/BottomMessage';
import save from '../Redux/Actions/extra'
function Home({ newses, fetchNews, name, route, navigation, save }) {
    const isFocused = useIsFocused()
    const sheetRef = React.createRef()
    var numlength;
    React.useEffect(() => {
        if (isFocused) {
            var str = route.params ? route.params.kind : 'general'
            fetchNews(str)
            numlength = newses.length - 2
        }
    }, [isFocused])
    function Inside() {
        return (
            <View>
                <Text>See there</Text>
            </View>
        )
    }
    const Anime = new Animated.Value(0)
    const scrolltracker = new Animated.Value(0)

    function handleScroll(event) {
        console.log(event.nativeEvent.contentOffset.y)
    }

    return (
        <TouchableWithoutFeedback onPress={() => sheetRef.current.close()}>
            <View>
                <Button
                    title='category'
                    onPress={() => {
                        // sheetRef.current.open()
                        // setTimeout(() => {
                        //     sheetRef.current.close()
                        // }, 5000)
                        //navigation.push('category')
                        Animated.timing(
                            Anime,
                            {
                                toValue: 1,
                                duration: 900,
                                useNativeDriver: false
                            }
                        ).start();
                        setTimeout(() => {
                            Animated.timing(
                                Anime,
                                {
                                    toValue: 0,
                                    duration: 1000,
                                    useNativeDriver: false
                                }
                            ).start();
                        }, 5000)
                    }}
                />
                <Animated.View
                    style={{
                        width: scrolltracker.interpolate({
                            inputRange: [0, 150 * numlength],
                            outputRange: [0, Dimensions.get('screen').width],
                            extrapolate: 'clamp'
                        }),
                        height: 10,
                        backgroundColor: 'maroon'
                    }}
                />
                <FlatList
                    data={newses}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y:
                                    scrolltracker
                            }
                        }
                    }], { useNativeDriver: false }, { listener: (event) => handleScroll(event) })}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item, index }) => (
                        <View>
                            <Image resizeMode='contain' source={{ uri: item.thumbnailUrl }} style={{ width: '100%', height: 150 }} />
                            <Text>{item.title}</Text>
                        </View>
                    )}
                />
                <Sheet
                    ref={sheetRef}
                    data={Inside}
                />
                <BottomMessage
                    Anime={Anime}
                    text='Its About Learning!'
                />
            </View>
        </TouchableWithoutFeedback>
    )
}
const mapStateToProps = state => ({
    newses: state.news.newses,
    name: state.news.name
})

const mapDispatchToPros = (dispatch) => ({
    fetchNews: (category) => dispatch(fetchNews(category)),
    save: (ad) => dispatch(save(ad))
})

export default connect(mapStateToProps, mapDispatchToPros)(Home)
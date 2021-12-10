import { Dimensions, PixelRatio } from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export var DesignHeight = 896;
// export var DesignHeight = 667;
export var DesignWidth = 414;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// It is based on the screen width of your design layouts e.g Height 600 x Width 375
const scale = SCREEN_WIDTH / 414;

export function normalize(size) {
    return PixelRatio.roundToNearestPixel(size * scale);
}

export const vw = (width) => {
    const percent = (width / DesignWidth) * 100;
    const elemWidth = parseFloat(`${percent}%`);
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const vh = (height) => {
    const percent = (height / DesignHeight) * 100;
    const elemHeight = parseFloat(`${percent}%`);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

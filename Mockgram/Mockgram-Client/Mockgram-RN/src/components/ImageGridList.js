import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

export default renderImageList = (data, deviceWidth, numberInRow, pressCallback) => {
    return data.map((image, index) => {
        return (
            <TouchableOpacity key={image._id} onPress={() => pressCallback()}>
                <View style={[
                    { width: (deviceWidth) / numberInRow },
                    { height: (deviceWidth) / numberInRow },
                    { marginBottom: 2 },
                    index % numberInRow !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
                ]}>
                    <Image
                        style={{ flex: 1, width: undefined, height: undefined }}
                        source={image.image} />
                </View>
            </TouchableOpacity>
        );
    })
}
import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default class Loader extends Component {
    render() {
        return( 
         <>
            <View style = {{ flex: 1, justifyContent: "center", alignItems: "center"}} >
              <ActivityIndicator size = "large" color = "#FF590E" />
             </View>
        </>
        )
    }
}

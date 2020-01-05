import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { withNavigation } from 'react-navigation';
import * as authToken from './authToken';
import * as Font from 'expo-font';

class AuthLoadingScreen extends Component{

constructor(props) {
        super(props);
        this.state = {
          fontLoaded:false
      };
        this._bootstrapAsync();
      }

  _bootstrapAsync = async () => {

    await Font.loadAsync({
      'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
      'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
      'SF': require('../assets/fonts/SF.ttf'),
      'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf')
     });

    const userToken = await authToken.get();
    console.log(userToken);
    this.props.navigation.navigate((userToken && userToken.length>0 ) ? 'SignedIn' : 'SignedOut');
  };

  render() {
    return (
      <>
         <View style={{ flex: 1,justifyContent:"center",alignItems:"center",}} >
            <ActivityIndicator size="large" color="#c40363" />
         </View>        
       </>
    )
  }
}


export default withNavigation(AuthLoadingScreen);

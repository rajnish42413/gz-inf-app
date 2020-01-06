import React, { Component } from 'react';
import {StyleSheet,Image} from 'react-native';
import * as Font from 'expo-font';
import createAppContainer from "./pages/route";
import * as authToken from "./pages/authToken";
import Loader from './pages/Loader';
import {createChannels} from './pages/notification'
import Axios from 'axios';

Axios.defaults.baseURL = 'http://www.genz360.com/genz360-admin/api/';
Axios.interceptors.request.use( async config => {
  const token = await authToken.get();
  if (!token) {
    return config;
  }
  if (!config.headers) {
    config.headers = {};
  }
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => {
  return Promise.reject(err);
})

Axios.interceptors.response.use(
  response => {
    return response;
  },
  async err => {
    Toast.show(err.response?.data.message ?? err.message);
    console.log(err.response?.data.message ?? err.message);
    throw err;
  }
);


export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      theme: null,
      currentTheme: null,
      isReady: false
    };
  }

 async componentDidMount() {
   await Font.loadAsync({
      GilroyExtraBold: require('./assets/fonts/Gilroy-ExtraBold.ttf'),
      GilroyLight: require('./assets/fonts/Gilroy-Light.ttf'),
      SF: require('./assets/fonts/SF.ttf'),
    });
    createChannels();
    this.setState({ isReady: true });
  }


  render(){
    const Header = createAppContainer;
     return(
       <>
       { this.state.isReady ? <Header /> : <Loader />}
       </>
     ) 
  }
}
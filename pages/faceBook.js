import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,Alert,Button} from 'react-native';
import * as Facebook from 'expo-facebook';


export default class FacebookAccess extends Component{
    constructor(){
        super()
        state={
            fbtoken:'',
        }
    }

    async logIntofb() {
        try {
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync('2104571659671346', {
            permissions: ['public_profile','email'],
          });
          if (type === 'success') {
            this.setState({fbtoken:token})
          } else {
            alert('Cancelled')
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }

      render(){

        return(
          <View>
            <Button title={'FaceBook'} onPress={()=>this.logIntofb()} />
          </View>
        )
       
      }
}
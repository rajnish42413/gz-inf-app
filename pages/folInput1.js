import React , {Component} from "react";
import {ScrollView, View, Text, TextInput ,StyleSheet ,FlatList ,TouchableOpacity ,Image,AsyncStorage} from "react-native";
import * as Font from 'expo-font';

import styles from './notifStyle';
import Loader from './Loader';
import * as authToken from "./authToken";

export default class SMH extends Component {

  constructor (props) {
    super(props);
    this.state = {
      fb:null,
      insta:null,
      yt:null,
      twitter:null,
      tokken:null,
      loaded:true
    };
}


submitinfplatform=async ()=>{
  try {
    this.setState({loaded:true});
    const token = await authToken.get();
    let response = await fetch('http://www.genz360.com:81/submitinf-platform',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fb: this.state.fb,
        insta: this.state.insta,
        yt: this.state.yt,
        twitter: this.state.twitter,
        tokken:token
      }),
    });
    let responseJson = await response.json();
    this.setState({loaded:false});
    if (responseJson.valid){
      this.props.navigation.navigate("Home");
    }
    else{
      alert(responseJson.err);
    }
  } catch (error) {
    console.log(error);
  }
}

componentDidMount(){
  Font.loadAsync({
    'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
    'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
    'SF': require('../assets/fonts/SF.ttf'),
  });
  this.setState({loaded:false})
}


  render() {
    return (
     <ScrollView >
             <View style={styles.tnc_notif_wrap}>
                <TouchableOpacity><Image /></TouchableOpacity>
                    <Text style={styles.notif_txt}>Social Media Handles</Text>
                </View>
               
           <View style={styles.wrap}>
                <Text style={styles.platname}>Facebook</Text>
                <View style={styles.inputwrap}>
                <TextInput style={styles.input}
                  placeholder="Facebook ID"
                  onChangeText={(fb) => {this.setState({fb:fb})}}
                  value={this.state.fb}
                  underlineColorAndroid="transparent"
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                />
                </View>
           </View>
          
           <View style={styles.wrap}>
               <Text style={styles.platname}>Instagram</Text>
               <View style={styles.inputwrap}>
                    <TextInput style={styles.input}
                    placeholder="Instagram Handle"
                    onChangeText={(insta) => {this.setState({insta:insta})}}
                    value={this.state.insta}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    />
               </View>
            </View>

            <View style={styles.wrap}>
               <Text style={styles.platname}>YouTube</Text>
               <View style={styles.inputwrap}>
               <TextInput style={styles.input}
               placeholder="YouTube ID"
               onChangeText={(yt) => {this.setState({yt:yt})}}
               value={this.state.yt}
               underlineColorAndroid="transparent"
               returnKeyType={'next'}
               blurOnSubmit={false}
               />
               </View>
            </View>

            <View style={styles.wrap}>
                <Text style={styles.platname}>Twitter</Text>
                <View style={styles.inputwrap}>
                <TextInput style={styles.input}
                placeholder="Twitter ID"
                onChangeText={(twitter) => {this.setState({twitter:twitter})}}
                value={this.state.twitter}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                blurOnSubmit={false}
                />
                </View>
            </View>
        

        <View style={styles.sub_notif_wrap}>
        <TouchableOpacity onPress={()=>this.submitinfplatform()}>
          <Text style={styles.sub_txt}>Submit</Text>
            <Image />
            </TouchableOpacity>
        </View>
 </ScrollView>


      );
    }
  }










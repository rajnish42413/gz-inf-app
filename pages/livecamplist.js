import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, FlatList,RefreshControl, TouchableOpacity, Image, CheckBox,AsyncStorage } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './dashstyle';
import header from './headerStyle';
import * as Font from 'expo-font';
import Loader from './Loader';
import * as authToken from "./authToken";

const Campaign = (props) => (
  <TouchableOpacity style={styles.camp_box_wrap} onPress={()=>props.navigation.navigate("CampaignDetails",{camp_id:props.item.campaign_id})} >
    <Image source={{uri:'http://www.genz360.com:81/get-image/'+props.item.image}} style={styles.camp_img} />
    <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 16, color: '#000', fontFamily: 'Gilroy-ExtraBold' }}>{props.item.name}</Text>
      <Text style={{ fontFamily: 'SF', color: '#000', fontSize: 16 }}>{props.item.platform===0?'FaceBook':props.item.platform===1?'Instagram':props.item.platform===2?'YouTube':'Twitter'}</Text>
    </View>
  </TouchableOpacity>
);

export default class LiveCampList extends Component {

  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Image source={require('../images/compass.png')} style={header.tabIcon} />
    ),
  }
  constructor(props) {
    super(props);
    this.state = {
      campaign: []
    }
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.get_campaigns();
    this.setState({refreshing: false});
  }

  _renderItem = (data, i) => (
    <View style={[{ backgroundColor: data }, styles.item]} key={i} />
  );


    get_campaigns=async ()=>{
        try {
        const token = await authToken.get();
        let response = await fetch('http://www.genz360.com:81/inf-live-campaign',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokken: token
        }),
        });

        let responseJson = await response.json();
        if (responseJson.valid){
            this.setState({campaign:responseJson.livecampaign})
        }
        else{
          alert(responseJson.err);
          }
        }  catch (error) {
        console.log(error);
        }
    }

componentDidMount(){
  this.get_campaigns();
  Font.loadAsync({
    'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
    'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
    'SF': require('../assets/fonts/SF.ttf'),
  });
  this.setState({loaded:false});
}

  _renderPlaceholder = i => <View style={styles.item} key={i} />;

  render() {
    return (
     <>
     { this.state.loaded ? <Loader/> :(
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />} 
        style={{backgroundColor:'#fff'}}>
            <View style={header.header_wrapper}>
            <View style={header.wrap}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                <Icon  style={header.backbtn} name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
            </View>
            </View>
            <ScrollView style={header.createSection_ws}>
      
                  <View style={[{paddingLeft:20,paddingTop:5}]}> 
                      <Text style={header.heading_g}>Live Campaigns</Text>
                  </View>

            <View style={{ flex: 1, paddingBottom: 20 }}>
                   { this.state.campaign.length === 0 ?
                      (
                       <View style={{flexDirection:'column',alignItems:'center',marginTop:'40%'}}>
                          <Image source={require('../images/nocamp.png')} style={{height:150,width:150}} />
                          <Text style={{fontFamily:'SF',color:'#a9a9a9',fontSize:18,marginTop:10}}>No Live Campaigns</Text>
                       </View>
                      ):   
                     <FlatList data={this.state.campaign}
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({ item }) => <Campaign item={item} navigation={this.props.navigation} />} />

                    }
            </View>
          </ScrollView>
      </ScrollView>
     )}
     </>
    );
  }
}



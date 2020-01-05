import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet,RefreshControl, FlatList, TouchableOpacity, Image,Button , CheckBox,AsyncStorage } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './dashstyle';
import header from './headerStyle';
import * as Font from 'expo-font';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from './Loader';
import * as authToken from "./authToken";

const Campaign = (props) => (

  <TouchableOpacity style={styles.camp_box_wrap} onPress={()=>props.navigation.navigate("CampaignDetails",{camp_id:props.item.campaign_id})} >
    <Image source={{uri:'http://www.genz360.com:81/get-image/'+props.item.image}} style={styles.camp_img} />
    <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ flex:1,fontSize: 16, color: '#000', fontFamily: 'Gilroy-ExtraBold',flex:0.7 }}>{props.item.name}</Text>
      
        <TouchableOpacity style={{alignSelf:'flex-start',paddingLeft:5,paddingRight:5,borderWidth:1,borderColor:'#f96d15'}}
           onPress={()=>props.navigation.navigate("CampaignDetails",{camp_id:props.item.campaign_id})}
        >
            <Text style={{fontSize:14,fontFamily:'SF',color:'#f96d15'}}>Know More</Text>
        </TouchableOpacity>
      </View>
      {
        props.item.platform===0 && props.item.subtype!=='10'?<Image source={require('../images/fb-color.png')} style={{width:20,height:20}}/> : 
      props.item.platform===1 && props.item.subtype!=='10'?<Image source={require('../images/insta-color.png')} style={{width:20,height:20}}/>  :
      props.item.platform===2 && props.item.subtype!=='10'?<Image source={require('../images/yt-color.png')} style={{width:20,height:20}}/>  :
      props.item.platform===3 && props.item.subtype!=='10'?<Image source={require('../images/twitter-color.png')} style={{width:20,height:20}}/>
      :null
      }
       <Text style={{fontFamily:'Gilroy-ExtraBold'}}>{"Payout "} : {props.item.payout_influencers1!==null?'\u20B9':null} {props.item.payout_influencers1} {props.item.payout_influencers2!==props.item.payout_influencers1 && props.item.payout_influencers2!=null?"- "+'\u20B9'+props.item.payout_influencers2:null}</Text>
    </View>
  </TouchableOpacity>

);



export default class Browse extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Image source={require('../images/compass.png')} style={header.tabIcon} />
    ),
  }
  constructor(props) {
    super(props);
    this.state = {
      campaign: [],
      loaded:true
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
  this.setState({loaded:true});
  try {
      const token = await authToken.get();
      let response = await fetch('http://www.genz360.com:81/inflivecampaign',{
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
       this.setState({campaign:responseJson.campaigns})
       console.log(responseJson.campaigns);
      }
    else{
      alert(responseJson.err);
    }
  } catch (error) {
    alert(error)
  }
  this.setState({loaded:false});
 }


componentDidMount(){
  Font.loadAsync({
    'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
    'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
    'SF': require('../assets/fonts/SF.ttf'),
  });
 this.get_campaigns();
  
}

  _renderPlaceholder = i => <View style={styles.item} key={i} />;

  render() {
    return (
      <>
      {this.state.loaded ? <Loader />: (
        <ScrollView refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />} 
        style={{backgroundColor:'#fff'}}>
            <View style={header.header_wrapper}>
            <View style={header.wrap}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Dashboard')}>
                <Icon  style={header.backbtn} name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
            </View>
            </View>
            <ScrollView style={header.createSection_ws}>
      
                  <View style={[{paddingLeft:20,paddingTop:5}]}> 
                      <Text style={header.heading_g}>Browse Campaigns</Text>
                  </View>
            <View style={{ flex: 1, paddingBottom: 20 }}>

                  {
                    this.state.campaign.length===0?
                      <View style={{flexDirection:'column',alignItems:'center',marginTop:'40%'}}>
                          <Image source={require('../images/nocamp.png')} style={{height:150,width:150}} />
                          <Text style={{fontFamily:'SF',color:'#a9a9a9',fontSize:18,marginTop:10}}>No Campaigns</Text>
                      </View>
                    :   
                    <FlatList
                      data={this.state.campaign}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => <Campaign item={item} navigation={this.props.navigation} />}
                    />

                     }

              </View>
              <View style={{paddingTop:30}}></View>
           </ScrollView>
       </ScrollView>
      )}
      </>
    );
  }
}


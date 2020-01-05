import React , {Component} from "react";
import {ScrollView, View, Text, Platform,RefreshControl,FlatList,TouchableOpacity,Image,Dimensions,StyleSheet} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Font from 'expo-font';
import styles from './dashstyle';
import header from './headerStyle';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Loader from './Loader';
import * as authToken from "./authToken";
import Modal from "react-native-modal";
const PUSH_ENDPOINT = 'http://www.genz360.com:81/register/push-token';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const DailyTask = (props) =>(
   <>
  <TouchableOpacity style={styles.daily_box_wrap} onPress={()=>props.navigation.navigate("DailyTask",{post_id:props.item.pd_id})} >
      {
        props.item.file_name===null?
        <Text numberOfLines={3} ellipsizeMode={'tail'} style={{fontSize:15,color:'#000',fontFamily:'SF'}}>{props.item.post_data}</Text>:
      <Image source={{uri:'http://www.genz360.com:81/get-image/'+props.item.file_name}} style={styles.img} />
      }
      <View style={{paddingTop:5,paddingBottom:5,paddingLeft:0}}>
        <Text style={{fontSize:16, color:'#000',fontFamily:'SF'}}>{props.item.date_posted}</Text>
      </View>
  </TouchableOpacity> 
</>
); 



const MyCampaign = (props) =>(
   
  <TouchableOpacity style={styles.lc_box_wrap} onPress={()=>props.navigation.navigate("CampaignDetails",{camp_id:props.item.campaign_id})}>
      <Image source={{uri:'http://www.genz360.com:81/get-image/'+props.item.image}} style={styles.img} />
      <View style={{paddingTop:5,paddingBottom:5,paddingLeft:0}}>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:16, color:'#000',fontFamily:'SF'}}>{props.item.name}</Text>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily:'SF',color:'#000',fontSize:16}}>Status : {props.item.status===1?'Active':'Inactive'}</Text>
      </View>
  </TouchableOpacity> 
); 




const AppliedBox = (props) => (

  <TouchableOpacity style={styles.applied_box_wrap}  onPress={()=>props.navigation.navigate("CampaignDetails",{camp_id:props.item.campaign_id})}>
    <Image source={{uri:'http://www.genz360.com:81/get-image/'+props.item.image}} style={styles.img} />
    <View style={{paddingTop:5,paddingBottom:5,paddingLeft:10}}>
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:16, color:'#000',fontFamily:'SF'}}>{props.item.name}</Text>
      <Text style={{fontFamily:'SF',color:'#000',fontSize:16}}>status:{props.item.status}</Text>
    </View>
  </TouchableOpacity> 

  );



 

export default class Dashboard extends Component {

  constructor (props) {
    super(props);
    this.state = {
      dailytask:[],
      livecampaign:null,
      appliedcampaign:[],
       banner:true,
       task:true,
       campavl:false,
       task:false,
       refreshing: false,
       campPostLive:false,
       campImage:null,
       loaded:true
    };
}

checkImageURL(){
  const img = "https://www.genz360.com/images/banner/app-post-banner.jpg";
  fetch(img)
    .then(res => {
     if(res.status == 404){
      console.log("no cam post live");
     }else{
      this.setState({campImage:res.url,campPostLive:true});
    }
  })
 }

_onRefresh = () => {
  this.setState({refreshing: true});
  this.get_daily_task();
  this.get_live_campaigns();
  this.get_applied_campaigns();
  this.setState({refreshing: false});
}

 _getStorageValue(){
  this.registerForPushNotificationsAsync()
  this.get_daily_task();
  this.get_live_campaigns();
  this.get_applied_campaigns();
}




  get_daily_task = async () => {
    try { 
      const token = await authToken.get();
      console.log(token);
      let response = await fetch('http://www.genz360.com:81/inf-daily-task', {
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
      if (responseJson.valid) {
        this.setState({task:true,dailytask:responseJson.dailytask})
        
      }
    } catch (error) {
      console.log(error)
    }
  }


  get_live_campaigns = async () => {
    try {
      const token = await authToken.get();
      let response = await fetch('http://www.genz360.com:81/inf-live-campaign', {
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
      if (responseJson.valid) {
        this.setState({livecampaign:responseJson.livecampaign})
      }
    } catch (error) {
      console.log(error);
    }
  }

  get_applied_campaigns = async () => {
    try {
      const token = await authToken.get();
      let response = await fetch('http://www.genz360.com:81/inf-applied-campaign', {
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
      if (responseJson.valid) {
        this.setState({appliedcampaign:responseJson.appliedcampaign})
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
  this._getStorageValue();
  this.checkImageURL();
  this.setState({loaded:false});
  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('reminders', {
      name: 'Reminders',
      sound: true,
      priority: 'max',
    });
  }
}


 registerForPushNotificationsAsync=async()=> {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();
  try {
    let response = await fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokken: this.state.tokken,
        push_tokken:token,
      }),
    });
    let responseJson = await response.json();
    if (responseJson.valid) {
      return
    }
  } catch (error) {
    console.log(error);
  }
}


render() {
      return (
        <>
    {this.state.loaded ? <Loader /> :(
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
           
          />}
          style={{backgroundColor:'#fff'}}
        >

        <Modal
          visible={this.state.campPostLive}
          style={stylesModal.Modal}
          backdropColor="#B4B3DB"
          backdropOpacity={0.8}
          onBackdropPress={() => this.setState({ campPostLive: false })}
          onSwipeComplete={() => this.setState({ campPostLive: false })}
          swipeDirection={['up', 'left', 'right', 'down']}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          >
            <View style={stylesModal.Mcontent}>
               <Image source={{ uri:"https://www.genz360.com/images/banner/app-post-banner.jpg"}} style={{ width:'100%' ,height: 300}}/>
                <Text style={{fontSize:10,alignSelf:'center',marginTop:5}}>swip to close</Text>
            </View>  
        </Modal>


        <View style={header.header_wrapper}>
        <View style={header.wrap}>
        <Text style={[styles.home,{color:'#fff'}]}>Dashboard</Text>
            
            <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
        </View>

        <ScrollView style={[header.createSection_ws,]}>
        

            {/* <View style={styles.home_wap}> 
                <Text style={styles.home}>Home</Text>
            </View>
           */}
        
            {
              this.state.banner?<View style={{marginTop:15}} >
                <Image source={require('../images/banner.png')} style={header.banner_img}/>
              </View>:null
            }
       

          <View style={[header.heading_wrap_ws,{paddingTop:15}]}>
              <Text style={header.heading_g}>Daily Tasks</Text>
              <TouchableOpacity>
                {/* <Text style={styles.vm_txt}>View More</Text> */}
              </TouchableOpacity>
          </View>

          <View style={styles.flat_wrap}>

          {
            this.state.dailytask.length!==0?
            <FlatList 
            showsHorizontalScrollIndicator={false}
              keyExtractor={(item,index)=>index.toString()}
              horizontal={true}
              data={this.state.dailytask}
              renderItem={({item})=><DailyTask item={item}  navigation={this.props.navigation} /> }
            /> :  <View style={{flexDirection:'row',justifyContent:'center',marginLeft:'3%',marginTop:'4%',paddingBottom:2,marginRight:'3%'}}>
                <Text style={{fontSize:16,fontFamily:'SF',}}>No Task Available</Text>
               {/* <TouchableOpacity >
                  <Text style={styles.campbtn_txt}>  Create Now</Text>
               </TouchableOpacity> */}
            </View>
          }

        </View>


        <View style={header.heading_wrap_ws}>
              <Text style={header.heading_g}>Live Campaigns</Text>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate("CampaignList")}>
                <Text style={styles.vm_txt}>View More</Text>
              </TouchableOpacity>
          </View>

          
            <View style={styles.flat_wrap}>

            {
              this.state.livecampaign?
              <FlatList 
              keyExtractor={(item,index)=>index.toString()}
              showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={this.state.livecampaign}
                renderItem={({item})=><MyCampaign item={item}  navigation={this.props.navigation} /> }
              /> :  <View style={{flexDirection:'row',justifyContent:'center',marginLeft:'3%',marginTop:'4%',
                    paddingBottom:2,marginRight:'3%'}}>
                  <Text style={{fontSize:16,fontFamily:'SF',}}>No Campaigns Yet </Text>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("Browse")}>
                    <Text style={styles.campbtn_txt}>Browse</Text>
                  </TouchableOpacity>
              </View>
            }

            </View>


            
        <View style={header.heading_wrap_ws}>
              <Text style={header.heading_g}>Applied in</Text>
              <TouchableOpacity>
                {/* <Text style={styles.vm_txt}>View More</Text> */}
              </TouchableOpacity>
          </View>
          <View style={styles.flat_wrap}>

          {  
          this.state.appliedcampaign.length!==0 ? <FlatList 
            keyExtractor={(item,index)=>index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={this.state.appliedcampaign}
            renderItem={({item})=><AppliedBox item={item}  navigation={this.props.navigation} /> }

            /> : <View style={{flexDirection:'row',justifyContent:'center',marginLeft:'3%',marginTop:'4%',
            paddingBottom:2,marginRight:'3%'}}>
          <Text style={{fontSize:16,fontFamily:'SF',}}>No Campaigns Yet </Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Browse")}>
            <Text style={styles.campbtn_txt}>Apply Now</Text>
          </TouchableOpacity>
      </View>}
          </View>

          <View style={{paddingBottom:40}}></View>

          </ScrollView>
     
     </View>
     </ScrollView>
      )}
      </>
      );
    }
  }

  const stylesModal = StyleSheet.create({
    Mcontent: {
      backgroundColor: '#fff',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    Modal: {
      margin:0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });


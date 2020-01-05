import React , {Component} from "react";
import {ScrollView,Alert, View, Text,TouchableOpacity ,Image ,AsyncStorage,ActivityIndicator} from "react-native";
import styles from './profStyle2';
import header from './headerStyle';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Loader from './Loader';
import * as authToken from "./authToken";
import axios from 'axios';
import * as Font from 'expo-font';

const options = {
    title: 'Select Logo',
    takePhotoButtonTitle:'Take Photo',
    chooseFromLibraryButtonTitle:'Choose from library',
    quality:1
  };

export default class  Proflie extends Component {
  constructor (props) {
    super(props);
    this.state = {
       os:['e'],
       card:['a'],
       prevcamp:true,
       loadedval:null,
       photo:null,
       loading:false,
       imageSource:null,
       imageData:null,
       tokken:null

    };
    
}

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
}


async clearAllData() {
  try {
    await AsyncStorage.clear();
     this.inf_logout();
    this.props.navigation.navigate('AuthLoading');
    } catch (err) {
    throw new Error(err);
  }
}

confirm = () => {
  return Alert.alert(
    'Confirmation required'
    ,'Do you really want to logout?'
    ,[
      {text: 'Logout', onPress: () => { this.clearAllData()}},
      {text: 'Cancel'}
     ]
  );
}


inf_logout=async ()=>{
  const token = await authToken.get();
   let response = await fetch('http://www.genz360.com:81/inflogout',{
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
}

getprofile= async ()=>{
  try {
    const token = await authToken.get();
    let response = await fetch('http://www.genz360.com:81/infprofile',{
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
      // console.log(responseJson);
      if (responseJson.valid){
        this.setState({loadedval:responseJson.inf,prevcamp:responseJson.found,photo:responseJson.inf.profile_photo})
      }
      else{
       console.log(responseJson.err);
      }
     this.setState({loaded:false});
    } catch (error) {
    console.log(error);
  }
}

async componentDidMount() {
 const token = await authToken.get();
  await Font.loadAsync({
    GilroyExtraBold: require('../assets/fonts/Gilroy-ExtraBold.ttf'),
    GilroyLight: require('../assets/fonts/Gilroy-Light.ttf'),
    SF: require('../assets/fonts/SF.ttf'),
    });
  this.setState({tokken:token});
  this.getPermissionAsync();  
  this.getprofile();
  this.setState({loaded:false});
}

async showpicker(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base:true
    });

    if (!result.cancelled) {
      const source={uri:result.uri};
      this.setState({imageSource:source,imageData:result.base64})
      this.uploadinfprofile();
    }
}

uploadinfprofile=async()=>{
  this.setState({loading:true});
  try {
    const token = await authToken.get();
    let response = await fetch('http://www.genz360.com:81/infprofileimageupdate',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokken: token,
        imageData:this.state.imageData
      }),
    });
    let responseJson = await response.json();
    console.log(responseJson);
     if (responseJson.valid){
      this.setState({photo:responseJson.uploaded,loading:false});
      alert("Image Uploaded");   
     }
     else{
      console.log(responseJson);
    }
    this.setState({loading:false});
   } catch (error) {
    alert(error);
  }
   this.setState({loading:false});
}


  render() {
  return (
       <>
      {this.state.loading ? <Loader/> :(
        <ScrollView style={{backgroundColor:'#fff'}}>
        <View style={header.header_wrapper}>
        <View style={header.wrap}>
        <Text style={[header.home,{color:'#fff'}]}>Profile</Text>
        <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
        </View>

        <ScrollView style={[header.createSection_no,]}>
            <View style={styles.prof_det_wrap}>
                <TouchableOpacity style={styles.prof_img_wrap} onPress={()=>this.showpicker()}>
                    <Image source={{uri:'http://www.genz360.com:81/get-image/'+this.state.photo+ '?rnd=' + Math.random()}} style={styles.prof_img}/>
                </TouchableOpacity>
                <View style={styles.prof_det}>
                  {this.state.loadedval && (
                    <>
                    <Text style={styles.info}>{this.state.loadedval.name}</Text>
                    <Text style={styles.info}>{this.state.loadedval.contact}</Text>
                    <Text style={styles.info}>{this.state.loadedval.email}</Text>
                    </>
                   )}
                </View>
            </View>

            <View style={styles.list}>
            {this.state.loadedval && (
              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}}  
              onPress={()=>this.props.navigation.navigate("InfCard",{tokken:this.state.tokken,uid:this.state.loadedval.uid,name:this.state.loadedval.name,number:this.state.loadedval.contact,email:this.state.loadedval.email,profile_photo:this.state.loadedval.profile_photo})}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/card.png')}  style={{width:25,height:25}}/>
              <Text style={styles.list_item}>Influencer Card</Text>
              </View>
              </TouchableOpacity>
                )}
              
              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} 
              onPress={()=>this.props.navigation.navigate("Activity")}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/pulse.png')}  style={{width:30,height:30}}/>
                  <Text style={styles.list_item}>Activity</Text>
              </View>
              </TouchableOpacity>

              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} 
              onPress={()=>this.props.navigation.navigate("AddPlatform")}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/social.png')}  style={{width:30,height:30}}/>
                  <Text style={styles.list_item}>Add Platform</Text>
              </View>
              </TouchableOpacity>

            
              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} onPress={()=>this.props.navigation.navigate("Wallet")}>
              <View style={styles.list_item_wrap}>
                  {/* <Icon name="wallet" size={20} color="#808080" style={{marginTop:2}}/> */}
                  <Image source={require('../images/t_wallet.png')}  style={{width:25,height:25}}/>
                  <Text style={styles.list_item}>Wallet</Text>
              </View>
              </TouchableOpacity>


              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} 
              onPress={()=>this.props.navigation.navigate("FAQ")}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/ques.png')}  style={{width:25,height:25}}/>
                  <Text style={styles.list_item}>FAQs</Text>
              </View>
              </TouchableOpacity>
              
              
              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} 
              onPress={()=>this.props.navigation.navigate("Support")}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/support.png')}  style={{width:25,height:25}}/> 
              <Text style={styles.list_item}>Support</Text>
              </View>
              </TouchableOpacity>

              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}} 
              onPress={()=>this.props.navigation.navigate("About")}>
                <View style={styles.list_item_wrap}>
                  <Image source={require('../images/info.png')}  style={{width:30,height:30}}/>          
                  <Text style={styles.list_item}>About us</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee'}}
               onPress={()=>this.props.navigation.navigate("TNC")}>
              <View style={styles.list_item_wrap}>
              <Image source={require('../images/tnc.png')}  style={{width:30,height:30}}/>          
              <Text style={styles.list_item}>Terms &amp; Conditions</Text>
              </View>
              </TouchableOpacity>


              <TouchableOpacity style={{flexDirection:'row',borderWidth:1,borderColor:'#eee',marginTop:20}} onPress={()=>this.confirm()}>
              <View style={[styles.list_item_wrap,]}>
              <Image source={require('../images/logout.png')}  style={{width:30,height:30}}/>       
              <Text style={styles.list_item}>Log Out</Text>
              </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
       </View>
     </ScrollView>
      )}
     </>
      );
    }
  }










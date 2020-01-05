import React , {Component} from 'react';
import {Text,Platform, View ,StyleSheet ,Dimensions,TouchableOpacity,ActivityIndicator,AsyncStorage,Image ,CheckBox ,ImageBackground} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Sm from './sm';
import header from './headerStyle';
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper';
import * as Permissions from 'expo-permissions';
import Loader from './Loader';
import * as authToken from "./authToken";

const Screen_widht=Dimensions.get('window').width
const Screen_height=Dimensions.get('window').height


export default class Landingpage extends Component{
    
    constructor(props){
        super(props);
        this.state={
          current_screen:"",
          loaded:true
        }
    }

  
    checkloginstatus=async ()=>{
      let value = await authToken.get();
      console.log(value);
      if(value){
        this.props.navigate.navigate("Home");
      }
    }

    _storeData = async (key,val) => {
      try {
        if(val && key){
           await AsyncStorage.setItem(key, val.toString());
        }
      } catch (error) {
        alert(error);
      }
    };

    async componentWillMount(){
      await Font.loadAsync({
        'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
        'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
        'SF': require('../assets/fonts/SF.ttf'),
      });      

        this.checkloginstatus();
        this.checkMultiPermissions();
        this.setState({ loaded:false });
    }

      async checkMultiPermissions() {
        const { status, expires, permissions } = await Permissions.getAsync(
          Permissions.CAMERA_ROLL,
          Permissions.CAMERA
        );
        if (status !== 'granted') {
          const { statusa, permissionsa } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (statusa === 'denied') {
            alert("Permission not granted")
          } 
          const { statusb, permissionsb } = await Permissions.askAsync(Permissions.CAMERA);
          if (statusb === 'denied') {
            alert("Permission not granted")
          } 
          
        }
      }
    

    render(){
        return(
        <>
          { this.state.loaded ? <Loader /> : (
      <View style={{flex:1}}>
        {Platform.OS === 'android' && (
          <Swiper style={styles.wrapper} showsButtons={false} 
            dot={<View style={{backgroundColor:'rgba(255,255,255,1)', width: 8, height: 8,borderRadius: 4, 
            marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />  }
            activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}}            />}
               loop={false}
          >
          <View style={styles.slide1}>
            <Image source={require('../images/cashconnect.png')} style={styles.image}/>
          </View>

          <View style={styles.slide3}>
            <Image source={require('../images/speakrfinal.png')} style={styles.image}/>            
          </View>

            <View style={[styles.slide2,{flexDirection:'column'}]}>
            <Image source={require('../images/entr.png')} style={styles.image}/>
          </View>
     
         
          <View style={{flex:1,backgroundColor:'#241663'}}>
              <View sytle={styles.slide}>
                <View style={styles.logowrap}>  
                  <View style={styles.logo}>
                    <Image source ={require('../images/logo.png')} style={styles.logoimg}/>
                  </View>
                </View>

                      <View>
                        <Text style={{fontSize:50,fontFamily:'Gilroy-ExtraBold',color:'#fff',textAlign:'center'}}>CASH {'\n'}YOUR CONNECT</Text>
                      </View>

                      <TouchableOpacity style={styles.btn} onPress={()=>this.props.navigation.navigate("Login")}>
                      <Text style={styles.btn_txt}>Go To Login >></Text>
                    </TouchableOpacity>

              </View>
             
           </View>
          
        </Swiper>
         )}

        {Platform.OS === 'ios' && (
         <View style={{flex:1,backgroundColor:'#241663'}}>
          <View sytle={styles.slide}>
            <View style={styles.logowrap}>  
              <View style={styles.logo}>
              <Image source ={require('../images/logo.png')} style={styles.logoimg}/>
            </View>
          </View>
          <View>
            <Text style={{fontSize:50,fontFamily:'Gilroy-ExtraBold',color:'#fff',textAlign:'center'}}>CASH {'\n'}YOUR CONNECT</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={()=>this.props.navigation.navigate("Login")}>
            <Text style={styles.btn_txt}>Go To Login >></Text>
          </TouchableOpacity>
        </View>
        </View>
        )}
    </View>
   )}
</>

)
}
}




 

const styles = StyleSheet.create({
  wrapper: {
    flex:1
  },
  slide1: {
   
  position:'absolute',
  top:0,
  height:'100%',
  width:'100%',
    backgroundColor: '#241663',
  },
  slide2: {
  
 

    backgroundColor: '#241663',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#241663',
  },
  slide3: {
  

    backgroundColor: '#241663',
  },
  logowrap:{
    
    alignItems:'center',
    marginTop:'5%',
},

logoimg:{
    height:250,
    width:250,
    resizeMode:'contain'
},
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image:{
    height:'100%',
    width:'100%',
    resizeMode:'contain',
  },
  btn:{
    marginLeft:20,
    marginRight:20,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:10,
    backgroundColor:'#f96d15',
    marginTop:20,
    alignItems:'center'

  },

  btn_txt:{
      fontSize:20,
      color:'#fff',
      fontFamily:'Gilroy-ExtraBold',
  },
});



import React, {Component} from 'react';
import {ScrollView,View,Text, TextInput,AsyncStorage,TouchableOpacity} from 'react-native';
import styles from './loginStyle';
import Icon from 'react-native-vector-icons/FontAwesome5';
import header from './headerStyle';
import * as Font from 'expo-font';
import Loader from './Loader';
import * as authToken from "./authToken";

export default class OTP extends Component {

  constructor(props){
    super(props);
    this.state={
      otp:'',
      tokken:"",
      resendcount:0,
      loaded:true
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



  
resendotp=async ()=>{
    this.setState({resendcount:this.state.resendcount+1})
    if (this.state.resendcount>=3){
      alert("Max Resend Limit Exceeded!!!")
      return
    }
    try {
      this.setState({loaded:true})
      const token = await authToken.get();
      let response = await fetch('http://genz360.com:81/resendotp-inf', {
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
      this.setState({loaded:false})
      if (responseJson.valid) {
        alert("OTP Resent!!!")
      }
      else {
        alert(responseJson.err);
      }
    } catch (error) {
      alert(error)
    }
  }


verifyotp=async ()=>{
    if(this.state.otp==="" || this.state.otp.length!==4){
      alert("invalid otp");
      return;
     }
    try {
      this.setState({loaded:true});
      const token = await authToken.get();
      let response = await fetch('http://www.genz360.com:81/verify-otp-inf',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp:this.state.otp,
          tokken: token
        }),
      });      
      this.setState({loading:false})
      let responseJson = await response.json();  
      console.log(responseJson);
      if (responseJson.valid && responseJson.updated){        
        this.props.navigation.navigate("Home");  
      }
      else if(responseJson.valid && !responseJson.updated){
       this.props.navigation.navigate("INFDETAILS");
      }
      else{
        alert(responseJson.err);
      }
     } catch (error) {
      alert("Some thing went wrong!!!");
    }
  }

  render(){
    return(
      this.state.loaded ? <Loader /> : (
      <View style={header.header_wrapper}  keyboardDismissMode='interactive'
      keyboardShouldPersistTaps='handled'>
      <View style={header.wrap}>
           <TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")}>
          <Icon  style={styles.backbtn} name="arrow-left" size={24} color="#fff"/>
          </TouchableOpacity>
          <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
      </View>

      <ScrollView style={header.mainSection}>

                       <View style={{marginTop:'20%'}}>
                          <Text style={styles.wel_txt}>OTP has been sent to your{'\n'}Phone</Text>
                        </View>
          
                        <View style={[styles.inputSection_icon,{marginTop:50}]}>
                          <Icon style={styles.icon} name="asterisk" size={24} color="#dadada" />
                          <TextInput
                          style={styles.input_icon}
                          keyboardType="numeric"
                          placeholder="4 digit OTP"
                          onChangeText={(otp) => {this.setState({otp:otp})}}
                          value={this.state.otp}
                          maxLength={4}
                          underlineColorAndroid="transparent"
                          ref={(b)=>this.otp=b}
                          />                 
                      </View>
                  <TouchableOpacity style={{marginTop:15,marginLeft:'2%',width:160,}}
                    onPress={()=>this.resendotp()}
                  >
                    <Text style={{fontSize:16,color:'blue'}}>Resend OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.nextbtn} onPress={()=>{this.verifyotp();this.setState({loading:true})}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                         <Text style={styles.nextbtn_txt}>NEXT</Text>
                         <Icon name="arrow-right" size={16} color="#fff" style={{paddingLeft:10}}/>   
                        </View>
                   </TouchableOpacity>

      </ScrollView>
 
</View>
      )
    );
  }
}


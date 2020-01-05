import React, {Component} from 'react';
import {ScrollView,View,Text,Image ,Dimensions, TextInput ,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Font from 'expo-font';
import styles from './loginStyle.js';
import Loader from './Loader';
import { set } from './authToken';
import * as authToken from "./authToken";
import { thisExpression } from '@babel/types';

const windowHeight = Dimensions.get('window').height;

export default class Login extends Component {

  constructor(props){
    super(props);
    this.state={
      contact:'',
      token:null,
      current_screen:"",
      numValid:true,
      loading:true,
      msg:'',
    }
  }

login=async (username,password)=>{
    if (this.state.contact.length<10){
     this.setState({numValid:false})
      return;
    }
    try {
      this.setState({loading:true});
      let response = await fetch('http://www.genz360.com:81/inflogin',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_no: this.state.contact,
        }),
      });
      let responseJson = await response.json();
      this.setState({loading:false});
      if (responseJson.valid && responseJson.tokken){
        console.log(responseJson)
         await authToken.set(responseJson.tokken);
         const token = await authToken.get();
         console.log(token);
         if(token){
           this.props.navigation.navigate("OTPVERIFY");  
         } else{
           alert("Device Token is Required ! Need Permission");
         }
       }
       else{
         alert(responseJson.err);
       }
      } catch (error) {
       alert(error)
     }
   }


  componentWillMount(){
    Font.loadAsync({
      'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
      'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
      'SF': require('../assets/fonts/SF.ttf'),
    });
    this.setState({loading:false});
  }

  nameCheck = () => {
    if (this.state.contact.length===10){
      this.login();
      this.setState({loading:true,msg:''});
    }else{
      this.setState({msg:'Enter Valid Number'})
    }
  }


  render(){
    return(
    <>
     { this.state.loading ? <Loader /> :(
      <ScrollView style={styles.container}  keyboardDismissMode='interactive'
      keyboardShouldPersistTaps='handled'>
        <View style={{flexDirection:'column',justifyContent:'center'}}>
        <View style={styles.logowrap}>  
            <View style={styles.logo}>
                <Image source ={require('../images/logo.png')} style={styles.logoimg}/>
            </View>
        </View>

        <View style={{flexDirection:'row',paddingLeft:'6%'}}>
          <Text style={styles.wel_txt}>Welcome!{'\n'} <Text style={{color:'#f96d15'}}>Signup</Text> To Continue</Text>
        </View>

        <Text style={{textAlign:'left',marginLeft:'5%',marginTop:7,fontSize:14,fontFamily:'SF',color:'#eb7070'}}>{this.state.msg}</Text> 

      <View style={[styles.input_wrap,{marginTop:0}]}>
        <View style={styles.inputSection_icon}>
            <Icon style={styles.icon} name="phone" size={24} color="#dadada" />
            <TextInput
                 style={styles.input_icon}
                 placeholder="PHONE NUMBER"
                 keyboardType={'numeric'}
                 onChangeText={(contact) => {this.setState({contact:contact})}}
                 value={this.state.contact}
                 underlineColorAndroid="transparent"
                 maxLength={10}
                />
         </View>  
        <TouchableOpacity style={styles.nextbtn} onPress={this.nameCheck}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.nextbtn_txt}>NEXT</Text>
                <Icon name="arrow-right" size={16} color="#fff" style={{paddingLeft:10}}/>   
              </View>
          </TouchableOpacity>
        </View>
        </View>
        <View style={{paddingBottom:40}}></View>
      </ScrollView>
     )}
    </>
    )
  }
}





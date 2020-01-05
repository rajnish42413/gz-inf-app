import React , {Component} from 'react';
import {ScrollView, View, Text, TextInput ,StyleSheet,RefreshControl ,FlatList ,TouchableOpacity ,Image,ImageBackground ,CheckBox,AsyncStorage } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './walletStyle';
import Sm from './sm';
import * as Font from 'expo-font';
import header from './headerStyle';



const Transactions = (props) =>(
    <View style={{marginTop:20,paddingBottom:20,backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#dadada',marginLeft:20,marginRight:20}}>

        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"flex-start"}}>
            <Text style={styles.camp_name}> {props.item.purpose}</Text>
            <Text style={styles.earn_val}>{props.item.amount} </Text>
        </View>

        <View style={{flexDirection:'row',marginTop:10}}>
            <Text>Txn Id: {props.item.transaction_id}</Text>
           
        </View>

        <View style={{flexDirection:'row',marginTop:10}}>
            <Text>{props.item.date_time}</Text>
            {/* <Text style={{marginLeft:20}}>{props.item.status}</Text> */}
        </View>

        
    </View>

);


export default class Wallet extends Component{
    static navigationOptions = {
        tabBarIcon: ({focused, tintColor}) => (
          <Image source={require('../images/wallet.png')} style={header.tabIcon}/>
        ),
      }
    constructor(props){
        super(props);
        this.state={
           amount:0,
           transactions:[],
           fontLoaded:false
        };
    }

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.getwallet();
      this.setState({refreshing: false});
    }
    async _getStorageValue(){
        let value = await AsyncStorage.getItem("tokken");
        this.setState({tokken:value.toString()})
        this.getwallet();
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
      
      
      getwallet=async ()=>{
        
            try {
          
          let response = await fetch('http://www.genz360.com:81/infwallet',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tokken: this.state.tokken
            }),
          });
          
          let responseJson = await response.json();
      
          if (responseJson.valid){
            this.setState({loaded:true,transactions:responseJson.transactions,amount:responseJson.amount})
          }
          else{
            alert(responseJson.err);
          }
        } catch (error) {
          alert(error);
        }
      }
    async componentDidMount() {    
      this._getStorageValue();
        await Font.loadAsync({
          'Gilroy-ExtraBold': require('../assets/fonts/Gilroy-ExtraBold.ttf'),
          'Gilroy-Light': require('../assets/fonts/Gilroy-Light.ttf'),
          'SF': require('../assets/fonts/SF.ttf'),
        });
           this.setState({ fontLoadedd:true });
      }
      
   
    

    render(){

        return(
   this.state.fontLoadedd ? (

        <ScrollView style={{flex:1,backgroundColor:'#fff'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}
        >
         <View style={header.header_wrapper}>
          <View style={header.wrap}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile')}>
                <Icon  style={styles.backbtn} name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={header.tagline}>Cash{'\n'}Your Connect</Text>
          </View>

          <View style={[header.createSection,{paddingBottom:30,borderBottomWidth:1,borderColor:'#dadada'}]}>
            {/* <ImageBackground style={{width:'100%'}} source={require('./gz.png')}> */}
          <Text style={header.heading_normal} >GZ Wallet </Text>


                <View style={{flexDirection:'row',justifyContent:'center',marginTop:'7%'}}> 
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                      <Image source={require('../images/bucks.png')} style={{width:60,height:60}}/>
                      
                        <Text style={styles.bal}>{'\u20B9'} {this.state.amount}</Text> 
                    </View>
                </View>

                {/* <View style={styles.info}>
                    <Text style={styles.info_txt}> 1 Gz coin = 1 Rs.</Text>
                </View> */}

                {/* <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:'1%',marginRight:'1%'}}>
                    <TouchableOpacity style={styles.transfer_btn} onPress={()=>alert("Comming Soon")} >
                        <Text style={styles.transfer_btn_txt}>Transfer To Bank</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.transfer_btn,{marginLeft:10,backgroundColor:'#dadada'}]} onPress={()=>alert("Comming Soon")}>
                        <Text style={styles.transfer_btn_txt}>Transfer to affiliate wallet </Text>
                    </TouchableOpacity>
                </View> */}


            <View style={{flexDirection:'column',marginTop:20}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("Transfer",{amount:this.state.amount})} style={[styles.transfer_btn,{flexDirection:'row',alignItems:'center'}]} >
                        <Image source={require('../images/paytm.png')} style={{width:25,height:25}} />
                        <Text style={styles.transfer_btn_txt}>Transfer to Paytm</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity  onPress={()=>alert("Coming Soon")} style={[styles.transfer_btn,{flexDirection:'row',alignItems:'center'}]}>
                    <Image source={require('./t_wallet.png')} style={{width:25,height:25}} />
                        <Text style={styles.transfer_btn_txt}>Transfer to Affiliate Wallet</Text>
                    </TouchableOpacity> */}
                </View>
       
                {/* </ImageBackground> */}
                </View>
          </View>
            <ScrollView>
               <Text style={[header.sub_heading,{marginTop:5,marginLeft:10}]}>Earning Summary</Text>
                <FlatList
                style={{backgroundColor:'#f0f3fa  '}}
                    keyExtractor={(item,index)=>index.toString()}
                    data={this.state.transactions}
                    renderItem={({item})=><Transactions item={item} />}
                />
                        

            </ScrollView>
        </ScrollView>
        ):null

        );
    }
}



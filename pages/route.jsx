import React, { Component } from 'react';

import {StyleSheet,Image} from 'react-native';
import Login from './login';
import Sign from './sign';
import Dashboard from './dashboard';

import { createStackNavigator } from 'react-navigation-stack';
import { Platform, StatusBar } from "react-native";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Verify from './otpverify';
import Profile from './newprofile';
import ProfUpdate2 from './profupdate2';
import TNC from './tnc';
import Wallet from "./wallet"
import Notificationspage from './notifications';
import Landingpage from "./landingpage"
import Campaign from './camp'
import Browse from './browsecamp'
import INFLUENCERDETAILS from './sign';
import InfCard from './infcard';
import DailyTask from './dailytask';
import LiveCampList from './livecamplist'
import header from './headerStyle';
import TaskList from './dailytasklistall'
import Activity from './activity';
import FAQ from './faq';
import Support from './support';
import AddPlatform from './addplatform';
import Transfer from './transfer';
import About from './about';
import AuthLoadingScreen from './AuthLoadingScreen'


const MainDashBoard = createStackNavigator(
    {
      Home: Dashboard,
      CampaignDetails:Campaign,
      CampaignList:LiveCampList,
      DailyTask:DailyTask,
      TaskList:TaskList,
      Transfer:Transfer
    },
    {
      initialRouteName: 'Home',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    }
  )
  MainDashBoard.navigationOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <Image source={require('../images/home.png')} style={header.tabIcon}/>
    ),
  }
  
  
  const MainProfile = createStackNavigator(
    {
      Profile:Profile,    
      InfCard:InfCard,
      Activity:Activity,
      FAQ:FAQ,
      Support:Support,
      About:About,
      AddPlatform:AddPlatform,
      Transfer:Transfer,
      Wallet:Wallet,
      TNC:TNC,
    },
    {
      initialRouteName: 'Profile',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    }
  )
  MainProfile.navigationOptions = {
    tabBarIcon: ({focused, tintColor}) => (
      <Image source={require('../images/user.png')} style={header.tabIcon} />
    ),
  }
  
  
  
  const SignedIn = createBottomTabNavigator(
    {
      Profile:MainProfile,
      Browse:Browse,
      Dashboard: MainDashBoard,
      Notifications:Notificationspage,
      Wallet:Wallet,
    },
    {
      swipeEnabled:true,
      initialRouteName:'Dashboard',
      tabBarOptions: {
        activeTintColor: '#fff',
        inactiveTintColor:'#000',
        showLabel: true,
        style:{
          height:65,
          paddingTop:7,
          borderTopWidth:1,
          borderTopColor:'#dadada',
          backgroundColor:'#f96d15'
        },
        labelStyle:{
          paddingBottom:7,
          fontFamily:'SF'
        }
        
      },
      navigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        // to navigate to the top of stack whenever tab changes
        navigation.dispatch(StackActions.popToTop());
        defaultHandler();
        },
      })
    }
  )
  
  const SignedOut = createStackNavigator({
    Dashboard:Dashboard,  
    Login: Login,
    Landingpage:Landingpage,
    SignUp:Sign,
    SMH:ProfUpdate2,
    OTPVERIFY:Verify,
    TNC:TNC,
    INFDETAILS:INFLUENCERDETAILS
  },{
    initialRouteName:"Landingpage",
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
   });


  
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      SignedIn: SignedIn,
      SignedOut: SignedOut
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
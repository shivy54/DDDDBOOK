import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator}from 'react-navigation-tabs';
import { StyleSheet, Text, View } from 'react-native';
import Transaction from './Screens/Transaction';
import Search from './Screens/Search';
import { render } from 'react-dom';

export default class App extends React.Component {
  render(){
  return (
    <AppContainer/>
  );
  }
}
const TabNavigator = createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
},
{
defaultNavigationOptions:({navigation})=>
  ({
    tabBarIcon:({})=>{
      const routeName=navigation.state.routeName
      if(routeName === 'Transaction'){
return(
<image source = {require('./assets/book.png')}
style={{Width:40,height:40}}/>
 
);
      }else if(routeName === 'Search'){
return(
<image source = {require('./assets/search.png')}
style={{Width:40,height:40}}/>
);
      }
    }
  })

}
)
const AppContainer = createAppContainer(TabNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
    
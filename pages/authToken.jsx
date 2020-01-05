import { AsyncStorage } from "react-native";

export const TOKEN_KEY = "tokken";

export const onSignOut = () => AsyncStorage.removeItem(TOKEN_KEY);

export const isSignedIn = async () => {
  try {
    const value = await AsyncStorage.getItem(TOKEN_KEY);
    if (value !== null) {
      console.log(value);
      return value;
    }
    }catch (error) {
      console.log(error)
    }
  }

  export const set = async(value)=>{
    try {
      await AsyncStorage.setItem(TOKEN_KEY,value);
    } catch (error) {
        console.log("SetItem error ",error)
        return null;
    }
}

export const get = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
}
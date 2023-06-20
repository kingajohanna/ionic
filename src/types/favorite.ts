import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stop } from './stop';

export type FavoriteBusLines = Stop[];

const FavoriteBusLinesKey = '@FavoriteBusLines';

export const saveFavourites = async (favs: FavoriteBusLines) => {
  try {
    await AsyncStorage.setItem(FavoriteBusLinesKey, JSON.stringify(favs));
  } catch (error) {
    console.log(error);
  }
  return;
};

export const getFavourites = async () => {
  try {
    const favs = await AsyncStorage.getItem(FavoriteBusLinesKey);
    if (favs !== null) {
      return JSON.parse(favs) as FavoriteBusLines;
    }
  } catch (error) {
    console.log(error);
  }
};

import { Guitar } from '../types/guitar';
import { State } from '../types/state';

export const getIsDataLoaded = ({isDataLoaded}: State): boolean => isDataLoaded;
export const getGuitars = ({guitars}: State): Guitar[] => guitars;
export const getGuitar = ({guitar}: State): Guitar => guitar;
export const getDisplayedGuitars = ({displayedGuitars}: State): Guitar[] => displayedGuitars;
export const getSortMethod = ({sortMethod}: State): string => sortMethod;

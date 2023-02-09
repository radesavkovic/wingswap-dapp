import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { store } from '.';
import { RootState } from './types';

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

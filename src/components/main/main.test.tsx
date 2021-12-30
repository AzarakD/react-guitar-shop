/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  render,
  screen
} from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { Provider } from 'react-redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createAPI } from '../../services/api';
import {
  makeFakeGuitar,
  makeFakeGuitarList
} from '../../mocks/guitar-data';
import {
  AppRoute,
  DEFAULT_PAGE,
  FilterQuery,
  SearchQuery,
  SortQuery
} from '../../const';
import { State } from '../../types/state';
import Main from './main';

const GUITAR_COUNT = 10;

const fakeGuitar = makeFakeGuitar();
const fakeGuitars = makeFakeGuitarList(GUITAR_COUNT);

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<
  State,
  Action,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const store = mockStore({
  guitars: fakeGuitars,
  isDataLoaded: true,
  guitar: fakeGuitar,
  sorting: SortQuery.Default,
  filter: FilterQuery.Default,
  search: SearchQuery.Default,
  formReset: false,
  currentPage: DEFAULT_PAGE,
  totalCount: GUITAR_COUNT,
});

const history = createMemoryHistory();

const fakeMain = (
  <Provider store={store}>
    <Router history={history}>
      <Main />
    </Router>
  </Provider>
);

describe('Component: Main', () => {
  it('should render correctly', () => {
    render(fakeMain);

    expect(screen.getByText(/Каталог гитар/i)).toBeInTheDocument();
    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Сортировать:/i)).toBeInTheDocument();
  });
});

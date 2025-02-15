import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import {
  datatype,
  internet
} from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../services/api';
import {
  fetchCommentsAction,
  fetchGuitarAction,
  fetchGuitarsAction,
  sendCouponAction,
  sendReviewAction
} from './api-actioms';
import {
  makeFakeGuitar,
  makeFakeGuitarList
} from '../mocks/guitar-data';
import { ProductState, State } from '../types/state';
import {
  loadComments,
  loadGuitar,
  loadGuitars,
  setDiscount,
  updateComments
} from './actions';
import { getPageFromUrl } from '../utils';
import {
  APIRoute,
  COMMENT_PER_STEP,
  PageQuery,
  QueryKey,
  SortQuery
} from '../const';
import {
  makeFakeComment,
  makeFakeCommentList,
  makeFakeCommentPost
} from '../mocks/comment-data';
import { Comment } from '../types/comment';
import { Guitar } from '../types/guitar';

const ITEM_PAGE_COUNT = 9;
const GUITAR_COUNT = 10;
const COMMENT_COUNT = 3;

const fakeGuitar = makeFakeGuitar();
const fakeGuitars = makeFakeGuitarList(GUITAR_COUNT);
const fakeComment = makeFakeComment();
const fakeComments = makeFakeCommentList(COMMENT_COUNT);
const fakeCommentPost = makeFakeCommentPost();

describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<
      State,
      Action,
      ThunkDispatch<State, typeof api, Action>
    >(middlewares);

  it('should dispatch loadGuitars when Get /guitars:query', async () => {
    const query = internet.url();
    const currentPage = getPageFromUrl(query);
    const index = currentPage * ITEM_PAGE_COUNT - ITEM_PAGE_COUNT;

    const pageQuery = query.includes(QueryKey.Page)
      ? query.replace(/page_[0-9]+/, `${PageQuery.Start}${index}${PageQuery.Limit}${ITEM_PAGE_COUNT}`)
      : query.concat(`?${PageQuery.Start}${index}${PageQuery.Limit}${ITEM_PAGE_COUNT}`);

    const header = {'x-total-count': fakeGuitars.length};

    mockAPI
      .onGet(APIRoute.Guitars.replace(':query', pageQuery))
      .reply(200, fakeGuitars, header);

    const store = mockStore();

    await store.dispatch(fetchGuitarsAction(query));

    expect(store.getActions()).toEqual([
      loadGuitars(fakeGuitars, fakeGuitars.length),
    ]);
  });

  it('should dispatch loadGuitar when Get /guitars/:id', async () => {
    mockAPI
      .onGet(APIRoute.Guitar.replace(':id', `${fakeGuitar.id}`))
      .reply(200, fakeGuitar);

    const store = mockStore();

    await store.dispatch(fetchGuitarAction(fakeGuitar.id));

    expect(store.getActions()).toEqual([
      loadGuitar(fakeGuitar),
    ]);
  });

  it('should dispatch loadComments when Get /guitars/:id/comments', async () => {
    const route = APIRoute.Comments
      .replace(':id', `${fakeGuitar.id}`)
      .concat(SortQuery.SortToLaterDate)
      .concat(`&_limit=${COMMENT_COUNT}`);

    mockAPI.onGet(route).reply(200, fakeComments);

    const store = mockStore();

    await store.dispatch(fetchCommentsAction(fakeGuitar.id, COMMENT_COUNT));

    expect(store.getActions()).toEqual([
      loadComments(fakeComments),
    ]);
  });

  it('should dispatch updateComments when Post /comments', async () => {
    mockAPI
      .onPost(APIRoute.Comment)
      .reply(200, fakeComment);

    const store = mockStore({
      product: {
        comments: fakeComments,
        guitar: fakeGuitar,
      },
    });

    await store.dispatch(sendReviewAction(fakeCommentPost));

    const productState = store.getState().product as ProductState;
    const prevComments = productState.comments as Comment[];
    const storedGuitar = productState.guitar as Guitar;

    const update = [fakeComment, ...prevComments.slice(0, COMMENT_PER_STEP - 1)];
    const guitarUpdate = [fakeComment, ...storedGuitar.comments];

    expect(store.getActions()).toEqual([
      updateComments(update, guitarUpdate),
    ]);
  });

  it('should dispatch setDiscount when Post /coupons', async () => {
    const DISCOUNT = datatype.number();
    const coupon = {
      coupon: datatype.string(),
    };

    mockAPI
      .onPost(APIRoute.Coupons)
      .reply(200, DISCOUNT);

    const store = mockStore({
      cart: {
        discount: 0,
      },
    });

    await store.dispatch(sendCouponAction(coupon));

    expect(store.getActions()).toEqual([
      setDiscount(DISCOUNT),
    ]);
  });
});

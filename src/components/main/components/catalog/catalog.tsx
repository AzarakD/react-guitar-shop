import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDidMountEffect } from '../../../../hooks/use-did-mount-effect';
import { useDidUpdateEffect } from '../../../../hooks/use-did-update';
import { fetchGuitarsAction } from '../../../../store/api-actioms';
import {
  getCurrentPage,
  getFilter,
  getIsDataLoaded,
  getIsFailed,
  getSearch,
  getSorting
} from '../../../../store/selectors';
import Cards from '../cards/cards';
import Filter from '../filter/filter';
import Pagination from '../pagination/pagination';
import Sort from '../sort/sort';
import { QueryKey } from '../../../../const';

export default function Catalog(): JSX.Element {
  const isLoaded = useSelector(getIsDataLoaded);
  const isFailed = useSelector(getIsFailed);
  const sorting = useSelector(getSorting);
  const filter = useSelector(getFilter);
  const search = useSelector(getSearch);
  const page = useSelector(getCurrentPage);

  const history = useHistory();
  const dispatch = useDispatch();

  useDidUpdateEffect(() => {
    const query = `?${QueryKey.Page}${page}${search}${filter}${sorting}`;

    if (history.location.search !== query) {
      dispatch(fetchGuitarsAction(query));
      history.push(query);
    }
  }, [
    dispatch,
    filter,
    history,
    search,
    sorting,
    page,
  ]);

  useDidMountEffect(() => {
    dispatch(fetchGuitarsAction(history.location.search));
  });

  if (!isLoaded && !isFailed) {
    return <>Загрузка...</>;
  }

  if (isFailed) {
    return <>Сервер временно недоступен. Попробуйте позже.</>;
  }

  return (
    <div className="catalog">
      <Filter />
      <Sort />
      <Cards />
      <Pagination />
    </div>
  );
}

import { useSelector } from 'react-redux';
import { getGuitars } from '../../../../store/product/selectors';
import GuitarCard from '../guitar-card/guitar-card';

export default function Cards(): JSX.Element {
  const guitars = useSelector(getGuitars);

  return (
    <div className="cards catalog__cards" data-testid='cards'>
      {
        guitars && guitars.length !== 0
          ?
          guitars.map((guitar) => <GuitarCard guitar={guitar} key={guitar.id}/>)
          :
          <>Товар не найден.</>
      }
    </div>
  );
}

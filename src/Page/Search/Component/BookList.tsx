import type {BookItemType} from '@/@types/global';
import BookItem from './BookItem';

type Props = {
  bookList:BookItemType[]
}


function BookList({bookList, ...rest}:Props) {
  return (
    <ul {...rest}>
      {bookList.map((item) => <BookItem item={item} />)}
    </ul>
  )
}
export default BookList
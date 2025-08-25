import type {BookItemType} from '@/@types/global';
import BookItem from './BookItem';

type Props = {
  bookList:BookItemType[]
}

function BookList({bookList, ...rest}:Props) {
  return (
    <ul {...rest}>
      {bookList.map((item) => <BookItem item={item} key={item.isbn13}/>)}
    </ul>
  )
}

export default BookList
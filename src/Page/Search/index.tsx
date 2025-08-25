import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useSearchStore } from "./Store/useSearchStore";

function Search() {
  const bookList = useSearchStore((s) => s.searchData);

  return (
    <div className="min-h-full">
      <SearchForm />

      <BookList bookList={bookList} />
    </div>
  );
}

export default Search;



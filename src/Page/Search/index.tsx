import BookList from "./Component/BookList";
import SearchForm from "./Component/SearchForm";
import { useSearchStore } from "./Store/useSearchStore";

function Search() {
  const bookList = useSearchStore((s) => s.searchData);

  return (
    <div className="min-h-screen w-[1200px] bg-background-white">
      <SearchForm />

      <BookList bookList={bookList}/>
    </div>
  );
}

export default Search;



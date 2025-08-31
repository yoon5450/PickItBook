import MainRouletteWheel from "./MainRouletteWheel";

type Book = {
  src: string;
  alt: string;
};

interface Props {
  books: Book[];
}

function MainRoulette({ books }: Props) {
  return <MainRouletteWheel books={books} />;
}

export default MainRoulette;

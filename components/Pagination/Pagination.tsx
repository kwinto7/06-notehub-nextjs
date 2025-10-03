import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;  // всего страниц
  forcePage: number;  // активная страница (0-based)
  onPageChange: (idx: number) => void;
}

export default function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      className={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      previousClassName={css.nav}
      nextClassName={css.nav}
      breakClassName={css.break}
      breakLabel="..."
      previousLabel="<"
      nextLabel=">"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      onPageChange={(e) => onPageChange(e.selected)}
      forcePage={forcePage}
    />
  );
}
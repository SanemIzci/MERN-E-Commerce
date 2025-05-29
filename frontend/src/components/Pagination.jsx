import React from 'react'
import ReactPaginate from 'react-paginate';

function Pagination({ items = [], itemsPerPage = 8, onPageChange }) {
    const [itemOffset, setItemOffset] = React.useState(0);

    // Ensure items is an array
    const itemsArray = Array.isArray(items) ? items : [];

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = itemsArray.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(itemsArray.length / itemsPerPage);
  
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % itemsArray.length;
      setItemOffset(newOffset);
      onPageChange?.(currentItems);
    };

    if (!itemsArray.length) return null;

    return (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="flex gap-2 text-sm"
          activeClassName="text-black rounded-sm bg-white px-3 py-1 rounded hover:bg-black hover:text-white "
          pageClassName="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors duration-200"
          previousClassName="px-3 py-1 rounded hover:bg-black hover:text-white"
          nextClassName="px-3 py-1 rounded hover:bg-black hover:text-white"
        />
    )
}

export default Pagination
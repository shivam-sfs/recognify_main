import react from "react";
import ReactPaginate from "react-paginate";
interface paginationType {
  currentPage: number;
  setCurrentPage: react.Dispatch<react.SetStateAction<number>>;
  limit: number;
  total: number;
}

const Pagination: React.FC<paginationType> = ({
  currentPage,
  setCurrentPage,
  limit,
  total,
}) => {
  const start = (currentPage - 1) * limit;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="row mt-2">
      <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center">
          <div
            className="dataTables_info"
            id="example_info"
            role="status"
            aria-live="polite"
          >
            Showing {start+1} to {end} of {total} entries
          </div>
          <div className=" Pcontainer" style={{ marginRight: "5px" }}>
            <ReactPaginate
              pageCount={Math.ceil((total || 0) / limit)}
              onPageChange={(selectedItem: { selected: number }) =>
                setCurrentPage(selectedItem.selected + 1)
              }
              initialPage={currentPage - 1}
              previousLabel="Previous"
              nextLabel="Next"
              forcePage={currentPage - 1}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              marginPagesDisplayed={3}
              pageRangeDisplayed={5}
              containerClassName="pagination"
              activeClassName="active"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

import React from 'react';
import { MdFirstPage,MdLastPage, MdKeyboardArrowLeft, MdKeyboardArrowRight, pageCount} from 'react-icons/md';

export default function TablePagination(props) {

    const {
        pageIndex,
        gotoPage,
        canNextPage,
        canPreviousPage,
        setPageSize,
        pageSize,
        pageCount,
        nextPage,
        previousPage
    }=props;

    return (
        <div className="d-flex justify-content-between my-2">
            <div>
                <button
                    onClick={() => gotoPage(0)}
                    className={pageIndex != 0 ? "btn btn-light mr-2" : "btn"}
                    disabled={pageIndex == 0 ? true : false}
                >
                    {pageIndex != 0 ? <MdFirstPage /> : null}
                </button>
                <button
                    onClick={() => previousPage()}
                    className={canPreviousPage ? "btn btn-light" : "btn"}
                    disabled={!canPreviousPage}
                >
                    {canPreviousPage ? <MdKeyboardArrowLeft /> : null}
                </button>
            </div>
            <div className="d-flex align-items-center">
                <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)) }}
                    className="form-select"
                >
                    {
                        [5, 10, 25, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))
                    }
                </select>
                <span>rows per page</span>
            </div>
            <div>
                <button
                    onClick={() => nextPage()}
                    className={canNextPage ? "btn btn-light mr-2" : "btn"}
                    disabled={!canNextPage}
                >
                    {canNextPage ? <MdKeyboardArrowRight /> : null}
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    className={pageIndex != (pageCount - 1) ? "btn btn-light" : "btn"}
                    disabled={pageIndex == (pageCount - 1) ? true : false}
                >
                    {pageIndex != (pageCount - 1) ? <MdLastPage /> : null}
                </button>
            </div>
        </div>
    )
}

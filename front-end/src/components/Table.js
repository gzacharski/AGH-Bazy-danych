import React from 'react';
import { useTable, usePagination } from 'react-table';
import { GrPrevious, GrNext } from 'react-icons/gr'
import './Table.css';

export default function Table(props) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        prepareRow
    } = useTable({
        columns: props.columns,
        data: props.data
    }, usePagination)

    const {pageIndex, pageSize}=state;

    return (
        <>
            <div className="d-flex justify-content-between">
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="btn btn-light"
                >
                    <GrPrevious />
                </button>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="btn btn-light"
                >
                    <GrNext />
                </button>
            </div>
            <table {...getTableProps()} className="table table-striped table-hover">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(colum => (
                                    <th {...colum.getHeaderProps()} className="text-center align-middle">
                                        {colum.render('Header')}
                                    </th>
                                ))
                            }
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            <span className="cell">
                                                {cell.render('Cell')}
                                            </span>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
            </div>
        </>
    );
}
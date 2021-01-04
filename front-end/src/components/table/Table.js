import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import './Table.css';
import TablePagination from './TablePagination';
import TableFooter from './TableFooter';
import { ImSortAlphaAsc, ImSortAlphaDesc } from 'react-icons/im'

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
    },
        useSortBy,
        usePagination
    )

    const { pageIndex, pageSize } = state;

    return (
        <>
            <TablePagination
                pageIndex={pageIndex}
                gotoPage={gotoPage}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
                setPageSize={setPageSize}
                pageCount={pageCount}
                pageSize={pageSize}
                nextPage={nextPage}
                previousPage={previousPage}
            />
            <table {...getTableProps()} className="table table-striped table-hover">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="text-center align-middle">
                                        <div className="d-flex align-items-center">
                                            <span>
                                                {column.render('Header')}
                                            </span>
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? <ImSortAlphaDesc /> : <ImSortAlphaAsc />) : ''}
                                            </span>
                                        </div>
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
            <TableFooter
                pageIndex={pageIndex}
                pageOptions={pageOptions}
            />
        </>
    );
}
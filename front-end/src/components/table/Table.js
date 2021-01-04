import React from 'react';
import { useTable, usePagination } from 'react-table';
import './Table.css';
import TablePagination from './TablePagination';
import TableFooter from './TableFooter';

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
           <TableFooter
                pageIndex={pageIndex}
                pageOptions={pageOptions}
           />
        </>
    );
}
import React, {useState} from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import './Table.css';
import TablePagination from './TablePagination';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import {TableFilter} from './TableFilter';
import TableConfig from './TableConfig';
import AddButton from '../AddButton';
import { ImSortAlphaAsc, ImSortAlphaDesc } from 'react-icons/im';
import Tooltip from '@material-ui/core/Tooltip';
import { BsInfoCircle,BsPencil, BsTrash, BsGear } from 'react-icons/bs';
import IconButton from '@material-ui/core/IconButton';


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
        prepareRow,
        setGlobalFilter,
    } = useTable({
        columns: props.columns,
        data: props.data
    },  
        useGlobalFilter,
        useSortBy,
        usePagination
    )

    const { pageIndex, pageSize,globalFilter } = state;

    return (
        <>  
            <TableHeader title={props.title}/>
            <div className="d-flex justify-content-between align-items-center">
                <TableFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                <AddButton/>
                <TableConfig/>
            </div>
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
                            {   
                                <>
                                    <th className="text-center align-middle">
                                        <div className="d-flex align-items-center">
                                            Details
                                        </div>
                                    </th>
                                    <th className="text-center align-middle">
                                        <div className="d-flex align-items-center">
                                            Edit
                                        </div>
                                    </th>
                                    <th className="text-center align-middle">
                                        <div className="d-flex align-items-center">
                                            Delete
                                        </div>
                                    </th>
                                </>
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
                                {
                                    <>  
                                        <td>
                                            <Tooltip title="More">
                                                <IconButton aria-label="More">
                                                    <BsInfoCircle/>
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Tooltip title="Edit">
                                                <IconButton aria-label="Edit">
                                                    <BsPencil/>
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Tooltip title="Remove">
                                                <IconButton aria-label="Remove">
                                                    <BsTrash/>
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </>
                                }
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
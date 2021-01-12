import './Table.css';
import AddButton from '../buttons/AddButton';
import { 
    CircularProgress,
    Container
} from "@material-ui/core";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import React from 'react';
import RowActions from './RowActions';
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useExpanded,
} from "react-table";
import TableConfig from './TableConfig';
import {TableFilter} from './TableFilter';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';

export default function Table(props) {

    const {data, columns,title,crudActions}=props;

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
        allColumns,
    } = useTable({
        columns,
        data
    },  
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination
    )

    const { pageIndex, pageSize, globalFilter} = state;

    return (
        <>  
            <TableHeader title={title}/>
            <div className="d-flex justify-content-between align-items-center">
                <TableFilter 
                    filter={globalFilter} 
                    setFilter={setGlobalFilter}
                />
                <AddButton title={title} add={crudActions.create}/>
                <TableConfig 
                    allColumns={allColumns}
                />
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
                                <th className="text-center align-middle">
                                    Actions
                                </th>
                            }
                        </tr>
                    ))}
                </thead>
                {
                    data.length!==0
                    ?
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <>
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
                                        <RowActions data={row} headers={headerGroups} crudActions={crudActions}/>
                                    </tr>
                                </>
                            )
                        })}
                    </tbody>
                    :
                    null
                }
            </table>
            {
                data.length===0
                ?
                <Container maxWidth="sm">
                    <CircularProgress color="primary"/>
                </Container>
                :
                null
            }
            <TableFooter
                pageIndex={pageIndex}
                pageOptions={pageOptions}
            />
        </>
    );
}
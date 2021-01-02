import React, {useMemo} from 'react';
import {useTable} from 'react-table';
import {COLUMNS} from './columns';

export const SupplierTable = (props) => {

    const columns=useMemo(()=>COLUMNS,[]);
    const data =useMemo(()=>props.data.nodes,[]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    }=useTable({
        columns,
        data
    })

    return(
        <table {...getTableProps()} className="table table-striped table-hover">
            <thead> 
                {headerGroups.map(headerGroup =>(
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map(colum =>(
                                <th {...colum.getHeaderProps()} className="text-center align-middle">{colum.render('Header')}</th>
                            ))
                        }
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {   
                    rows.map( row => {
                        prepareRow(row);
                        return(
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell=>{
                                    return(
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}
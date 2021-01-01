import React, {useMemo} from 'react';
import {useTable} from 'react-table';

export const SupplierTable = (props) => {

    const columns = useMemo(()=>[
        {Header: 'Id', accessor: 'id'},
        {Header: 'Country', accessor: 'country'},
        {Header: 'Address', accessor: 'address'},
        {Header: 'Contact title', accessor: 'contactTitle'},
        {Header: 'City', accessor: 'city'},
        {Header: 'Phone', accessor: 'phone'},
        {Header: 'Contact name', accessor: 'contactName'},
        {Header: 'Postal code', accessor: 'postalCode'},
        {Header: 'Company name', accessor: 'companyName'},
    ],[]);

    const data =useMemo(()=>props.data,[]);

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
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup =>(
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map(colum =>(
                                <th {...colum.getHeaderProps()}>{colum.render('Header')}</th>
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
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}
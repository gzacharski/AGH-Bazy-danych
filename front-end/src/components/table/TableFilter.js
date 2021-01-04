import React, {useState} from 'react';
import {useAsyncDebounce} from 'react-table';
import {BiSearch} from 'react-icons/bi'

export const TableFilter = ({filter, setFilter}) =>{

    const [value,setValue]=useState(filter);

    const onChange=useAsyncDebounce(value=>{
        setFilter(value || undefined)
    },350);

    return (
        <div class="input-group mb-3">
            <span class="input-group-text"><BiSearch/></span>
            <input 
                type="text"
                className="form-control"
                placeholder="Filter the table..."
                value={value || ''}
                onChange={e=>{
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
            />
        </div>
    )
}

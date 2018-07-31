import React from 'react';

const Single = props => {


    return (
        
        <tr>
        <td>{props.note.item_id}</td>
        <td>{props.note.item_name}</td>
        <td>{props.note.contract_percent}</td>
        <td>{props.note.contract_amount}</td>
        <td>{props.note.billed_percent_todate}</td>
        <td>{props.note.billed_amount}</td>
        <td>{props.note.remaining_amount}</td>
        <td>{props.note.completed_percent}</td>
        <td><input type="" width="100px" value={props.note.contract_amount} /></td>
        <td><input type="button"
          name='button-1'
          value='great'
          onClick={this.onButtonClick} /></td>
        </tr>
    );
}

export default Single;
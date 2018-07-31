import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Grid from './components/Grid.js';
import GridInvoice from './components/GridInvoice.js';
import axios from 'axios';

var petrina_json = JSON.parse(JSON.stringify(require( './petrina.json' ) ));
var gridIndex = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      invoices: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/invoices/10138')
      .then(res => {
        //const posts = res.data.data.children.map(obj => obj.data);
        this.setState({ res });
      });
  }

  createSelectItems() {
    const data = [this.state.contract.invoices]; 
    let items = [];         
    //for (let i = 0; i <= 1; i++) {             
         //items.push(<option key={i} value={data[0]._id}>{data[0].invoice_number}</option>);   
         //here I will be creating my options dynamically based on
         //what props are currently passed to the parent component
         //alert(typeof data[0]);
         
    //}
    {this.state.contract.invoices.map((item, index) => {
      
        
      items.push(<option key={index} value={item._id}>{item.invoice_number}</option>);
                
    })}
    return items;
    //return JSON.parse(JSON.stringify(data));
}  

onDropdownSelected(e) {
   alert("THE VAL", e.target.value);
   //here you will see the current selected value of the select input
}

onGridIndexClick (e, index) {
  alert('onGridIndexClick: ' + e.target.value + ' ' + index);
  gridIndex = index;
  alert(gridIndex);
}; 

  render() {
    return (
      <div className="App">
        <Header name={this.state.contract.company_name} />
        <Grid notes={this.state.contract.invoice_items}  />
        <div>
        
        {this.state.contract.invoices.map((item, index) => {
      
        return (
          
          <input type="button" value={item.invoice_number} onClick={(e) => this.onGridIndexClick(e, index)} />

        )
    })}
        </div>
        <GridInvoice iItems={this.state.contract.invoices[2].invoice_items}  />
      </div>
    );
  }
}

export default App;

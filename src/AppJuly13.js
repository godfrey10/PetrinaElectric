import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Grid from './components/Grid.js';
import GridInvoice from './components/GridInvoice.js';
import axios from 'axios';

var petrina_json = JSON.parse(JSON.stringify(require( './petrina.json' ) ));
var gridIndex = 0;

// just grabbing the repos for a user
function getInvoices() {
  return axios.get("http://localhost:3001/invoices/");
}

// grabbing the user profile
function getContract() {
  return axios.get("http://localhost:3001/contract/");
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myInvoices: [],
      myContract: []
    }
  }



  componentDidMount() {
    axios.all([getInvoices(), getContract()])
      .then(res => {
        //const posts = res.data.data.children.map(obj => obj.data);
        const myInvoices = res[0].data;
        const myContract = res[1].data;
        this.setState({ myInvoices: myInvoices, myContract: myContract});
        alert(JSON.stringify(myInvoices, null, 2));
      });
  }


onGridIndexClick (e) {
  axios.get('http://localhost:3001/invoices/' + e.target.value)
  .then(res => {
    //const posts = res.data.data.children.map(obj => obj.data);
    const myInvoices = res.data;
  
    //this.setState({invoices: res.json});
    //alert(JSON.stringify(myInvoices));
    var txtJSON = document.getElementById("txtInvoice2");
    //txtJSON.value = jsonData;
    txtJSON.value = JSON.stringify(myInvoices, null, 2);
  })
  .catch(function (error) {
    alert(error);
 });
  //alert('onGridIndexClick: ' + e.target.value);
  //gridIndex = index;
  //alert(gridIndex);
}; 

onGridIndexClick1 (e) {
  var num = e.target.value
  alert("Hello " + JSON.stringify(this.state.myInvoices[num-1].invoice_items, null, 2));
  alert('onGridIndexClick: ' + e.target.value);
  //gridIndex = index;
  //alert(JSON.stringify(this.state));
  var txtJSON = document.getElementById("txtInvoice2");
  //txtJSON.value = jsonData;
  txtJSON.value = JSON.stringify(this.state.myInvoices[num-1], null, 2);
}; 

  render() {
    return (
      <div className="App">
        <Header name={this.state.myContract.map(contract => <b>{contract.company_name}</b>)} company_address={this.state.myContract.map(contract => <b>{contract.company_address}</b>)}/>
        
        <div>
        
        {this.state.myInvoices.map((item, index) => {
      
        return (
          
          <input type="button" value={item.invoice_number} onClick={(e) => this.onGridIndexClick(e)} />,
          <input type="button" value={item._id} onClick={(e) => this.onGridIndexClick1(e)} />,
          <Grid notes={this.state.myInvoices[index]}  />
          
        )
    })}
        </div>
        
        <div>
        
        
      
          
          
          <input type="button" value="Push Me!" onClick={(e) => this.onGridIndexClick1(e)} />

          <textarea cols="150" rows="50" id="txtInvoice2" />
    
        </div>
        
      </div>
    );
  }
}

export default App;

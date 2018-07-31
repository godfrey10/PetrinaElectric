import React from 'react';
import './grid.css';
import axios from 'axios';

var mainInvoice = JSON.stringify(require( '../petrina.json' ) );
var defInvoice = JSON.stringify(require( './defInvoice.json' ) );

class Grid extends React.Component {

    onButtonClick () {
        //alert('onButtonClick: ' + document.getElementById("invoice").innerHTML);

        var content = document.getElementById("invoice");
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }
    
    onCreateInvoiceClick () {
        const data = this.state;
        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);

        alert(this.state);
        //var jsonData = fs.readFileSync( "invoices" + "\\" + "invoice_1806.json", "utf8" );
        //var jsonData = JSON.stringify(JSON.parse([...this.props.notes]), null, 2);
        var jsonData = JSON.stringify(data, null, 2);
        //alert('onButtonClick: ' + jsonData);
        var txtJSON = document.getElementById("txtInvoice");
        //txtJSON.value = jsonData;
        txtJSON.value = jsonData;

        var newInvoice = {
            "_id" : "3",
            "invoice_number" : "10140",
            "invoice_date" : "2018-10-18T01:00:12.000Z",
            "invoice_total" : "0"
        }

        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);
        newInvoice.invoice_total = invoiceTotal;
        newInvoice.invoice_items = data.data;

        axios.post('http://localhost:3001/invoices/', newInvoice)
        .then(res => {
          //const posts = res.data.data.children.map(obj => obj.data);
          const myInvoices = res.data;
        
          //this.setState({invoices: res.json});
          //alert(JSON.stringify(myInvoices));
          var txtJSON = document.getElementById("txtInvoice");
          //txtJSON.value = jsonData;
          txtJSON.value = JSON.stringify(myInvoices, null, 2);
        })
    }

    onCreateInvoiceClick1 () {
        const data = [...this.props.notes];
        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);

        var newInvoice = {
            "_id" : "1",
            "invoice_number" : "10138",
            "invoice_date" : "2017-09-18T01:00:12.000Z",
            "invoice_total" : "0",
            "invoice_items" : []
        }

        //newInvoice['invoice_items'].push(data);
        newInvoice.invoice_total = invoiceTotal.toFixed(2);
        newInvoice.invoice_items.push(data);
        
        //defInvoice.invoice_items.push(data);
        var mainInvoice1 = JSON.parse(mainInvoice);
        mainInvoice1.contract.invoices.push(newInvoice);

        var contractValue = mainInvoice1.contract.contract_value.toFixed(2);
        mainInvoice1.contract.remaining_contract_value = contractValue - invoiceTotal.toFixed(2);

        //var jsonData = fs.readFileSync( "invoices" + "\\" + "invoice_1806.json", "utf8" );
        //var jsonData = JSON.stringify(JSON.parse(this.props.notes.json), null, 2);
        var jsonData = JSON.stringify(data, null, 2);
        //alert('onButtonClick: ' + jsonData);
        var txtJSON = document.getElementById("txtInvoice");
        //txtJSON.value = jsonData;
        txtJSON.value = JSON.stringify(mainInvoice1, null, 2);
    }

    onBlur(item, index, value) {
        //alert(JSON.stringify(item, null, 2));
        //const grdIndex = [...this.props.index1];
        //alert(grdIndex);
        if (value !== '') {
            var invoiceAmnt =  ((value / 100) * item.contract_amount);
            
            var remainingAmnt = parseFloat(item.contract_amount) - (parseFloat(item.billed_amount) + parseFloat(invoiceAmnt));
            var billedToDate = parseFloat(item.billed_amount) + parseFloat(invoiceAmnt);
            var billedPercentage = parseInt(item.billed_percent_todate) + parseInt(value);
            //alert(item.billed_amount + " " + invoiceAmnt);

            const data = [...this.props.notes.invoice_items];
            
            data[index]["invoice_percent"] = parseFloat(value).toFixed(2);
            data[index]["invoice_amount"] = parseFloat(invoiceAmnt).toFixed(2);
            data[index]["billed_amount"] = parseFloat(billedToDate).toFixed(2);
            data[index]["remaining_amount"] = parseFloat(remainingAmnt).toFixed(2);
            data[index]["billed_percent_todate"] = billedPercentage;
            data[index]["completed_percent"] = billedPercentage;
            //alert(value);
            // reset the state
            this.setState({ data });

            var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);

            invoiceTotal = invoiceTotal + invoiceAmnt;
            //alert(invoiceTotal);
            document.getElementById("spanInvoiceTotal").innerText = invoiceTotal.toFixed(2);
        }
    }

    validateJson (json) {
        let validJson
        
        try{
          validJson = JSON.stringify(JSON.parse(this.state.json), null, 2)
        } catch(e) {
          throw e
        }
        
        return validJson
      }

    render() {
        
        return (
            <div>
            <div>
                <input type="button" value="Print Invoice" onClick={(e) => this.onButtonClick()} />&nbsp;<input type="button" value="Create Invoice" onClick={(e) => this.onCreateInvoiceClick()} />
                <iframe id="ifmcontentstoprint" style={{position: 'absolute', height: 0+'px', width: 0+'px'}}></iframe>
            </div>
            <div id="invoice">
            <table class="blueTable">
            <thead>
            <tr>
            <th>Item</th>
            <th>Contract %</th>
            <th>Contract Amount</th>
            <th>Billed %</th>
            <th>Billed ToDate</th>
            <th>Remaining Amount</th>
            <th>Completed %</th>
            <th>Invoice %</th>
            <th>Invoice Amount</th>
            </tr>
            </thead>
            {this.props.notes.invoice_items.map((item, index) => {

                return (
                        <tr key={index}>
                            <td>{item.item_name}</td>
                            <td>{item.contract_percent}</td>
                            <td>{item.contract_amount}</td>
                            <td>{item.billed_percent_todate}</td>
                            <td>{item.billed_amount}</td>
                            <td>{item.remaining_amount}</td>
                            <td>{item.completed_percent}</td>
                            <td>
                                {item.completed_percent!=100 ? (
                                    <input type="text" width="20px" onBlur={(e) => this.onBlur(item, index, e.target.value)} />
                                ) : (
                                    <b>DONE</b>
                                )}
                            </td>
                            <td>{item.invoice_amount}</td>
                        </tr>
                        )
            })}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Invoice Total</td>
                    <td>$<span id="spanInvoiceTotal">{this.props.notes.invoice_total}</span></td>
                </tr>
            </table>
            </div>
            <textarea cols="150" rows="50" id="txtInvoice" />
            </div>
        );
    }
}

export default Grid;
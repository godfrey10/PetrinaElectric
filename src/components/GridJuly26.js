import React from 'react';
import './grid.css';
import axios from 'axios';
const formatCurrency = require('format-currency');

var mainInvoice = JSON.stringify(require( '../petrina.json' ) );
var defInvoice = JSON.stringify(require( './defInvoice.json' ) );

var invoiceTotal = 0;

class Grid extends React.Component {

    onButtonClick (itm) {
        //alert('onButtonClick: ' + document.getElementById("invoice").innerHTML);
        var data = this.state;
        var listItems = "";
        alert(data);

        if (data != null) {

            //var content = document.getElementById("prntInvoice");
            var content = document.getElementById(itm);
            var pri = document.getElementById("ifmcontentstoprint").contentWindow;

            pri.document.open();
            //pri.document.write(content.innerHTML);
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
        } else {
            
            data = [...this.props.notes.invoice_items];
            alert(data);    
        }
    }

    onButtonClearClick () {
        //alert('onButtonClick: ' + document.getElementById("invoice").innerHTML);
        var data = this.state;
        var listItems = "";
        //alert(data);

        if (data != null) {
            alert(data);
            data.forEach(function(key,value){
                
                    //alert(key.invoice_amount);
                    //alert(value)
                    data[value].invoice_amount = 0.00;
                    data[value].invoice_percent = 0;
                  })
            this.setState({ data });
            
        } else {
            
            var invoiceTotal = [...this.props.notes];
            data = [...this.props.notes.invoice_items];
            
            data.forEach(function(key,value){
                
                    //alert(key.invoice_amount);
                    //alert(value)
                    data[value].invoice_amount = 0.00;
                    data[value].invoice_percent = 0;
                  })
            this.setState({ data });
            //alert([...this.props.notes]);
        //);
        
        }
        document.getElementById("spanInvoiceTotal").innerText = "0.00"
    }

    onButtonClick1 (itm) {
        var data = [...this.props.notes.invoice_items];;
        alert(data);

        if (data != null) {

        
            
        } else {
            
            data = [...this.props.notes.invoice_items];
            
            
        
        }

        var inv_amnt = 0;
        var html = '<div id="invoice">';
        html += '<table class="blueTable" border="1">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Item</th>';
        html += '<th>Contract %</th>';
        html += '<th>Contract Amount</th>';
        html += '<th>Billed %</th>';
        html += '<th>Billed ToDate</th>';
        html += '<th>Remaining Amount</th>';
        html += '<th>Invoice %</th>';
        html += '<th>Invoice Amount</th>';
        html += '</tr>';
        html += '</thead>';
        data.forEach(function(key,value){

            
            html += '<tr>';
            html += '<td>' + data[value].item_name + '</td>';
            html += '<td>' + data[value].contract_percent + '</td>';
            html += '<td>' + formatCurrency(parseFloat(data[value].contract_amount).toFixed(2)) + '</td>';
            html += '<td>' + data[value].billed_percent_todate + '</td>';
            html += '<td>' + formatCurrency(parseFloat(data[value].billed_amount).toFixed(2)) + '</td>';
            html += '<td>' + formatCurrency(parseFloat(data[value].remaining_amount).toFixed(2)) + '</td>';
            html += '<td>';
                            if (data[value].remaining_amount != 100) {
                                html += parseInt(data[value].invoice_percent);
                             } else {
                                html += '<b>COMPLETED</b>';
                            }
                            html += '</td>';
                            html += '<td>' + formatCurrency(parseFloat(data[value].invoice_amount).toFixed(2)) + '</td>';
                            html += '</tr>';
                            inv_amnt += parseFloat(data[value].invoice_amount);
            })
            html += '<tr>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td>Invoice Total</td>';
            html += '<td>$' + formatCurrency(inv_amnt.toFixed(2)) + '</td>';
            html += '</tr>';
            html += '</table>';
            html += '</div>';

            var pri = document.getElementById("ifmcontentstoprint").contentWindow;
            
                        pri.document.open();
                        //pri.document.write(content.innerHTML);
                        pri.document.write(html);
                        pri.document.close();
                        pri.focus();
                        pri.print();
    }
    
    onCreateInvoiceClick () {
        //const data = this.state;
        const data = this.state;

        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);

        //alert(data);
        //var jsonData = fs.readFileSync( "invoices" + "\\" + "invoice_1806.json", "utf8" );
        //var jsonData = JSON.stringify(JSON.parse([...this.props.notes]), null, 2);
        var jsonData = JSON.stringify(data, null, 2);
        //alert('onButtonClick: ' + jsonData);
        var txtJSON = document.getElementById("txtInvoice");
        //txtJSON.value = jsonData;
        txtJSON.value = jsonData;

        var newInvoice = {
            "_id" : "3",
            "invoice_number" : "10141",
            "invoice_date" : "2018-10-18T01:00:12.000Z",
            "invoice_total" : "0"
        }

        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);
        //newInvoice._id = data.myInvoices
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

            invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal").innerText);

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
            <input type="button" value="Print Spreadsheet" onClick={(e) => this.onButtonClick1("prntInvoice")} />&nbsp;<input type="button" value="Print Invoice" onClick={(e) => this.onButtonClick("prntInvoice")} />&nbsp;<input type="button" value="Create Invoice" onClick={(e) => this.onCreateInvoiceClick()} />&nbsp;<input type="button" value="Clear Invoice" onClick={(e) => this.onButtonClearClick()} />
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
                            <td>
                                {item.completed_percent!=100 ? (
                                    <input type="text" width="20px" onBlur={(e) => this.onBlur(item, index, e.target.value)} />
                                ) : (
                                    <b>COMPLETED</b>
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
                    <td>Invoice Total</td>
                    <td>$<span id="spanInvoiceTotal">{this.props.notes.invoice_total}</span></td>
                </tr>
            </table>
            </div>
            <textarea cols="150" rows="50" id="txtInvoice" />
            <div id="prntInvoice">        
                        <div>
                        <table width="100%">
                        <tbody>
                        <tr>
                        <td width="100%" height="100px" align="center">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="100%" align="center"><b>DRAGO PETRINA ELECTRICAL CONTRACTOR LTD.</b></td>
                        </tr>
                        <tr>
                        <td width="100%" align="center"><b>2651 WESTBROOK RD. RR#1</b></td>
                        </tr>
                        <tr>
                        <td width="100%" align="center"><b>SMITHVILLE, ONTARIO L0R 2A0</b></td>
                        </tr>
                        <tr>
                        <td width="100%" align="center">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="100%" align="center">&nbsp;</td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                        <div>
                        <table width="100%">
                        <tbody>
                        <tr>
                        <td width="20%" align="left"><b>Invoice to:</b></td>
                        <td width="60%" align="left">Walkers Green Residences Limited c/o Tobyn Park Homes</td>
                        <td width="20%" align="right"><b>Invoice #:</b>&nbsp;1039</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left"><b>Address:</b></td>
                        <td width="60%" align="left">c/o Construction Manager: Wilkinson Construction Services Inc.</td>
                        <td width="20%" align="right"><b>Date:</b> June 25, 2018</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left">&nbsp;</td>
                        <td width="60%" align="left">37 Polson Street</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left">&nbsp;</td>
                        <td width="60%" align="left">Toronto, ON</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left">&nbsp;</td>
                        <td width="60%" align="left">M5A 1A4</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left">&nbsp;</td>
                        <td width="60%" align="left">&nbsp;</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left"><b>Re:</b></td>
                        <td width="60%" align="left">Park City Building 2 - 4050 Upper Middle Road, Burlington, ON</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="20%" align="left"><b>Progress Billing #</b></td>
                        <td width="60%" align="left">10139</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                          <tr>
                        <td width="20%" align="left"><b>Attn:</b></td>
                        <td width="60%" align="left">Jeff Wilkinson</td>
                        <td width="20%">&nbsp;</td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                        <div>
                        <table width="100%">
                        <tbody>
                        <tr colspan="2">
                        <td width="100%">&nbsp;</td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Total Contract Value</td>
                        <td width="20%" align="right">$1,424,157.00</td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Previously Billed Invoices</td>
                        <td width="20%" align="right">$97,728.25</td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Remaining Contract Value</td>
                        <td width="20%" align="right">${formatCurrency(1424157-97728.25-27663.20)}</td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                        <div>
                        <table width="100%">
                        <tbody>
                        <tr colspan="2">
                        <td width="100%">&nbsp;</td>
                        </tr>
                        <tr colspan="2">
                        <td width="100%"><hr width="100%" size="3" color="#000000"></hr></td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Current Invoice</td>
                        <td width="20%">${formatCurrency(invoiceTotal)}</td>
                        </tr>
                        <tr colspan="2">
                        <td width="100%"><hr width="100%" size="3" color="#000000"></hr></td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Subtotal</td>
                        <td width="20%">${formatCurrency(invoiceTotal)}</td>
                        </tr>
                        <tr colspan="2">
                        <td width="100%"><hr width="100%" size="3" color="#000000"></hr></td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">HST # 101480002RT</td>
                        <td width="20%">${formatCurrency((invoiceTotal * 0.13).toFixed(2))}</td>
                        </tr>
                        <tr colspan="2">
                        <td width="100%"><hr width="100%" size="3" color="#000000"></hr></td>
                        </tr>
                        <tr>
                        <td width="80%" align="left">Total Payable This Invoice</td>
                        <td width="20%" align="right">${formatCurrency(((invoiceTotal) + parseFloat((invoiceTotal * 0.13).toFixed(2))).toFixed(2))}</td>
                        </tr>
                        <tr colspan="2">
                        <td width="100%"><hr width="100%" size="3" color="#000000"></hr></td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                        </div>
            </div>
        );
    }
}

export default Grid;
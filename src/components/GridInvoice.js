import React from 'react';
import './grid.css';
const fs = require( 'fs' );

var mainInvoice = JSON.stringify(require( '../petrina.json' ) );
var defInvoice = JSON.stringify(require( './defInvoice.json' ) );

class GridInvoice extends React.Component {

    onButtonClick1 () {
        //alert('onButtonClick: ' + document.getElementById("invoice").innerHTML);

        var content = document.getElementById("invoice1");
        var pri = document.getElementById("ifmcontentstoprint1").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }; 
    
    onCreateInvoiceClick1 () {
        const data = [...this.props.iItems];
        var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal1").innerText);

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
        //var jsonData = JSON.stringify(JSON.parse(this.props.iItems.json), null, 2);
        var jsonData = JSON.stringify(data, null, 2);
        //alert('onButtonClick: ' + jsonData);
        var txtJSON = document.getElementById("txtInvoice1");
        //txtJSON.value = jsonData;
        txtJSON.value = JSON.stringify(mainInvoice1, null, 2);
        
        //if ( isEmpty( jsonData ) == false ) {
        //jsonData = {"name":"Darren"};

        //fs.writeFileSync( "invoices" + "\\" + "invoice_1806.json", JSON.stringify( jsonData, null, '    ' ));
        //}

        //download(new Blob(["hello world"]), "dlTextBlob.txt", "text/plain");
    }; 

    onBlur1(item, index, value) {
        //alert(value);
        if (value != '') {
            var invoiceAmnt =  (value / 100) * parseFloat(item.remaining_amount);
            var remainingAmnt = parseFloat(item.remaining_amount) - invoiceAmnt;
            var billedToDate = parseFloat(item.billed_amount) + invoiceAmnt;
            var billedPercentage = parseFloat(item.billed_percent_todate) + parseFloat(value);
            //alert(item.billed_amount + " " + invoiceAmnt);

            const data = [...this.props.iItems];
            
            data[index]["invoice_percent"] = value;
            data[index]["invoice_amount"] = invoiceAmnt.toFixed(2);
            data[index]["billed_amount"] = billedToDate.toFixed(2);
            data[index]["remaining_amount"] = remainingAmnt.toFixed(2);
            data[index]["billed_percent_todate"] = billedPercentage;
            data[index]["completed_percent"] = billedPercentage;
            //alert(value);

            this.setState({ data });

            var invoiceTotal = parseFloat(document.getElementById("spanInvoiceTotal1").innerText);

            invoiceTotal = invoiceTotal + invoiceAmnt;
            //alert(invoiceTotal);
            document.getElementById("spanInvoiceTotal1").innerText = invoiceTotal.toFixed(2);
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
                <input type="button" value="Print Invoice" onClick={(e) => this.onButtonClick1()} />&nbsp;<input type="button" value="Create Invoice" onClick={(e) => this.onCreateInvoiceClick1()} />
                <iframe id="ifmcontentstoprint1" style={{position: 'absolute', height: 0+'px', width: 0+'px'}}></iframe>
            </div>
            <div id="invoice1">
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
            {this.props.iItems.map((item, index) => {

                return (
                        <tr key={index}>
                            <td>{item.item_name}</td>
                            <td>{item.contract_percent}</td>
                            <td>{item.contract_amount}</td>
                            <td>{item.billed_percent_todate}</td>
                            <td>{item.billed_amount}</td>
                            <td>{item.remaining_amount}</td>
                            <td>{item.completed_percent}</td>
                            <td><input type="text" width="20px" onBlur={(e) => this.onBlur1(item, index, e.target.value)} /></td>
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
                    <td>$<span id="spanInvoiceTotal1">0</span></td>
                </tr>
            </table>
            </div>
            <textarea cols="150" rows="50" id="txtInvoice1" />
            </div>
        );
    }
}

export default GridInvoice;
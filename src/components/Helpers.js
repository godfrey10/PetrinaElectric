var axios = require('axios');

function getInvoice(invoiceId){
  return axios.get('http://localhost:3001/invoices/' + invoiceId);
}

function getInvoices(username){
  return axios.get('http://localhost:3001/invoices/');
}

var helpers = {
  getInvoiceInfo: function(invoiceId){
    return axios.all([getInvoice(invoiceId), getInvoices()])
      .then(function(arr){
        return {
          invoice: arr[0].data,
          invoices: arr[1].data
        }
      })
  }
}

module.exports = Helpers;
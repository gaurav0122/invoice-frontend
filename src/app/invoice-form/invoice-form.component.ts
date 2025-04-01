import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceRequest } from '../service/InvoiceRequestModel';
import { ClientServiceService } from '../service/client-service.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {

  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder, private invoiceService:ClientServiceService) {
    this.invoiceForm = this.fb.group({
      firmName: ['', Validators.required],
      firmAddress: ['', Validators.required],
      invoiceNumber:[0,Validators.required],
      items: this.fb.array([this.createItem()],Validators.required)
    });
  }

  // Get items as FormArray
  get items(): FormArray {
    return <FormArray> this.invoiceForm.get('items') ;
  }

  // Create a new item row
  createItem(): FormGroup {
    return this.fb.group({
      particular: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Add new item row
  addItem(): void {
    console.log(this.invoiceForm.get('items'))
    this.items.push(this.createItem());
  }

  // Remove an item row
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // Calculate total price
  getTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('qty')?.value || 0;
      const rate = item.get('rate')?.value || 0;
      return sum + qty * rate;
    }, 0);
  }

  // Submit Form
  submitInvoice(): void {
    console.log('Invoice Data:', this.invoiceForm.value);
    const formValues = this.invoiceForm.value;
    const invoice: InvoiceRequest = {
      firmName: formValues.firmName,
      firmAddress: formValues.firmAddress,
      invoiceNumber: formValues.invoiceNumber,
      items: formValues.items.map((item: any) => ({
        particular: item.particular,
        qty: item.qty,
        rate: item.rate
      }))
    };

    this.generatePdf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Gaurav Enterprises</title>
    <style>
    @media print {
       @page {
          margin: 0; /* Removes default margin */
          size: auto; /* Ensures full-page printing */
       }

        body {
          margin: 0;
          padding: 0;
       }
     }
        body {
            font-family: Arial, sans-serif;
        }
        .invoice-container {
            width: 700px;
            margin: auto;
            border: 2px solid red;
            padding: 20px;
        }
        .top-header{
            text-align: center;
            font-size: 14px;
            margin-left:50px;
            margin-right: 50px;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            color: red;
            position: relative;
        }
        .header img {
            position: absolute;
            left: 20px;
            top: -10px;
            width: 80px;
            height: auto;
        }
        .sub-header {
            text-align: center;
            font-size: 14px;
            margin-left:50px;
            margin-right: 50px;
        }
        .info {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
        }
        .quotaion-text{
            text-align: center;
        }
        .table-container {
            margin-top: 20px;
            width: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        .total {
            text-align: right;
            font-weight: bold;
            margin-top: 20px;
        }
        .signature {
            margin-top: 30px;
            text-align: right;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="invoice-container">
        <div class="top-header">
            <strong> || Shri Bhairvanath Prasanna ||</strong>
        </div>
        <div class="header">
            <img src="datta_image.jpg" alt=""> <!-- Replace with actual image file -->
            GAURAV ENTERPRISES
        </div>
        <div class="sub-header">
            Motor Rewinding with Maintenance | A/C, Fridge, Washing Machine,<br>Chiller & Home Appliances Repairing <br>
            Hingangada, Post-Roti, Tal. Daund, Dist. Pune <br>Mob: 9970957065, 9960928125
        </div>
        <br>
        <br>
        <div class="info">
            <div>
                <strong>M/s: </strong> <br>

            </div>
            <div>
                <strong>No:</strong> 0 <br>
                <strong>Date:</strong> 01/04/2025
            </div>
        </div>
        <h2 class="quotaion-text"> Quotation </h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>S. No</th>
                        <th>PARTICULARS</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount Rs.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td></td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="total">
            <strong>Total: 0/-</strong> <br>
            <em>In words: Zero only.</em>
        </div>

        <div class="signature">
            For Gaurav Enterprises <br><br>
            ____________________________
        </div>
    </div>

</body>
</html>`);
    // this.invoiceService.getStringResponse(invoice).subscribe(data=>{
    //   this.generatePdf(data.htmlData);
    // },err=>{
    //   alert("pdf generation issue")
    // });
  }

  generatePdf(htmlContent: string) {
    const printWindow = window.open('', '', 'height=500,width=800');
    if (printWindow) {

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }

  }

  ngOnInit(): void {
  }

}

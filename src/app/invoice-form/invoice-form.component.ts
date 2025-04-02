import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceRequest } from '../service/InvoiceRequestModel';
import { ClientServiceService } from '../service/client-service.service';
import * as jsPDF from 'jspdf';

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

    this.invoiceService.getStringResponse(invoice).subscribe((data:any)=>{
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'generated.pdf';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    });
  }


  ngOnInit(): void {
  }

}

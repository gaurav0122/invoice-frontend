interface Item {
  particular: string;
  qty: number;
  rate: number;
}

export interface InvoiceRequest {
  firmName: string;
  firmAddress: string;
  invoiceNumber: number;
  items: Item[];
}

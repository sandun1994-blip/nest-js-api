export interface OrderData {
  supplierAddress1?: string;
  supplierAddress2?: string;
  supplierAddress3?: string;
  stockLocationAddress1?: string;
  stockLocationAddress2?: string;
  stockLocationAddress3?: string;
  stockLocationAddress4?: string;
  purchaseOrder: number;
  calcReOrd?: string;
  email?: string;
  fax?: string;
  phone?: string;
  orderDate?: string;
  dispatchDate?: string;
  supplierCode?: string;
  ourCode?: string;
  description?: string;
  unit?: string;
  notes?: string;
  lineTotal?: number;
  name?: string;
  defLocationNo?: string;
  narrativeText?: string;
  loggedInUser?: string;
  statusDesc?: string;
  unitPriceExGst?: number;
}

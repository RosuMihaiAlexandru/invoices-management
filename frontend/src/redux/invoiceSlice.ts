import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store'; // Import RootState for typings

interface Invoice {
  id: number;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string;
  paid: boolean;
}

interface InvoiceState {
  invoices: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  totalCount: number;
  totalPages: number;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [], 
  status: 'idle',
  error: null,
  totalCount: 0,
  totalPages: 0,
};

// Fetch invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async ({page, limit} : {page: number, limit: number}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.access_token || localStorage.getItem('access_token');

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`http://localhost:3000/api/invoices?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch invoices");

      const invoices = await response.json();

      return { invoices: invoices.data, totalCount: invoices.totalInvoices, totalPages: invoices.totalPages };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update invoice status (paid/unpaid)
export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateInvoiceStatus',
  async ({ invoiceId, status }: { invoiceId: number, status: boolean }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        body: JSON.stringify({ paid: status }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update invoice status');
      const data = await response.json();
      
      return { invoiceId, status: data.paid };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices = action.payload.invoices;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        const { invoiceId, status } = action.payload;
        const invoice = state.invoices.find((inv) => inv.id === invoiceId);
        if (invoice) {
          invoice.paid = status;
        }
      });
  },
});

export default invoiceSlice.reducer;

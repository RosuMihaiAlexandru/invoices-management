import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices, updateInvoiceStatus } from "../../redux/invoiceSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { FiMenu, FiBell, FiSettings, FiUser, FiLogOut } from "react-icons/fi";

export const Invoices = () => {
  const { invoices, totalCount, totalPages, status, error } = useSelector(
    (state: RootState) => state.invoices
  );
  const dispatch = useDispatch<AppDispatch>();

  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedInvoices, setSortedInvoices] = useState(invoices);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;


  useEffect(() => {
    dispatch(fetchInvoices({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    setSortedInvoices(invoices);
  }, [invoices]);

  // Handle previous page
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent going below 1
  };

  // Handle next page
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages)); // Prevent going beyond totalPages
  };

  // Handle page number click
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column: keyof typeof invoices[0]) => {
    const sorted = [...invoices].sort((a, b) => {
      if (column === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (column === "due_date") {
        return sortDirection === "asc"
          ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          : new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      } else {
        const aValue = a[column] as string;
        const bValue = b[column] as string;
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });
    setSortedInvoices(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // const isAllSelected = selectedInvoices.length === invoices.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInvoices(invoices.map((invoice) => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (e: React.ChangeEvent<HTMLInputElement>, invoiceId: number) => {
    if (e.target.checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  const handleToggleStatus = (invoiceId: number) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      dispatch(updateInvoiceStatus({ invoiceId, status: !invoice.paid }));
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-2/5 md:w-1/5 p-5 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h3 className="text-2xl font-semibold mb-6">Dashboard</h3>
        <ul className="space-y-4">
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800">Home</a>
          </li>
          <li>
            <a href="/invoices" className="block py-2 px-4 rounded hover:bg-gray-800">Invoices</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="w-3/5 md:w-4/5 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 cursor-pointer">
            <FiMenu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search..." className="px-3 py-2 border rounded focus:ring focus:ring-blue-300" />
            <FiBell size={24} className="text-gray-600 cursor-pointer" />
            <FiSettings size={24} className="text-gray-600 cursor-pointer" />
            <FiUser size={24} className="text-gray-600 cursor-pointer" />
            <FiLogOut size={24} className="text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* Table */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invoices</h2>

          {status === "loading" ? (
            <p>Loading invoices...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">
                      <input type="checkbox" onChange={handleSelectAll} />
                    </th>
                    <th className="p-3 border cursor-pointer" onClick={() => handleSort("due_date")}>
                      Date
                    </th>
                    <th className="p-3 border">Payee</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border cursor-pointer" onClick={() => handleSort("amount")}>
                      Amount
                    </th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices && sortedInvoices.length && sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="p-3 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => handleSelectInvoice(e, invoice.id)}
                        />
                      </td>
                      <td className="p-3 border">{new Date(invoice.due_date).toLocaleDateString()}</td>
                      <td className="p-3 border">{invoice.vendor_name}</td>
                      <td className="p-3 border">{invoice.description}</td>
                      <td className="p-3 border">${invoice.amount.toFixed(2)}</td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleToggleStatus(invoice.id)}
                          className={`px-3 py-1 rounded text-white ${invoice.paid ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {invoice.paid ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between my-4">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium"> {currentPage} </span>
                    to
                    <span className="font-medium"> {currentPage + limit - 1} </span>
                    of
                    <span className="font-medium"> {totalCount} </span>
                    results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                    <a
                      href="#"
                      onClick={goToPreviousPage}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path
                          fillRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>

                    {[...Array(totalPages)].map((_, index) => (
                      <a
                        href="#"
                        onClick={() => goToPage(index + 1)}
                        key={index}
                        aria-current={currentPage === index + 1 ? 'page' : undefined}
                        className={`relative z-10 inline-flex items-center ${currentPage === index + 1 ? 'bg-indigo-600 text-white focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0'} px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2`}
                      >
                        {index + 1}
                      </a>
                    ))}

                    <a
                      href="#"
                      onClick={goToNextPage}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path
                          fillRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

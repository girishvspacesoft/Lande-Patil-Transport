import { API_BASE_PATH_TRANSACTIONS } from "./api-base-paths";

const getUserData = () => {
  return JSON.parse(localStorage.getItem("userData"));
};

const getEmpId = (loggedInUser) => {
  return loggedInUser &&
    loggedInUser.type &&
    loggedInUser.type.toLowerCase() === "superadmin"
    ? loggedInUser?._id
    : loggedInUser?.employee?._id;
};

export const getLorryReceipts = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLorryReceipts`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLorryReceiptsWithCount = (page, branchId, limit, filterData, type, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLorryReceiptsWithCount`, {
    method: "POST",
    body: JSON.stringify({
      branch: branchId,
      pagination: { limit, page: page },
      filterData,
      type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLorryReceiptsWithCountDateRange = (
  page,
  limit,
  branchId,
  controller,
  rangeDates
) => {
  return fetch(
    `${API_BASE_PATH_TRANSACTIONS}/getLorryReceiptsWithCountDateRange`,
    {
      method: "POST",
      body: JSON.stringify({
        branch: branchId,
        pagination: { limit, page: page },
        ...rangeDates,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }
  ).then((response) => response.json());
};

export const getAllLorryReceiptsWithCount = (page, limit, filterData, type, branch, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getAllLorryReceiptsWithCount`, {
    method: "POST",
    body: JSON.stringify({ pagination: { limit, page: page }, filterData, type, branch }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateLorryReceiptDateRange = (docs, controller) => {
  const filterDocs = docs.filter((item) => item.change);

  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateLorryReceiptDateRange`, {
    method: "POST",
    body: JSON.stringify({ docs: filterDocs }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getAllLorryReceiptsDateRange = (page, limit, rangeDates, controller) => {
  return fetch(
    `${API_BASE_PATH_TRANSACTIONS}/getAllLorryReceiptsWithCountDateRange`,
    {
      method: "POST",
      body: JSON.stringify({
        pagination: { limit: limit, page: page },
        ...rangeDates,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }
  ).then((response) => response.json());
};

export const getLorryReceiptsByConsignor = (
  branchId,
  consignorId,
  controller
) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLorryReceiptsByConsignor`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId, consignor: consignorId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addLorryReceipt = (lorryReceipt, controller) => {
  lorryReceipt.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addLorryReceipt`, {
    method: "POST",
    body: JSON.stringify(lorryReceipt),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeLorryReceipt = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/removeLorryReceipt/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const viewLorryReceipt = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/viewLorryReceipt/${id}`, {
    signal: controller?.signal,
  }).then((response) => response.blob());
};

export const downloadLorryReceipt = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/downloadLorryReceipt/${id}`, {
    signal: controller?.signal,
  }).then((response) => response.blob());
};

export const getLorryReceipt = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLorryReceipt/${id}`, {
    signal: controller?.signal,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateLorryReceipt = (lorryReceipt, controller) => {
  const id = lorryReceipt._id;
  lorryReceipt.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateLorryReceipt/${id}`, {
    method: "PUT",
    body: JSON.stringify(lorryReceipt),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLoadingSlips = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLoadingSlips`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLoadingSlipsById = (lsList, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLoadingSlipsById`, {
    method: "POST",
    body: JSON.stringify({ lsList: lsList }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addLoadingSlip = (loadingSlip, controller) => {
  loadingSlip.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addLoadingSlip`, {
    method: "POST",
    body: JSON.stringify(loadingSlip),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeLoadingSlip = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/removeLoadingSlip/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLoadingSlip = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLoadingSlip/${id}`, {
    signal: controller?.signal,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateLoadingSlip = (loadingSlip, controller) => {
  const id = loadingSlip._id;
  loadingSlip.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateLoadingSlip/${id}`, {
    method: "PUT",
    body: JSON.stringify(loadingSlip),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getMoneyTransfers = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getMoneyTransfers`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addMoneyTransfer = (moneyTransfer, controller) => {
  moneyTransfer.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addMoneyTransfer`, {
    method: "POST",
    body: JSON.stringify(moneyTransfer),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeMoneyTransfer = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/removeMoneyTransfer/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateMoneyTransfer = (moneyTransfer, controller) => {
  const id = moneyTransfer._id;
  moneyTransfer.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateMoneyTransfer/${id}`, {
    method: "PUT",
    body: JSON.stringify(moneyTransfer),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getMoneyTransfer = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getMoneyTransfer/${id}`, {
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPettyTransactions = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getPettyTransactions`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addPettyTransaction = (transaction, controller) => {
  transaction.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addPettyTransaction`, {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPettyCashBalance = (controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getPettyCashBalance`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPettyTransactionsByDate = (transaction, controller) => {
  const updatedTransaction = { ...transaction };
  const year = new Date(updatedTransaction.endDate).getFullYear();
  const month = new Date(updatedTransaction.endDate).getMonth() + 1;
  const day = new Date(updatedTransaction.endDate).getDate();
  const newDate = `${year}-${month}-${day + 1}`;
  let endDate = new Date(newDate).setUTCHours(23, 59, 59, 999);
  endDate = new Date(endDate).toISOString();
  updatedTransaction.endDate = endDate;
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getPettyTransactionsByDate`, {
    method: "POST",
    body: JSON.stringify(updatedTransaction),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLorryReceiptsByDate = (lrSearch, controller) => {
  const updatedLRSearch = { ...lrSearch };
  const year = new Date(updatedLRSearch.endDate).getFullYear();
  const month = new Date(updatedLRSearch.endDate).getMonth() + 1;
  const day = new Date(updatedLRSearch.endDate).getDate();
  const newDate = `${year}-${month}-${day + 1}`;
  let endDate = new Date(newDate).setUTCHours(23, 59, 59, 999);
  endDate = new Date(endDate).toISOString();
  updatedLRSearch.endDate = endDate;
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLorryReceiptsByDate`, {
    method: "POST",
    body: JSON.stringify(updatedLRSearch),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBills = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getBills`, {
    method: "POST",
    body: JSON.stringify({ branch: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBillsByCustomer = (customer, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getBillsByCustomer`, {
    method: "POST",
    body: JSON.stringify({ customer: customer }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addBill = (bill, controller) => {
  bill.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addBill`, {
    method: "POST",
    body: JSON.stringify(bill),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeBill = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/removeBill/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBill = (id, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getBill/${id}`, {
    signal: controller?.signal,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateBill = (bill, controller) => {
  const id = bill._id;
  bill.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateBill/${id}`, {
    method: "PUT",
    body: JSON.stringify(bill),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateBills = (bills, controller) => {
  bills.forEach((bill) => {
    if (bill.payment) {
      bill.payment.createdBy = getEmpId(getUserData());
    }
  });
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateBills`, {
    method: "POST",
    body: JSON.stringify({ bills: bills }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLoadingSlipsBySupplier = (supplier, controller) => {
  return fetch(
    `${API_BASE_PATH_TRANSACTIONS}/getLoadingSlipsBySupplier/${supplier}`,
    {
      signal: controller?.signal,
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json());
};

export const saveSupplierPayments = (loadingSlips, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/saveSupplierPayments`, {
    method: "POST",
    body: JSON.stringify({ loadingSlips: loadingSlips }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  });
};

export const saveSupplierBill = (supplierBill, controller) => {
  if (supplierBill) {
    supplierBill.createdBy = getEmpId(getUserData());
  }
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/saveSupplierBill`, {
    method: "POST",
    body: JSON.stringify(supplierBill),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getSupplierBills = (supplier, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getSupplierBills/${supplier}`, {
    signal: controller?.signal,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateSupplierBills = (supplierBills, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updateSupplierBills`, {
    method: "POST",
    body: JSON.stringify({ supplierBills: supplierBills }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateLorryReceiptAck = (lr, controller) => {
  lr.updatedBy = getUserData()?.userId;
  const formData = new FormData();
  formData.append("ack", lr.ack);

  return fetch(
    `${API_BASE_PATH_TRANSACTIONS}/updateLorryReceiptAck/${lr._id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${getUserData()?.auth?.token}`,
      },
      signal: controller?.signal,
    }
  ).then((response) => response.json());
};

export const removeLorryReceiptAck = (lrId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/removeLorryReceiptAck/${lrId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addPaymentAdvice = (lorryReceipts, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addPaymentAdvice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    body: JSON.stringify({ lorryReceipts: lorryReceipts }),
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPaymentReceipts = (controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getPaymentReceipts`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addPaymentReceipt = (paymentReceipt, controller) => {
  paymentReceipt.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/addPaymentReceipt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    body: JSON.stringify(paymentReceipt),
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLRForPaymentReceipt = (controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLRForPaymentReceipt`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getLRForPaymentReceiptById = (controller, id) => {
  return fetch(
    `${API_BASE_PATH_TRANSACTIONS}/getLRForPaymentReceiptById/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getUserData()?.auth?.token}`,
      },
      signal: controller?.signal,
    }
  ).then((response) => response.json());
};

export const getLastPaymentReceiptNo = (controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getLastPaymentReceiptNo`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const downloadPaymentReceipt = (prId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/downloadPaymentReceipt/${prId}`, {
    signal: controller?.signal,
    headers: {
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
  }).then((response) => response.blob());
};

export const getPaymentReceipt = (prId, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/getPaymentReceipt/${prId}`, {
    signal: controller?.signal,
    headers: {
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
  }).then((response) => response.json());
};

export const updatedPaymentReceipt = (paymentReceipt, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/updatedPaymentReceipt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    body: JSON.stringify(paymentReceipt),
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const deletePaymentReceipt = (paymentReceipt, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/deletePaymentReceipt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    body: JSON.stringify(paymentReceipt),
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const downloadMISReport = (dateRange, controller) => {
  return fetch(`${API_BASE_PATH_TRANSACTIONS}/downloadMISReport`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserData()?.auth?.token}`,
    },
    body: JSON.stringify(dateRange),
    signal: controller?.signal,
  }).then((response) => response.blob());
  // }).then((response) => response.json());
};

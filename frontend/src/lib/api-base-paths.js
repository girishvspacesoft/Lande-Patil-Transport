export const API_BASE_PATH_MASTER = process.env.NODE_ENV !== "development" ? process.env.REACT_APP_API_BASE_PATH_MASTER : "http://localhost:4200/api/master";
export const API_BASE_PATH_TRANSACTIONS = process.env.NODE_ENV !== "development" ? process.env.REACT_APP_API_BASE_PATH_TRANSACTIONS : "http://localhost:4200/api/transactions";
export const API_BASE_PATH_USER = process.env.NODE_ENV !== "development" ? process.env.REACT_APP_API_BASE_PATH_USER : "http://localhost:4200/api/user";
export const BILLS_PATH = process.env.NODE_ENV !== "development" ? process.env.REACT_APP_BILLS_PATH : "http://localhost:4200/bills/";
export const PR_PATH = process.env.NODE_ENV !== "development" ? process.env.REACT_APP_PR_PATH : "http://localhost:4200/payment-receipts/";

// export const API_BASE_PATH_MASTER = "https://api.jrvtranslines.com/api/master";
// export const API_BASE_PATH_TRANSACTIONS =
//   "https://api.jrvtranslines.com/api/transactions";
// export const API_BASE_PATH_USER = "https://api.jrvtranslines.com/api/user";
// export const BILLS_PATH = "https://api.jrvtranslines.com/bills/";
// export const PR_PATH = "https://api.jrvtranslines.com/payment-receipts/";

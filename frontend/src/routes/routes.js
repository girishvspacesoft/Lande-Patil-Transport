import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoadingSpinner from "../components/UI/LoadingSpinner";
import RequireAuth from "../lib/RequireAuth";

import Welcome from "../pages/Welcome";

const UserList = lazy(() => import("../components/user/UsersList"));
const UserRegistration = lazy(() =>
  import("../components/user/UserRegistration")
);
const UserPermissions = lazy(() =>
  import("../components/user/UserPermissions")
);
const UserEdit = lazy(() => import("../components/user/UserEdit"));
// const Articles = lazy(() =>
//   import("../components/master/Articles/ArticlesList")
// );
// const ArticleAdd = lazy(() =>
//   import("../components/master/Articles/ArticleAdd")
// );
// const ArticleEdit = lazy(() =>
//   import("../components/master/Articles/ArticleEdit")
// );
const Reports = lazy(() => import("../pages/Reports"));
const Places = lazy(() => import("../components/master/Places/PlacesList"));
const PlaceAdd = lazy(() => import("../components/master/Places/PlaceAdd"));
const PlaceEdit = lazy(() => import("../components/master/Places/PlaceEdit"));
const BranchList = lazy(() =>
  import("../components/master/Branches/BranchList")
);
const BranchAdd = lazy(() => import("../components/master/Branches/BranchAdd"));
const BranchEdit = lazy(() =>
  import("../components/master/Branches/BranchEdit")
);
const Customers = lazy(() =>
  import("../components/master/Customers/CustomersList")
);
const CustomerAdd = lazy(() =>
  import("../components/master/Customers/CustomerAdd")
);
const CustomerEdit = lazy(() =>
  import("../components/master/Customers/CustomerEdit")
);
const Drivers = lazy(() => import("../components/master/Drivers/DriversList"));
const DriverAdd = lazy(() => import("../components/master/Drivers/DriverAdd"));
const DriverEdit = lazy(() =>
  import("../components/master/Drivers/DriverEdit")
);
const Employees = lazy(() =>
  import("../components/master/Employees/EmployeeList")
);
const EmployeeAdd = lazy(() =>
  import("../components/master/Employees/EmployeeAdd")
);
const EmployeeEdit = lazy(() =>
  import("../components/master/Employees/EmployeeEdit")
);
const Vehicles = lazy(() =>
  import("../components/master/Vehicles/VehiclesList")
);
const VehicleAdd = lazy(() =>
  import("../components/master/Vehicles/VehicleAdd")
);
const VehicleEdit = lazy(() =>
  import("../components/master/Vehicles/VehicleEdit")
);
const VehicleTypes = lazy(() =>
  import("../components/master/VehicleTypes/VehicleTypesList")
);
const VehicleTypeAdd = lazy(() =>
  import("../components/master/VehicleTypes/VehicleTypeAdd")
);
const VehicleTypeEdit = lazy(() =>
  import("../components/master/VehicleTypes/VehicleTypeEdit")
);
const Suppliers = lazy(() =>
  import("../components/master/Suppliers/SuppliersList")
);
const SupplierAdd = lazy(() =>
  import("../components/master/Suppliers/SupplierAdd")
);
const SupplierEdit = lazy(() =>
  import("../components/master/Suppliers/SupplierEdit")
);
const BankList = lazy(() => import("../components/master/BankList/BankList"));
const BankAdd = lazy(() => import("../components/master/BankList/BankAdd"));
const BankEdit = lazy(() => import("../components/master/BankList/BankEdit"));
const BankAccountList = lazy(() =>
  import("../components/master/BankAccounts/BankAccountList")
);
const BankAccountAdd = lazy(() =>
  import("../components/master/BankAccounts/BankAccountAdd")
);
const BankAccountEdit = lazy(() =>
  import("../components/master/BankAccounts/BankAccountEdit")
);

const LorryReceipts = lazy(() =>
  import("../components/transactions/LorryReceipts/LorryReceipts")
);
const LorryReceiptAdd = lazy(() =>
  import("../components/transactions/LorryReceipts/LorryReceiptAdd")
);
const LorryReceiptEdit = lazy(() =>
  import("../components/transactions/LorryReceipts/LorryReceiptEdit")
);
const LoadingSlips = lazy(() =>
  import("../components/transactions/LoadingSlips/LoadingSlips")
);
const LoadingSlipAdd = lazy(() =>
  import("../components/transactions/LoadingSlips/LoadingSlipAdd")
);
const LoadingSlipEdit = lazy(() =>
  import("../components/transactions/LoadingSlips/LoadingSlipEdit")
);
const LRAcknowledgement = lazy(() =>
  import("../components/transactions/Acknowledgement/LRAcknowledgement")
);
// const LRAcknowledgementEdit = lazy(() =>
//   import("../components/transactions/Acknowledgement/LRAcknowledgementEdit")
// );
const LocalMemoList = lazy(() =>
  import("../components/transactions/LocalMemoList/LocalMemoList")
);
const BillList = lazy(() =>
  import("../components/transactions/BillList/BillList")
);
const BillAdd = lazy(() =>
  import("../components/transactions/BillList/BillAdd")
);
const BillEdit = lazy(() =>
  import("../components/transactions/BillList/BillEdit")
);
const CashMemoList = lazy(() =>
  import("../components/transactions/CashMemoList/CashMemoList")
);
const PaymentCollection = lazy(() =>
  import("../components/transactions/PaymentCollection/PaymentCollection")
);
const PaymentAdvice = lazy(() =>
  import("../components/transactions/PaymentAdvice/PaymentAdvice")
);
const MoneyTransfers = lazy(() =>
  import("../components/transactions/MoneyTransfers/MoneyTransfers")
);
const MoneyTransferAdd = lazy(() =>
  import("../components/transactions/MoneyTransfers/MoneyTransferAdd")
);
const MoneyTransferEdit = lazy(() =>
  import("../components/transactions/MoneyTransfers/MoneyTransferEdit")
);
const PettyCashHistory = lazy(() =>
  import("../components/transactions/PettyCashHistory/PettyCashHistory")
);
const PettyCashTransactionAdd = lazy(() =>
  import("../components/transactions/PettyCashHistory/PettyCashTransactionAdd")
);
const PaymentReceipts = lazy(() =>
  import("../components/transactions/PaymentReceipt/PaymentReceipts")
);
const AddPaymentReceipt = lazy(() =>
  import("../components/transactions/PaymentReceipt/PaymentReceiptAdd")
);
const EditPaymentReceipt = lazy(() =>
  import("../components/transactions/PaymentReceipt/PaymentReceiptEdit")
);
const LorryReceiptRegister = lazy(() =>
  import("../components/reports/LorryReceiptRegister/LorryReceiptRegister")
);
const LoadingTripSheet = lazy(() =>
  import("../components/reports/LoadingTripSheet/LoadingTripSheet")
);
const BillRegister = lazy(() =>
  import("../components/reports/BillRegister/BillRegister")
);
const BilledLRStatus = lazy(() =>
  import("../components/reports/BilledLRStatus/BilledLRStatus")
);
const PaymentCollectionReport = lazy(() =>
  import(
    "../components/reports/PaymentCollectionReport/PaymentCollectionReport"
  )
);

const MaterialInwardList = lazy(() =>
  import("../components/transactions/MaterialInwardList/MaterialInwardList")
);

const ReturnedLorryReceipts = lazy(() =>
  import("../components/transactions/ReturnedLorryReceipts/ReturnedLorryReceipts")
);

const ReturnedAddLorryReceipts = lazy(() =>
  import("../components/transactions/ReturnedLorryReceipts/ReturnedLorryReceiptAdd")
);

const ReturnedEditLorryReceipts = lazy(() =>
  import("../components/transactions/ReturnedLorryReceipts/ReturnedLorryReceiptEdit")
);

const Unauthorized = lazy(() => import("../pages/Unauthorized"));

const NotFound = lazy(() => import("../components/UI/NotFound"));

const CustomRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/users">
          <Route index element={<Navigate to="/users/usersList" />} />
          <Route>
            <Route path="usersList" element={<UserList />} />
            <Route path="userRegistration" element={<UserRegistration />} />
            <Route path="userEdit" element={<UserEdit />} />
            <Route path="userPermissions" element={<UserPermissions />} />
          </Route>
        </Route>
        <Route path="/master">
          {/* <Route index element={<RequireAuth parent='master' path='articles' process='read'><Navigate to='/master/articles' /></RequireAuth>} /> */}
          <Route
            index
            element={
              <RequireAuth parent="master" path="articles" process="read">
                <Navigate to="/master/places" />
              </RequireAuth>
            }
          />
          {/* <Route path='articles'>
          <Route index element={<RequireAuth parent='master' path='articles' process='read'><Articles /></RequireAuth>} />
          <Route path='addArticle' element={<RequireAuth parent='master' path='articles' process='write'><ArticleAdd /></RequireAuth>} />
          <Route path='editArticle' element={<RequireAuth parent='master' path='articles' process='write'><ArticleEdit /></RequireAuth>} />
        </Route> */}
          <Route path="places">
            <Route
              index
              element={
                <RequireAuth parent="master" path="places" process="read">
                  <Places />
                </RequireAuth>
              }
            />
            <Route
              path="addPlace"
              element={
                <RequireAuth parent="master" path="places" process="write">
                  <PlaceAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editPlace"
              element={
                <RequireAuth parent="master" path="places" process="write">
                  <PlaceEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="branches">
            <Route
              index
              element={
                <RequireAuth parent="master" path="branches" process="read">
                  <BranchList />
                </RequireAuth>
              }
            />
            <Route
              path="addBranch"
              element={
                <RequireAuth parent="master" path="branches" process="write">
                  <BranchAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editBranch"
              element={
                <RequireAuth parent="master" path="branches" process="write">
                  <BranchEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="customers">
            <Route
              index
              element={
                <RequireAuth parent="master" path="customers" process="read">
                  <Customers />
                </RequireAuth>
              }
            />
            <Route
              path="addCustomer"
              element={
                <RequireAuth parent="master" path="customers" process="write">
                  <CustomerAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editCustomer"
              element={
                <RequireAuth parent="master" path="customers" process="write">
                  <CustomerEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="drivers">
            <Route
              index
              element={
                <RequireAuth parent="master" path="drivers" process="read">
                  <Drivers />
                </RequireAuth>
              }
            />
            <Route
              path="addDriver"
              element={
                <RequireAuth parent="master" path="drivers" process="write">
                  <DriverAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editDriver"
              element={
                <RequireAuth parent="master" path="drivers" process="write">
                  <DriverEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="employees">
            <Route
              index
              element={
                <RequireAuth parent="master" path="employees" process="read">
                  <Employees />
                </RequireAuth>
              }
            />
            <Route
              path="addEmployee"
              element={
                <RequireAuth parent="master" path="employees" process="write">
                  <EmployeeAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editEmployee"
              element={
                <RequireAuth parent="master" path="employees" process="write">
                  <EmployeeEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="vehicles">
            <Route
              index
              element={
                <RequireAuth parent="master" path="vehicles" process="read">
                  <Vehicles />
                </RequireAuth>
              }
            />
            <Route
              path="addVehicle"
              element={
                <RequireAuth parent="master" path="vehicles" process="write">
                  <VehicleAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editVehicle"
              element={
                <RequireAuth parent="master" path="vehicles" process="write">
                  <VehicleEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="vehicleTypes">
            <Route
              index
              element={
                <RequireAuth parent="master" path="vehicleTypes" process="read">
                  <VehicleTypes />
                </RequireAuth>
              }
            />
            <Route
              path="addVehicleType"
              element={
                <RequireAuth
                  parent="master"
                  path="vehicleTypes"
                  process="write"
                >
                  <VehicleTypeAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editVehicleType"
              element={
                <RequireAuth
                  parent="master"
                  path="vehicleTypes"
                  process="write"
                >
                  <VehicleTypeEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="suppliers">
            <Route
              index
              element={
                <RequireAuth parent="master" path="suppliers" process="read">
                  <Suppliers />
                </RequireAuth>
              }
            />
            <Route
              path="addSupplier"
              element={
                <RequireAuth parent="master" path="suppliers" process="write">
                  <SupplierAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editSupplier"
              element={
                <RequireAuth parent="master" path="suppliers" process="write">
                  <SupplierEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="banks">
            <Route
              index
              element={
                <RequireAuth parent="master" path="banks" process="read">
                  <BankList />
                </RequireAuth>
              }
            />
            <Route
              path="addBank"
              element={
                <RequireAuth parent="master" path="banks" process="write">
                  <BankAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editBank"
              element={
                <RequireAuth parent="master" path="banks" process="write">
                  <BankEdit />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="bankAccounts">
            <Route
              index
              element={
                <RequireAuth parent="master" path="bankAccounts" process="read">
                  <BankAccountList />
                </RequireAuth>
              }
            />
            <Route
              path="addBankAccount"
              element={
                <RequireAuth
                  parent="master"
                  path="bankAccounts"
                  process="write"
                >
                  <BankAccountAdd />
                </RequireAuth>
              }
            />
            <Route
              path="editBankAccount"
              element={
                <RequireAuth
                  parent="master"
                  path="bankAccounts"
                  process="write"
                >
                  <BankAccountEdit />
                </RequireAuth>
              }
            />
          </Route>
        </Route>
        <Route path="/transactions">
          <Route
            index
            element={<Navigate to="/transactions/lorryReceipts" />}
          />
          <Route path="lorryReceipts">
            <Route index element={<LorryReceipts />} />
            <Route path="addLorryReceipt" element={<LorryReceiptAdd />} />
            <Route path="editLorryReceipt" element={<LorryReceiptEdit />} />
          </Route>
          <Route path="returnLorryReceiptList">
            <Route index element={<ReturnedLorryReceipts />} />
            <Route path="returnedAddLorryReceipt" element={<ReturnedAddLorryReceipts />} />
            <Route path="returnedEditLorryReceipt" element={<ReturnedEditLorryReceipts />} />
          </Route>
          <Route path="MaterialInwardList">
            <Route index element={<MaterialInwardList />} />
            <Route path="addPaymentReceipt" element={<AddPaymentReceipt />} />
            <Route path="editPaymentReceipt" element={<EditPaymentReceipt />} />
          </Route>
          <Route path="loadingSlips">
            <Route index element={<LoadingSlips />} />
            <Route path="addLoadingSlip" element={<LoadingSlipAdd />} />
            <Route path="editLoadingSlip" element={<LoadingSlipEdit />} />
          </Route>
          <Route path="lrAcknowledgement">
            <Route index element={<LRAcknowledgement />} />
            {/* <Route path='editLRAcknowledgement' element={<LRAcknowledgementEdit />} /> */}
          </Route>

          <Route path="localMemoList">
            <Route index element={<LocalMemoList />} />
            <Route path="addLocalMemoLS" element={<LoadingSlipAdd />} />
            <Route path="editLocalMemoLS" element={<LoadingSlipEdit />} />
          </Route>

          <Route path="billList">
            <Route index element={<BillList />} />
            <Route path="addBill" element={<BillAdd />} />
            <Route path="editBill" element={<BillEdit />} />
          </Route>

          <Route path="/transactions/cashMemoList" element={<CashMemoList />} />
          <Route
            path="/transactions/paymentCollection"
            element={<PaymentCollection />}
          />
          <Route
            path="/transactions/paymentAdvice"
            element={<PaymentAdvice />}
          />

          <Route path="moneyTransfers">
            <Route index element={<MoneyTransfers />} />
            <Route path="addMoneyTransfer" element={<MoneyTransferAdd />} />
            <Route path="editMoneyTransfer" element={<MoneyTransferEdit />} />
          </Route>
          <Route path="pettyCashHistory">
            <Route index element={<PettyCashHistory />} />
            <Route
              path="addPettyCashTransaction"
              element={<PettyCashTransactionAdd />}
            />
          </Route>
        </Route>
        <Route path="/reports">
          <Route index element={<LorryReceiptRegister />} />
          <Route
            path="/reports/lorryReceiptRegister"
            element={<LorryReceiptRegister />}
          />
          <Route
            path="/reports/loadingTripSheet"
            element={<LoadingTripSheet />}
          />
          <Route path="/reports/billRegister" element={<BillRegister />} />
          <Route path="/reports/billedLRStatus" element={<BilledLRStatus />} />
          <Route
            path="/reports/paymentCollectionReport"
            element={<PaymentCollectionReport />}
          />
        </Route>
        <Route path="/reports" element={<Reports />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default CustomRoutes;

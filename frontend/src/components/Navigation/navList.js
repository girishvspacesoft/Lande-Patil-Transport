
const navItems = [
  {
    label: "Users",
    to: "/users",
    children: [
      {
        label: "Users list",
        to: "/users/usersList",
      },
      {
        label: "User registration",
        to: "/users/userRegistration",
      },
      {
        label: "User persmissions",
        to: "/users/userPermissions",
      },
    ],
  },
  {
    label: "Master",
    to: "/master",
    children: [
      {
        label: "Places",
        to: "/master/places",
      },
      {
        label: "Branches",
        to: "/master/branches",
      },
      {
        label: "Customers",
        to: "/master/customers",
      },
      {
        label: "Drivers",
        to: "/master/drivers",
      },
      {
        label: "Employees",
        to: "/master/employees",
      },
      {
        label: "Vehicles",
        to: "/master/vehicles",
      },
      {
        label: "Vehicle Types",
        to: "/master/vehicleTypes",
      },
      {
        label: "Suppliers",
        to: "/master/suppliers",
      },
    ],
  },
  {
    label: "Transactions",
    to: "/transactions",
    children: [
      {
        label: "Material Inward",
        to: "/transactions/materialInwardList",
      },
      {
        label: "Lorry Receipts",
        to: "/transactions/lorryReceipts",
      },
      {
        label: "Returnable Lorry Receipt",
        to: "/transactions/returnLorryReceiptList",
      },
      {
        label: "Material Outward",
        to: "/transactions/materialOutwardList",
      },
      {
        label: "Bill",
        to: "/transactions/routeBill",
      },
      {
        label: "Maintenance Bill",
        to: "/transactions/MaintenanceBillList",
      },
      {
        label: "Diesel Receipt",
        to: "/transactions/DieselReceiptList",
      },
      {
        label: "Fuel Report",
        to: "/transactions/FuelReportList",
      },
      {
        label: "Daily Bus Report",
        to: "/transactions/DailyBusReportList",
      },
      {
        label: "Daily Attendance",
        to: "/transactions/AttendanceList",
      },
      {
        label: "Fleet",
        to: "/transactions/Fleet",
      }
    ],
  },
  {
    label: "Reports",
    to: "/reports",
    children: [
      {
        label: "Lorry Receipt Register",
        to: "/LorryReceiptRegister",
      },
      {
        label: "Material Inward Register",
        to: "/MaterialInwardRegisterReport",
      },
      {
        label: "Daily Bus Report Register",
        to: "/DailyBusReportRegister",
      },
      {
        label: "Diesel Register",
        to: "/DieselRegister",
      },
      {
        label: "Bill Register",
        to: "/BillRegister",
      },
      {
        label: "Maintenance Bill Report Wizard",
        to: "/MaintenanceBillRegister",
      },
    ],
  },
  {
    label: "LPT",
    to: "/help",
    children: [
      {
        label: "Help",
        to: "/help",
      },
      {
        label: "Add News",
        to: "/addNews",
      }
    ],
  },
];

export default navItems;

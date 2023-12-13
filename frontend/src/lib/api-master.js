import { API_BASE_PATH_MASTER } from "./api-base-paths";
import { API_BASE_PATH_TRANSACTIONS } from "./api-base-paths";
//const API_BASE_PATH = 'http://localhost:4000/api/master';
//const API_BASE_PATH_TRANSACTIONS = 'http://localhost:4000/api/transactions';
//const loggedInUser = JSON.parse(localStorage.getItem('userData'));
//const empId = loggedInUser && loggedInUser.type && loggedInUser.type.toLowerCase() === 'superadmin' ? loggedInUser?._id : loggedInUser?.employee?._id;

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

export const addBranch = (branchData, controller) => {
  branchData.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addBranch`, {
    method: "POST",
    body: JSON.stringify(branchData),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBranches = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBranches`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBranch = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBranch/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeBranch = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeBranch/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateBranch = (branch, controller) => {
  const id = branch._id;
  branch.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateBranch/${id}`, {
    method: "PUT",
    body: JSON.stringify(branch),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPlaces = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getPlaces`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addPlace = (place, controller) => {
  place.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addPlace`, {
    method: "POST",
    body: JSON.stringify(place),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removePlace = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removePlace/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updatePlace = (place, controller) => {
  const id = place._id;
  place.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updatePlace/${id}`, {
    method: "PUT",
    body: JSON.stringify(place),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getPlace = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getPlace/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addEmployee = (employee, controller) => {
  employee.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addEmployee`, {
    method: "POST",
    body: JSON.stringify(employee),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getEmployees = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getEmployees`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeEmployee = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeEmployee/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateEmployee = (employee, controller) => {
  const id = employee._id;
  employee.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateEmployee/${id}`, {
    method: "PUT",
    body: JSON.stringify(employee),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getEmployee = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getEmployee/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getArticles = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getArticles`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addArticle = (article, controller) => {
  article.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addArticle`, {
    method: "POST",
    body: JSON.stringify(article),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeArticle = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeArticle/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateArticle = (article, controller) => {
  const id = article._id;
  article.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateArticle/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getArticle = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getArticle/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getCustomers = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getCustomers`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getCustomersByBranch = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getCustomersByBranch`, {
    method: "POST",
    body: JSON.stringify({ branchId: branchId }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getCustomer = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getCustomer/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addCustomer = (customer, controller) => {
  customer.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addCustomer`, {
    method: "POST",
    body: JSON.stringify(customer),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateCustomer = (customer, controller) => {
  const id = customer._id;
  customer.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateCustomer/${id}`, {
    method: "PUT",
    body: JSON.stringify(customer),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeCustomer = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeCustomer/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getDrivers = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getDrivers`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addDriver = (driver, controller) => {
  driver.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addDriver`, {
    method: "POST",
    body: JSON.stringify(driver),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeDriver = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeDriver/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateDriver = (driver, controller) => {
  const id = driver._id;
  driver.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateDriver/${id}`, {
    method: "PUT",
    body: JSON.stringify(driver),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getDriver = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getDriver/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getSuppliers = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getSuppliers`, {
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getSupplier = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getSupplier/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addSupplier = (supplier, controller) => {
  supplier.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addSupplier`, {
    method: "POST",
    body: JSON.stringify(supplier),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateSupplier = (supplier, controller) => {
  const id = supplier._id;
  supplier.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateSupplier/${id}`, {
    method: "PUT",
    body: JSON.stringify(supplier),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeSupplier = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeSupplier/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getVehicleTypes = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getVehicleTypes`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addVehicleType = (vehicleType, controller) => {
  vehicleType.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addVehicleType`, {
    method: "POST",
    body: JSON.stringify(vehicleType),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeVehicleType = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeVehicleType/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateVehicleType = (vehicleType, controller) => {
  const id = vehicleType._id;
  vehicleType.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateVehicleType/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehicleType),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getVehicleType = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getVehicleType/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getVehicles = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getVehicles`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addVehicle = (vehicle, controller) => {
  vehicle.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addVehicle`, {
    method: "POST",
    body: JSON.stringify(vehicle),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeVehicle = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeVehicle/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateVehicle = (vehicle, controller) => {
  const id = vehicle._id;
  vehicle.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateVehicle/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehicle),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getVehicle = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getVehicle/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBanks = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBanks`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addBank = (bank, controller) => {
  bank.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addBank`, {
    method: "POST",
    body: JSON.stringify(bank),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateBank = (bank, controller) => {
  const id = bank._id;
  bank.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateBank/${id}`, {
    method: "PUT",
    body: JSON.stringify(bank),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBank = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBank/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeBank = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeBank/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBankAccounts = (controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBankAccounts`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const addBankAccount = (bankAccount, controller) => {
  bankAccount.createdBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/addBankAccount`, {
    method: "POST",
    body: JSON.stringify(bankAccount),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateBankAccount = (bankAccount, controller) => {
  const id = bankAccount._id;
  bankAccount.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_MASTER}/updateBankAccount/${id}`, {
    method: "PUT",
    body: JSON.stringify(bankAccount),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getBankAccount = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/getBankAccount/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeBankAccount = (id, controller) => {
  return fetch(`${API_BASE_PATH_MASTER}/removeBankAccount/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getDataForLR = (controller) => {
  return Promise.all([
    fetch(`${API_BASE_PATH_MASTER}/getBranches`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getVehicles`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getArticles`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getCustomers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getPlaces`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getVehicleTypes`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_TRANSACTIONS}/getLastLR`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getDrivers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    })
  ]).then(
    ([branches, vehicles, articles, customers, places, vehicleTypes, lastLR, drivers]) =>
      Promise.all([
        branches.json(),
        vehicles.json(),
        articles.json(),
        customers.json(),
        places.json(),
        vehicleTypes.json(),
        lastLR.json(),
        drivers.json(),
      ])
  );
};

export const getDataForLS = (controller) => {
  return Promise.all([
    fetch(`${API_BASE_PATH_MASTER}/getBranches`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getVehicles`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getSuppliers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getPlaces`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getDrivers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getCustomers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
  ]).then(([branches, vehicles, suppliers, places, drivers, customers]) =>
    Promise.all([
      branches.json(),
      vehicles.json(),
      suppliers.json(),
      places.json(),
      drivers.json(),
      customers.json(),
    ])
  );
};

export const getDataForPettyTransaction = (controller) => {
  return Promise.all([
    fetch(`${API_BASE_PATH_MASTER}/getSuppliers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getDrivers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getCustomers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getEmployees`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getBanks`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getBankAccounts`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
  ]).then(([suppliers, drivers, customers, employees, banks, bankAcounts]) =>
    Promise.all([
      suppliers.json(),
      drivers.json(),
      customers.json(),
      employees.json(),
      banks.json(),
      bankAcounts.json(),
    ])
  );
};

export const getDataForPaymentAdvice = (controller) => {
  return Promise.all([
    fetch(`${API_BASE_PATH_MASTER}/getSuppliers`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
    fetch(`${API_BASE_PATH_MASTER}/getPlaces`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    }),
  ]).then(([suppliers, places]) =>
    Promise.all([suppliers.json(), places.json()])
  );
};

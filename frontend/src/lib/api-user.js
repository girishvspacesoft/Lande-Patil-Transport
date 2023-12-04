import { API_BASE_PATH_USER } from "./api-base-paths";

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

export const registerUser = (userData, controller) => {
  const empId = getEmpId(getUserData());
  if (empId) {
    userData.createdBy = empId;
  }
  return fetch(`${API_BASE_PATH_USER}/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getUsers = (controller) => {
  return fetch(`${API_BASE_PATH_USER}/getUsers`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getUser = (id, controller) => {
  return fetch(`${API_BASE_PATH_USER}/getUser/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const getUsersByBranch = (branchId, controller) => {
  return fetch(`${API_BASE_PATH_USER}/getUsersByBranch/${branchId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateUserPermissions = (user, controller) => {
  user.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_USER}/updateUserPermissions`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const updateUser = (user, controller) => {
  const id = user._id;
  user.updatedBy = getEmpId(getUserData());
  return fetch(`${API_BASE_PATH_USER}/updateUser/:${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const removeUser = (id, controller) => {
  return fetch(`${API_BASE_PATH_USER}/removeUser/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ id: id, updatedBy: getEmpId(getUserData()) }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const login = (loginData, controller) => {
  return fetch(`${API_BASE_PATH_USER}/login`, {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

export const searchUser = (searchString, controller) => {
  return fetch(`${API_BASE_PATH_USER}/getSearchedUsers`, {
    method: "POST",
    body: JSON.stringify({ search: searchString }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller?.signal,
  }).then((response) => response.json());
};

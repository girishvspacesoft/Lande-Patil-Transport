const getUserData = () => {
  return JSON.parse(localStorage.getItem("userData"));
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getFormattedDate = (receivedDate) => {
  const date = new Date(receivedDate);
  const day = date.getDate();
  const formattedDay = ("0" + day).slice(-2);
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${formattedDay} ${monthNames[month]} ${year}`;
};

export const getFormattedTime = (receivedDate) => {
  const date = new Date(receivedDate);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  seconds = seconds <= 9 ? "0" + seconds : seconds;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return strTime;
};

export const states = [
  "Maharashtra",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and",
  "Daman & Diu",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const emailRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const mobileNoRegEx = /^[0-9]{10}$/;

export const getFormattedLRNumber = (lrNo) => {
  lrNo = lrNo.toString();
  while (lrNo.length < 6) lrNo = "0" + lrNo;
  return "P1-" + lrNo;
};

export const getNextLRNumber = (lr) => {
  if (lr && lr.wayBillNo) {
    const parts = lr.wayBillNo.split("-");
    const newNum = pad(+parts[1] + 1, 6);
    return `P1-${newNum}`;
  }
  return `P1-000001`;
};

export const getNextLRNumberByBranch = (lr) => {
  const userBranch = getUserData().branchData;
  if (userBranch) {
    if (lr && lr.wayBillNo) {
      const parts = lr.wayBillNo.split("-");
      const newNum = pad(+parts[1] + 1, 6);
      return `${userBranch.abbreviation.toUpperCase()}-${newNum}`;
    } else {
      return `${userBranch.abbreviation.toUpperCase()}-000001`;
    }
  } else {
    if (lr && lr.wayBillNo) {
      const parts = lr.wayBillNo.split("-");
      const newNum = pad(+parts[1] + 1, 6);
      return `SA-${newNum}`;
    } else {
      return `SA-000001`;
    }
  }
};

export const getFormattedLSNumber = (lsNo) => {
  lsNo = lsNo.toString();
  while (lsNo.length < 6) lsNo = "0" + lsNo;
  return "P1-" + lsNo;
};

export const getFormattedPettyCashNo = (pcNo) => {
  pcNo = pcNo.toString();
  while (pcNo.length < 5) pcNo = "0" + pcNo;
  return pcNo;
};

export const getFormattedTransactionNo = (ptNo) => {
  ptNo = ptNo.toString();
  while (ptNo.length < 5) ptNo = "0" + ptNo;
  return ptNo;
};

export const getFormattedPRNo = (prNo) => {
  prNo = prNo.toString();
  while (prNo.length < 6) prNo = "0" + prNo;
  return `PR-${prNo}`;
};

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

export const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

export const company_name = "logo"
export const LOGO_SRC = "/assets/logo.png"
export const COMPANY_NAME_SHOW = false

// #########################____Global____#################################

export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1;
export const PAGE_TYPE_ADD = "ADD";
export const PAGE_TYPE_EDIT = "EDIT";
export const PAGE_TYPE_DETAILS = "DETAILS";
// #########################____FILTER____#################################
// how match time tack before run
export const DEBOUNCE_THRESHOLD = 500


//  how any row user can select 
export const TABLE_ITEM_OPTION = [5, 10, 25, 50, 75, 100];



//  list order data 
export const LIST_ORDER_TYPE_DATA = {
    "ASC": "ASC",
    "DESC": "DESC",
};
export const LIST_ORDER_TYPE_KEYS = Object.keys(LIST_ORDER_TYPE_DATA)

//  list order data 
export const LIST_PROPERTY_TYPE_DATA = {
    "Shop": "Shop",
    "Plot": "Plot",
    "Office": "Office",
    "Apartments": "Apartments",
    "House": "House",
    "Villa": "Villa",
    "Hostel": "Hostel",
    "Pg": "Pg",
    "Farm": "Farm",
};
export const LIST_PROPERTY_TYPE_KEYS = Object.keys(LIST_PROPERTY_TYPE_DATA)
export const LIST_PROPERTY_FOR_DATA = {
    "sell": "sell",
    "rent": "rent",
    "sold": "sold"
};
export const LIST_PROPERTY_FOR_KEYS = Object.keys(LIST_PROPERTY_FOR_DATA)


// list filter type

export const FILTER_OPTION_TYPE_DATA = {
    name: "first_name",
    company: "company_name",
    address: "address",
    phone: "phone_number",
    email: "email",
    time: "createdAt",
}

export const FILTER_OPTION_TYPE_KEY = Object.keys(FILTER_OPTION_TYPE_DATA)


// initial filter data
export const INIT_FILTER = {
    limit: 5,
    startDate: "",
    endDate: "",
    searchParam: "",
    orderBy: "",
    order: "",
};

export const INIT_FILTER_KEY = Object.keys(INIT_FILTER)

// #########################____LOGIN____#################################
const FORGOT_PASSWORD_PAGE = "FORGOT_PASSWORD_PAGE", OTP_PAGE = "OTP_PAGE", CONFIRM_PASSWORD_PAGE = "CONFIRM_PASSWORD_PAGE"
export { FORGOT_PASSWORD_PAGE, OTP_PAGE, CONFIRM_PASSWORD_PAGE }

// #########################____USER____#################################

export const USER_ROLE_TYPE_DATA = {
    "1": "admin",
};

export const USER_ROLE_TYPE_KEY = Object.keys(USER_ROLE_TYPE_DATA)

// #########################____TAX____#################################


export const TAX_TYPE_DATA = {
    "1": "CGST",
    "2": "SGST",
    "3": "IGST",
};
export const TAX_TYPE_KEY = Object.keys(TAX_TYPE_DATA)



// #########################____WORK____#################################

export const WORK_STATUS_TYPE_DATA = {
    "1": "Initiation",
    "2": "Planning",
    "3": "Execution",
    "4": "Testing",
    "5": "Completed",
    "6": "Monitoring",
};
export const WORK_STATUS_TYPE_KEY = Object.keys(WORK_STATUS_TYPE_DATA)



// ##########################______PROPERTY_STATUS_______##################################


export const PROPERTY_STATUS_TYPE_DATA = {
    "Pending": "Pending",
    "Reject": "Reject",
    "Approved": "Approved"
};
export const PROPERTY_STATUS_TYPE_KEY = Object.keys(PROPERTY_STATUS_TYPE_DATA)



// ##########################_______INTERESTED_STATUS_______##################################


export const LEADS_STATUS_TYPE_DATA = {
    "On Review": "On Review", "Interview": "Interview", "Document upload": "Document upload", "Offer Accepted": "Offer Accepted", "Onboard": "Onboard"
};

export const LEADS_STATUS_TYPE_KEY = Object.keys(LEADS_STATUS_TYPE_DATA)




// ##########################______state_______##################################



export const STATE_NAME = {
    "AN": "Andaman and Nicobar Islands",
    "AP": "Andhra Pradesh",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "BR": "Bihar",
    "CG": "Chandigarh",
    "CH": "Chhattisgarh",
    "DN": "Dadra and Nagar Haveli",
    "DD": "Daman and Diu",
    "DL": "Delhi",
    "GA": "Goa",
    "GJ": "Gujarat",
    "HR": "Haryana",
    "HP": "Himachal Pradesh",
    "JK": "Jammu and Kashmir",
    "JH": "Jharkhand",
    "KA": "Karnataka",
    "KL": "Kerala",
    "LA": "Ladakh",
    "LD": "Lakshadweep",
    "MP": "Madhya Pradesh",
    "MH": "Maharashtra",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "OR": "Odisha",
    "PY": "Puducherry",
    "PB": "Punjab",
    "RJ": "Rajasthan",
    "SK": "Sikkim",
    "TN": "Tamil Nadu",
    "TS": "Telangana",
    "TR": "Tripura",
    "UP": "Uttar Pradesh",
    "UK": "Uttarakhand",
    "WB": "West Bengal"
}

export const STATE_OPTION = Object.keys(STATE_NAME).map((state: string) => ({ value: STATE_NAME[state as unknown as keyof typeof STATE_NAME], label: STATE_NAME[state as unknown as keyof typeof STATE_NAME] }))




//  property area_size_in

export const AREA_SIZE_IN = ["Feet", "Meters", "Yards", "Bigha", "Acres", "Hectares"]




// payment Type

export const PAYMENT_METHOD_TYPE_DATA = {
    "1": "Bank Transfer",
    "2": "Pay Pal",
    "3": "Card",
    "4": "UPI",
};


export const PAYMENT_METHOD_TYPE_KEY = Object.keys(PAYMENT_METHOD_TYPE_DATA)

export const PAYMENT_STATUS_TYPE_DATA = {
    "1": "Deu",
    "2": "Paid"
};


export const PAYMENT_STATUS_TYPE_KEY = Object.keys(PAYMENT_STATUS_TYPE_DATA)


export const PAYMENT_TYPE_DATA = {
    "1": "Credit",
    "2": "Debit"
};


export const PAYMENT_TYPE_KEY = Object.keys(PAYMENT_TYPE_DATA)


// payment Type

export const CURRENCY_STATUS_TYPE_DATA = {
    INR: "INR",
    USD: "USD",
    EURO: "EURO",
    AED: "AED",
};


export const CURRENCY_STATUS_TYPE_KEY = Object.keys(CURRENCY_STATUS_TYPE_DATA)
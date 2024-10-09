function authHandler(typeProp) {
  const authObj = {
    AUTH_SUCCESS: "Authentication successful.",
    AUTH_FAILED: "Authentication failed.",

    UN_AUTH: "You are not authorized to use this system",
    // Inactive
    INACTIVE_ACCOUNT:
      "Your account is inactive. Please contact the administrator.",
    DELETED_ACCOUNT:
      "Your account has been deleted. Please contact the administrator.",

    // JWT Token
    JWT_NEEDED: "Empty JWT field in headers.",
    JWT_INVALID: "Invalid JWT passed in headers.",
    JWT_EXPIRED: "Expired JWT passed in headers.",

    // Token
    TOKEN_REQUIRED: "Authentication token is required.",
    TOKEN_INVALID: "Invalid authentication token passed.",
    TOKEN_EXPIRED: "Your session has expired. Kindly log in again.",

    // Invalid
    INVALID_USER_NAME: "Input user name is invalid.",
    INVALID_EMAIL: "Input email is invalid.",
    INVALID_PASSWORD: "Input password is invalid.",
    PASSWORD_NOT_MATCH: "Old password doesn't match.",
    INVALID_CRED: `Unable to login, invalid credentials.`,

    // Not found | registered
    UNIQUE_ID_NOT_FOUND: "Unique Id not found.",
    EMAIL_NOT_FOUND: "Email not found.",
    CRED_NOT_FOUND: "Credentials not found.",
    PHONE_NOT_FOUND: "Mobile number not found.",
    ACCOUNT_NOT_FOUND: `Account not found.`,
    EMAIL_MOB_NOT_REGISTERED: "Email or Mobile Number not registered.",

    // Duplicates
    DUPLICATE: `Duplicate entry found.`,
    DUPLICATE_EMAIL_PHONE: "Duplicate email and phone found.",
    DUPLICATE_EMAIL: "Duplicate email found.",
    DUPLICATE_WORK: "Duplicate Work Name found.",
    DUPLICATE_PHONE: "Duplicate phone number found.",
    DUPLICATE_USER_NAME: "Duplicate user name found.",

    UNABLE_EMAIL: `Unable to create, duplicate email found.`,
    UNABLE_PHONE: `Unable to create, duplicate mobile number found.`,
    UNABLE_USER_NAME: `Unable to create, duplicate name found.`,
    UNABLE_EMAIL_PHONE: `Unable to create, duplicate email and mobile number found.`,
    UNABLE_PAN: "Duplicate PAN card details found.",

    // Already Exist
    NAME_EMAIL_PHONE_EXIST: `Unable to create, email, phone, and username already exist.`,
    EMAIL_PHONE_EXIST: `Unable to create, email and phone already exist.`,
    EMAIL_EXIST: `Unable to create, Email already exists.`,
    USER_NAME_EXIST: `Unable to create, Username already exists.`,
    MOBILE_EXIST: `Unable to create, Mobile number already exists.`,

    // E-Mail
    OTP_MAIL_SENT: "OTP sent to registered email address.",

    // Mobile
    OTP_SENT: "OTP sent to registered mobile number.",
    OTP_TEMP: "Please enter OTP to change password.",
    INVALID_OTP: "Invalid OTP. Please enter a valid OTP.",

    // Changed
    CHANGE_PASSWORD: "Password changed successfully.",

    // Signup
    SIGNUP: "User created successfully.",
    SIGNUP_FAILED: "Could not create a new user. Please try again.",

    // Login
    DATA_FOUND: "Data found.",

    // Not Exists
    EMAIL_NOT_EXISTS: "Email ID does not exist.",
    USER_NOT_EXISTS: "User does not exist.",

    // Something went wrong
    WRONG: "Something went wrong.",
    WRONG_PASS: "Incorrect password entered.",
    USER_LIST_WRONG: "Error while fetching user list.",
    TOTAL_WRONG: "Error while fetching total count.",
    FAILED_DELETE_USER: "Error while deleting user.",
    FAILED_DELETE_CAT: "Failed to delete category.",

    //orders
    ORDER_ADDED: "Order created successfully.",
    ORDER_ADD_FAILED: "Failed to create order.",

    // Image
    NO_FILE: "No file uploaded.",

    // User
    USER_UPDATED: "User updated successfully.",
    USER_UPDATED_FAILED: "User update failed.",
    USER_DELETED: "User deleted successfully.",
    USER_ACTIVATED: "User activated successfully.",
    USER_DEACTIVATED: "User deactivated successfully.",

    // Lead
    LEAD_ADDED: "congratulations your form has been submitted",
    LEAD_FAILED: "Could not create a new LEAD. Please try again.",
    LEAD_UPDATED: "LEAD updated successfully.",
    LEAD_UPDATED_FAILED: "LEAD update failed.",
    LEAD_DELETED: "LEAD deleted successfully.",
    LEAD_ACTIVATED: "LEAD activated successfully.",
    LEAD_DEACTIVATED: "LEAD deactivated successfully.",
    LEAD_NOT_EXISTS: "LEAD does not exist.",
    LEAD_LIST_WRONG: "Error while fetching LEAD list.",
    FAILED_DELETE_LEAD: "Error while deleting LEAD.",

    // Partners
    PARTNERS_ADDED: "Partners updated successfully.",
    PARTNERS_FAILED: "Could not create a new partners. Please try again.",
    PARTNERS_UPDATED: "Partners updated successfully.",
    PARTNERS_UPDATED_FAILED: "Partners update failed.",
    PARTNERS_DELETED: "Partners deleted successfully.",
    PARTNERS_ACTIVATED: "Partners activated successfully.",
    PARTNERS_DEACTIVATED: "Partners deactivated successfully.",
    PARTNERS_NOT_EXISTS: "Partners does not exist.",
    PARTNERS_LIST_WRONG: "Error while fetching Partners list.",
    FAILED_DELETE_PARTNERS: "Error while deleting Partners.",

    // Work
    WORK_ADDED: "Work updated successfully.",
    WORK_FAILED: "Could not create a new work. Please try again.",
    WORK_UPDATED: "Work updated successfully.",
    WORK_UPDATED_FAILED: "Work update failed.",
    WORK_DELETED: "Work deleted successfully.",
    WORK_ACTIVATED: "Work activated successfully.",
    WORK_DEACTIVATED: "Work deactivated successfully.",
    WORK_NOT_EXISTS: "Work does not exist.",
    WORK_LIST_WRONG: "Error while fetching Work list.",
    FAILED_DELETE_WORK: "Error while deleting Work.",


    // Work
    CLIENT_ADDED: "Client updated successfully.",
    CLIENT_FAILED: "Could not create a new work. Please try again.",
    CLIENT_UPDATED: "Client updated successfully.",
    CLIENT_UPDATED_FAILED: "Client update failed.",
    CLIENT_DELETED: "Client deleted successfully.",
    CLIENT_ACTIVATED: "Client activated successfully.",
    CLIENT_DEACTIVATED: "Client deactivated successfully.",
    CLIENT_GET: "Client get successfully.",
    CLIENT_NOT_EXISTS: "Client does not exist.",
    CLIENT_LIST_WRONG: "Error while fetching Client list.",
    FAILED_DELETE_CLIENT: "Error while deleting Client.",
  };

  return authObj[typeProp];
}

module.exports = { authHandler };

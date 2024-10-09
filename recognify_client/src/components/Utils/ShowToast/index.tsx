import toast from "react-hot-toast";

const Index = (type: string, message: string) => {
  if (type === "success") {
    return toast.success(message, {
      duration: 1500,
    });
  } else if (type === "error") {
    return toast.error(message, {
      duration: 1500,
    });
  }
};

export default Index;


export const error = "error";
export const success = "success";
export const errorMessage = "Something Went Wrong";
export const alreadyLogin = "Multiple Logins Detected";
export const loginSuccess = "Logged In Successfully";
export const logoutSuccess = "You have been successfully logged out.";

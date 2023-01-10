import { toast } from "react-toastify";
export const updateObject = (oldObject, newObject) => {
  return {
    ...oldObject,
    ...newObject,
  };
};

export const handleError = (error) => {
  if (error.response.data) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);

    Object.entries(error.response.data).forEach(([key, value]) => {
      console.log(key);
      if (key == "non_field_errors") {
        toast.error(value[0]);
      } else {
        if (key == "message") {
          toast.error(value);
        } else {
          if (typeof value == "string") {
            toast.error(
              key.charAt(0).toUpperCase() + key.slice(1) + " : " + value
            );
          } else {
            toast.error(
              key.charAt(0).toUpperCase() + key.slice(1) + " : " + value[0]
            );
          }
        }
      }
    });
  } else if (error.request.data) {
    console.log("request");
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error

    toast.error(error.message);
  }
};

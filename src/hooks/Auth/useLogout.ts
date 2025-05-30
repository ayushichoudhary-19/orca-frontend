import { useDispatch } from "react-redux";
import { executeLogout } from "@/utils/logoutHelper";

export const useLogout = () => {
  const dispatch = useDispatch();
  return () => executeLogout(dispatch);
};
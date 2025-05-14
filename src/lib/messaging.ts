import {app} from "./firebase";
import { getMessaging, isSupported } from "firebase/messaging";

export const messaging = (await isSupported())
  ? getMessaging(app)
  : undefined;

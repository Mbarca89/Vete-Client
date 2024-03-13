import { atom, selector } from "recoil";
import { userData } from "../types";

const userState = atom({
  key: "userState",
  default: {
    userName: "",
    role: "user"
  }
})

export { userState }
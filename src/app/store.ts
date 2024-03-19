import { atom, selector } from "recoil";
import { userData } from "../types";

const userState = atom({
  key: "userState",
  default: {
    id: "",
    name: "",
    surname: "",
    userName: "",
    role: "user"
  }
})

const logState = atom({
  key: "logState",
  default: false
})

export { userState, logState }
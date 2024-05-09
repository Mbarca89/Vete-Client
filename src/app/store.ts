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

const clientState = atom ({
  key: "clientState",
  default: {
    id: "",
    name: "",
    surname: "",
    phone: "",
    email: "",
    social: "",
    userName: ""
  }
})

const logState = atom({
  key: "logState",
  default: false
})

const modalState = atom({
  key: "modalState",
  default: false
})

const offCanvasState = atom({
  key: "offCanvasState",
  default: false
})

const loadingState = atom({
  key: 'loadingState',
  default: false,
})

export { userState, clientState, logState, modalState, offCanvasState, loadingState }
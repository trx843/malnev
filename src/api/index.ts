import axios from "axios";
import { apiBase } from "../utils";

export const api = axios.create({
  baseURL: apiBase
});
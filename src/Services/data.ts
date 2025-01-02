import axios from "axios";
import { CpuLoad } from "../types";
const LOAD_API = "http://localhost:3001/cpuLoadAverage";

export async function getData() {
  const { data } = await axios.get<CpuLoad>(LOAD_API);
  return data;
}

import axios from "axios";
import { SiEquipment, TechPositions } from "../../../classes";
import { apiBase } from "../../../utils";

const BASE_URL = `${apiBase}/techpositions`;

export const techpositionsApi = {
  getTechpositionById(techpositionId: number) {
    return axios.get<TechPositions>(`${BASE_URL}/${techpositionId}`);
  },
};

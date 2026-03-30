import axios, { AxiosResponse } from "axios";

const API = "http://localhost:5000";

export interface Item {
  name: string;
  price: number;
  category: string;
  description?: string;
}

export interface ItemResponse extends Item {
  _id: string;
}

export const addItem = (
  data: Item
): Promise<AxiosResponse<ItemResponse>> =>
  axios.post<ItemResponse>(`${API}/items`, data);

export const getItems = (): Promise<AxiosResponse<ItemResponse[]>> =>
  axios.get<ItemResponse[]>(`${API}/items`);

import { SUCCESS_CODE } from "../types/error-codes";
import { MultipleItemsResponseType } from "../types/success-response-types";

export const emptyList: MultipleItemsResponseType<any> = {
  code: SUCCESS_CODE.SUCCESS,
  data: [],
  itemsPerPage: 0,
  page: 1,
  totalPages: 0,
};

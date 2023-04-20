import axios from 'axios';
import { SqlTree } from '../../../classes/SqlTree';
import { apiBase } from '../../../utils';
import { ApiRoutes } from '../../api-routes.enum';

export const getOperandTree = async (
  algId?: string,
  templateId?: string
): Promise<SqlTree[]> => {
  const url = `${apiBase}${ApiRoutes.GetAlgOperands}?id=${algId}&templateId=${templateId}`;
  const result = await axios.get<SqlTree[]>(url);
  return result.data;
};

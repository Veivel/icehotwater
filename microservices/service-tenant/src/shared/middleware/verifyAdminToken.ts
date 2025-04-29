import axios, { AxiosResponse } from "axios";

interface AdminTokenHandlerResponse {
  data: any
  status: number
}

export const verifyAdminToken = async (token: string): Promise<AdminTokenHandlerResponse> => {
  try {
    const url = `${process.env.AUTH_MS_URL}/api/auth/verify-admin-token`
    const res: AxiosResponse<AdminTokenHandlerResponse, any> = await axios.post(
      url, { token: token }
    );
    if (res.status >= 400) {
      console.log(res.data);
      throw Error("something went wrong")
    }
    return res;
  } catch(e) {
    console.log(e)
    throw e
  }
}
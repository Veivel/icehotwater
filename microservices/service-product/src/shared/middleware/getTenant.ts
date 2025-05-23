import axios, { AxiosResponse } from "axios";

interface GetTenantResponse {
    data: any
    status: number
}

export async function getTenant(tenant_id: string, admin_token: string): Promise<GetTenantResponse> {
    try {
        const url = `${process.env.TENANT_MS_URL}/api/tenant/${tenant_id}`
        const res: AxiosResponse<GetTenantResponse, any> = await axios.get(
          url, {
            headers: {
                'Authorization': `Bearer ${admin_token}`
            }
        });
        if (res.status >= 400) {
          console.log(res.data);
          throw Error(`Something went wrong. Response status: ${res.status} ${res.statusText}`)
        }
        console.log("tenant: success")
        return res;
      } catch(e) {
        console.log("tenant: fail")
        console.log(e)
        throw e
      }
}
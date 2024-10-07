import {OpenAPIClientAxios} from "openapi-client-axios";
import { Client, Paths } from "../types/user.js";
import { config } from "../config.js";
import axios from "axios";
export class UserExternalService {
    client!: Client;

    constructor() {
        const userApi = new OpenAPIClientAxios({
            definition: 'https://wheelz-user.zcorp.ovh/openapi.json',
            axiosConfigDefaults: {
                baseURL: config.USER_SERVICE_URL
            }
        });

        userApi.init<Client>().then(client => {
            this.client = client;
        }).catch(error => {
            console.error('Error initializing API client', error);
        });
    }
    async create(data: Paths.CreateUser.RequestBody): Promise<Paths.CreateUser.Responses.$201> {
        const response = await this.client.createUser({}, data)
        return response.data
    }

    async getByEmail(email: string): Promise<number> {
        const response = await axios.get(`${config.USER_SERVICE_URL}/users/email`, {params: {q: email}})
        return response.data.data;
    }
}

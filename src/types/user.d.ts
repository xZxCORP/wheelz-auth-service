import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Paths {
    namespace CreateUser {
        export interface RequestBody {
            firstname: string;
            lastname: string;
            email: string; // email
        }
        namespace Responses {
            export interface $201 {
                message: string;
                data?: any;
            }
            export interface $400 {
                message: string;
                data?: any;
            }
        }
    }
    namespace DeleteUser {
        namespace Parameters {
            export type Id = number | null;
        }
        export interface PathParameters {
            id?: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                message: string;
                data?: any;
            }
            export interface $404 {
                message: string;
                data?: any;
            }
        }
    }
    namespace GetUser {
        namespace Parameters {
            export type Id = number | null;
        }
        export interface PathParameters {
            id?: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    id: number;
                    firstname: string;
                    lastname: string;
                    email: string; // email
                    createdAt: string;
                };
            }
            export interface $404 {
                message: string;
                data?: any;
            }
        }
    }
    namespace ListUsers {
        namespace Responses {
            export interface $200 {
                data: {
                    id: number;
                    firstname: string;
                    lastname: string;
                    email: string; // email
                    createdAt: string;
                }[];
            }
        }
    }
    namespace UpdateUser {
        namespace Parameters {
            export type Id = number | null;
        }
        export interface PathParameters {
            id?: Parameters.Id;
        }
        export interface RequestBody {
            firstname?: string;
            lastname?: string;
        }
        namespace Responses {
            export interface $200 {
                message: string;
                data?: any;
            }
            export interface $404 {
                message: string;
                data?: any;
            }
        }
    }
}

export interface OperationMethods {
  /**
   * listUsers
   */
  'listUsers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListUsers.Responses.$200>
  /**
   * createUser
   */
  'createUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateUser.Responses.$201>
  /**
   * getUser
   */
  'getUser'(
    parameters?: Parameters<Paths.GetUser.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUser.Responses.$200>
  /**
   * updateUser
   */
  'updateUser'(
    parameters?: Parameters<Paths.UpdateUser.PathParameters> | null,
    data?: Paths.UpdateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUser.Responses.$200>
  /**
   * deleteUser
   */
  'deleteUser'(
    parameters?: Parameters<Paths.DeleteUser.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteUser.Responses.$200>
}

export interface PathsDictionary {
  ['/users']: {
    /**
     * listUsers
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListUsers.Responses.$200>
    /**
     * createUser
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateUser.Responses.$201>
  }
  ['/users/{id}']: {
    /**
     * getUser
     */
    'get'(
      parameters?: Parameters<Paths.GetUser.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUser.Responses.$200>
    /**
     * updateUser
     */
    'patch'(
      parameters?: Parameters<Paths.UpdateUser.PathParameters> | null,
      data?: Paths.UpdateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUser.Responses.$200>
    /**
     * deleteUser
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteUser.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteUser.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

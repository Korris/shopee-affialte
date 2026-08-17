import type { AxiosRequestConfig } from 'axios'
import api from './api'
import type { PagingRes, SingleRes } from './type'

export const apiFactory = {
  async getOne<T>(url: string, config?: AxiosRequestConfig): Promise<SingleRes<T>> {
    return api.get<SingleRes<T>>(url, config).then((res) => res.data)
  },
  async getMany<T>(url: string, config?: AxiosRequestConfig): Promise<PagingRes<T>> {
    return api.get<PagingRes<T>>(url, config).then((res) => res.data)
  },
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<SingleRes<T>> {
    return api.post<SingleRes<T>>(url, data, config).then((res) => res.data)
  },
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return api.put<T>(url, data, config).then((res) => res.data)
  },
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return api.delete<T>(url, config).then((res) => res.data)
  },
}

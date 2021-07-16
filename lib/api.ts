import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


export type projectRoute = { project: string }
export type bucketRoute = { project: string, bucket: string }
export type languageRoute = { project: string, language: string }
export type translationContextRoute = { project: string, language: string, bucket: string }
export type lineRoute = { project: string, bucket: string, line: string, language: string }

export type ErrorData = { error: string }

export default class API {

  private static readonly BASE_URL = 'http://localhost/dash' // TODO load from localstore and then on login page have a input to change this

  private static buildConf(headers?: any, body?: any): AxiosRequestConfig {
    headers ||= {}
    headers.Authorization = localStorage.getItem('token')
    const conf: AxiosRequestConfig = {
      headers,
      validateStatus: null
    }
    if (body) conf.data = body
    return conf
  }

  private static buildConnRefError(): Promise<AxiosResponse & ErrorData> {
    return Promise.resolve({
      status: 999,
      statusText: 'connection refused',
      headers: {},
      request: {},
      config: {},
      data: {
        success: false,
        error: 'connection refused',
        message: 'Unable to connect to FreeStuff servers. Please try again.'
      },
      error: 'Unable to connect to FreeStuff servers. Please try again.'
    })
  }

  //

  public static async rawGet(url: string, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.get(API.BASE_URL + url, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawPost(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.post(API.BASE_URL + url, body, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawPatch(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.patch(API.BASE_URL + url, body, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawDelete(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.delete(API.BASE_URL + url, this.buildConf(headers, body)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  //

  public static authLogin(provider: string) {
    return this.rawGet(`/auth/login/${provider.toLowerCase()}`)
  }

  public static authCode(provider: string, code: string) {
    return this.rawPost(`/auth/code/${provider.toLowerCase()}`, { code })
  }

  public static authMe() {
    return this.rawGet('/auth/me')
  }

  //

  public static getProjects() {
    return this.rawGet('/projects')
  }

  public static getProject(id: string) {
    return this.rawGet(`/project/${id}`)
  }

  public static postProject(id: string, data: any) {
    return this.rawPost(`/project/${id}`, data)
  }

  public static patchProject(id: string, data: any) {
    return this.rawPatch(`/project/${id}`, data)
  }

  public static deleteProject(id: string) {
    return this.rawDelete(`/project/${id}`)
  }

}

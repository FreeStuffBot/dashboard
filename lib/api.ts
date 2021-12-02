import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


export type projectRoute = { project: string }
export type bucketRoute = { project: string, bucket: string }
export type languageRoute = { project: string, language: string }
export type translationContextRoute = { project: string, language: string, bucket: string }
export type lineRoute = { project: string, bucket: string, line: string, language: string }

export type ErrorData = { error: string }

export default class API {

  public static readonly API_HOST = () => {
    const host = window.$nuxt?.$route.query?.API_HOST?.toString()
    if (host) {
      if (host.toLowerCase() === 'null') {
        localStorage.removeItem('API_HOST')
      } else {
        localStorage.setItem('API_HOST', host.endsWith('/') ? host.substr(0, host.length - 1) : host)
        return host
      }
    }
    if (localStorage.getItem('API_HOST'))
      return localStorage.getItem('API_HOST')?.toString() || ''

    return 'https://api.freestuffbot.xyz'
  }

  public static readonly BASE_URL = () => API.API_HOST() + '/dash'

  public static getAuthToken(): string {
    return localStorage.getItem('token') || ''
  }

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
      const res = await axios.get(API.BASE_URL() + url, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawPost(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.post(API.BASE_URL() + url, body, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawPatch(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.patch(API.BASE_URL() + url, body, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawPut(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.put(API.BASE_URL() + url, body, this.buildConf(headers)) as any
      if (res.status < 200 || res.status >= 300)
        res.error = res.data.error ? window.$nuxt?.$t('error_' + res.data.error, { details: res.data.message }) as string : `http ${status}`
      return res
    } catch (ex) {
      return this.buildConnRefError()
    }
  }

  public static async rawDelete(url: string, body?: any, headers?: any): Promise<AxiosResponse & ErrorData> {
    try {
      const res = await axios.delete(API.BASE_URL() + url, this.buildConf(headers, body)) as any
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

  public static getLanguageList() {
    return this.rawGet('/translate/list')
  }

  public static getLanguage(id: string) {
    return this.rawGet(`/translate/language/${id}`)
  }

  public static patchLanguage(id: string, data: any) {
    return this.rawPatch(`/translate/language/${id}`, data)
  }

  public static putLanguage(id: string, data: any) {
    return this.rawPut(`/translate/language/${id}`, data)
  }

  //

  public static getContentList(offset: number, amount: number) {
    return this.rawGet(`/content/list/${offset}/${amount}`)
  }

  public static getContentData(id: string) {
    return this.rawGet(`/content/data/${id}`)
  }

  public static getGuildAmount(store: string, price: string | number, trash: boolean) {
    return this.rawGet(`/content/guildamount/${store}/${price}/${trash}`)
  }

  public static getThumbnail(thumbnail: string, tags: string) {
    return this.rawGet(`/content/thumbnail/${thumbnail}/${tags}`)
  }

  public static postApprove(data: any) {
    return this.rawPost('/content/approve', data)
  }

  public static postSave(data: any) {
    return this.rawPost('/content/save', data)
  }

  public static postDecline(data: any) {
    return this.rawPost('/content/decline', data)
  }

  public static postDelete(data: any) {
    return this.rawPost('/content/delete', data)
  }

  public static postNewScratch() {
    return this.rawPost('/content/new/scratch')
  }

  public static postNewUrl(url: string) {
    return this.rawPost('/content/new/url', { url })
  }

  public static postScrapeStore(store: any) {
    return this.rawPost(`/content/scrape/${store}`)
  }

  //

  public static getAppData() {
    return this.rawGet('/app')
  }

  public static postAppCreate() {
    return this.rawPost('/app')
  }

  public static postAppRegenKey() {
    return this.rawPost('/app/key/regen')
  }

  public static patchAppWebhook(url: string, secret: string) {
    return this.rawPatch('/app/webhook', { url, secret })
  }

  public static postAppWebhookTest(url: string, secret: string) {
    return this.rawPost('/app/webhook/test', { url, secret })
  }

  public static patchAppDescription(text: string) {
    return this.rawPatch('/app/description', { text })
  }

  //

  public static getStatsAll() {
    return this.rawGet('/stats/all')
  }

  public static getStatsSettings() {
    return this.rawGet('/stats/settings')
  }

  //

  public static adminGetTopClients() {
    return this.rawGet('/admin/topclients')
  }

  public static adminGetUsers() {
    return this.rawGet('/admin/users')
  }

  public static adminGetUser(id: string) {
    return this.rawGet(`/admin/users/${id}`)
  }

  public static adminPostUsers(data: any) {
    return this.rawPost('/admin/users', data)
  }

  public static adminGetExperiments() {
    return this.rawGet('/admin/experiments')
  }

  public static adminPostExperiment(data: any) {
    return this.rawPost('/admin/experiments', data)
  }

  public static adminPatchExperiment(data: any) {
    return this.rawPatch('/admin/experiments', data)
  }

  public static adminGetGuild(id: string) {
    return this.rawGet(`/admin/guilds/${id}`)
  }

  public static adminGetApps() {
    return this.rawGet('/admin/apps')
  }

  public static adminGetConfig() {
    return this.rawGet('/admin/config')
  }

  public static adminPatchConfig(data: any) {
    return this.rawPatch('/admin/config', data)
  }

  public static adminGetLogs() {
    return this.rawGet('/admin/logs')
  }

  public static adminGetLogFile(file: string) {
    return this.rawGet(`/admin/logs/${file}`)
  }

}

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


export type projectRoute = { project: string }
export type bucketRoute = { project: string, bucket: string }
export type languageRoute = { project: string, language: string }
export type translationContextRoute = { project: string, language: string, bucket: string }
export type lineRoute = { project: string, bucket: string, line: string, language: string }

export type ErrorData = { error: string }

export type PostTranslateApplicationBody = {
  language: string
  userSince: string
  whyThem: string
  whereFrom: string
}

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
    headers = headers || {}
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

  public static getTranslateApplicationStatus() {
    return this.rawGet('/translations/applications/@me')
  }
  
  public static postTranslateApplication(payload: PostTranslateApplicationBody) {
    return this.rawPost('/translations/applications', payload)
  }

  public static getTranslateApplications(options: { countOnly?: boolean, declined?: boolean }) {
    const query = Object.entries(options).map(kv => kv.join('=')).join('&')
    return this.rawGet(`/translations/applications?${query}`)
  }

  public static patchTranslateApplication(id: string, data: { action: 'accept' | 'decline' | 'dismiss', reason?: string }) {
    return this.rawPatch(`/translations/applications/${id}`, data)
  }

  public static getLanguagesPreview() {
    return this.rawGet('/translations/languages-preview')
  }

  public static getLanguageList() {
    return this.rawGet('/translations/languages')
  }

  public static getLanguage(id: string) {
    return this.rawGet(`/translations/languages/${id}`)
  }

  public static patchTranslationCommentVote(id: string, data: { vote: number } | { approve: boolean }) {
    return this.rawPatch(`/translations/comments/${id}`, data)
  }

  public static getTranslationComments(lang: string, line: string) {
    return this.rawGet(`/translations/comments/${lang}/${line}`)
  }

  public static postTranslationComment(lang: string, line: string, text: string) {
    return this.rawPost(`/translations/comments/${lang}/${line}`, { text })
  }

  public static postLanguageLine(data: { key: string, english: string, description?: string }) {
    return this.rawPost('/translations/lines', data)
  }

  //

  public static getProductList(options: { offset?: number, limit?: number, queryName?: 'pending' | 'published' } = {}) {
    const query = Object.entries(options).map(kv => kv.join('=')).join('&')
    return this.rawGet(`/content/products?${query}`)
  }

  public static getProduct(id: string) {
    return this.rawGet(`/content/products/${id}`)
  }

  public static postProduct(data: { url: string }) {
    return this.rawPost('/content/products', data)
  }

  public static patchProduct(id: string, data: any) {
    return this.rawPatch(`/content/products/${id}`, data)
  }

  /** will take a url and a boolean whether to merge and apply changes */
  public static postProductRefetch(id: string, data: { url: string, merge: boolean }) {
    return this.rawPost(`/content/products/${id}/refetch`, data)
  }

  public static postAnnouncement(data: { products: number[] }) {
    return this.rawPost('/content/announcements', data)
  }

  public static getPlatformList(options: { offset?: number, limit?: number, queryName?: string } = {}) {
    const query = Object.entries(options).map(kv => kv.join('=')).join('&')
    return this.rawGet(`/content/platforms?${query}`)
  }

  public static postPlatform(id: string) {
    return this.rawPost('/content/platforms', { id })
  }

  public static patchPlatform(id: string, data: any) {
    return this.rawPatch(`/content/platforms/${id}`, data)
  }

  public static deletePlatform(id: string) {
    return this.rawDelete(`/content/platforms/${id}`)
  }

  public static getCurrencyList(options: { offset?: number, limit?: number, queryName?: string } = {}) {
    const query = Object.entries(options).map(kv => kv.join('=')).join('&')
    return this.rawGet(`/content/currencies?${query}`)
  }

  public static postCurrency(id: string) {
    return this.rawPost('/content/currencies', { id })
  }

  public static patchCurrency(id: string, data: any) {
    return this.rawPatch(`/content/currencies/${id}`, data)
  }

  public static deleteCurrency(id: string) {
    return this.rawDelete(`/content/currencies/${id}`)
  }

  //

  public static getAdminExperiments() {
    return this.rawGet('/admin/experiments')
  }

  public static getAdminConfig(name: 'global' | 'service-composition') {
    return this.rawGet(`/admin/config/${name}`)
  }

  public static patchAdminConfig(name: 'global' | 'service-composition', data: any) {
    return this.rawPatch(`/admin/config/${name}`, data)
  }

  public static getAdminServices() {
    return this.rawGet('/admin/services')
  }

  public static postAdminServicesCommand(command: { receivers: string[], name: string, data?: any }) {
    return this.rawPost('/admin/services/command', command)
  }

  /*
   *
   *
   *
   *
   *
   *
   *
   *
   */

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

  public static postNotificationRead(notification: string) {
    return this.rawPost(`/notifications/${notification}/read`)
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

  public static adminGetUsers() {
    return this.rawGet('/admin/users')
  }
  
  public static adminPostUser(data: any) {
    return this.rawPost('/admin/users', data)
  }

  public static adminPatchUser(id: string, data: any) {
    return this.rawPatch(`/admin/users/${id}`, data)
  }

  public static adminDeleteUser(id: string) {
    return this.rawDelete(`/admin/users/${id}`)
  }

  public static adminPostExperiment(data: any) {
    return this.rawPost('/admin/experiments', data)
  }

  public static adminPatchExperiment(id: string, data: any) {
    return this.rawPatch(`/admin/experiments/${id}`, data)
  }

  public static adminDeleteExperiment(id: string) {
    return this.rawDelete(`/admin/experiments/${id}`)
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

  public static adminGetServices() {
    return this.rawGet('/admin/services')
  }

  public static adminPostInternalCommand(command: string) {
    return this.rawPost('/admin/internal/command', { command })
  }

}

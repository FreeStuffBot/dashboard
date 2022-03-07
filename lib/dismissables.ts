

export default class Dismissables {

  // eslint-disable-next-line no-useless-constructor
  constructor(private name: string) { }

  //

  public static CMS_SAVE_AND_APPROVE_INFO = new Dismissables('cms_save_and_approve_info')
  public static CMS_SAVE_DRAFT_INFO = new Dismissables('cms_save_draft_info')

  //

  public get show(): boolean {
    return !localStorage.getItem(`dismissables.${this.name}`)
  }

  public dismiss(): void {
    localStorage.setItem(`dismissables.${this.name}`, 'true')
  }

}

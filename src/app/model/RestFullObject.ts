export abstract class RestFullObject {
  id: number;
  public _links: {
    self: {
      href: string
    }
  };

  protected constructor(_links?: any) {
    if (_links) { this._links = _links; }
  }
}

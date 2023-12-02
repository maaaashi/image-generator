export class Image {
  constructor(
    private _url: string,
    private _draw: string,
    private _prompt: string,
    private _binary: string
  ) {}

  get url() {
    return this._url
  }

  get binary() {
    return this._binary
  }

  get draw() {
    return this._draw
  }

  get prompt() {
    return this._prompt
  }
}

// unused
export class Result<T, ET> {
  value: T | undefined;
  error: ET | undefined;

  public unwrap(): T | never {
    if (this.value != null) return this.value;
    else throw "Unwrapping with an empty value";
  }

  public isOk() {
    return this.value != null;
  }
}

export interface ErrorInterface {
  error: string;
}

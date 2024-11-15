// unused

export class Result<ValType, ErrType> {
	value: ValType | undefined;
	error: ErrType | undefined;

	public unwrap(): ValType | never {
		if (this.value != null) return this.value;
		else throw "Unwrapping with an empty value";
	}

	public isOk() {
		return this.value != null;
	}
}

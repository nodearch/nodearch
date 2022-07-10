export class VaultError extends Error {

  errors: string[];
  statusCode: number;

  constructor(vaultHttpError: any) {
    super(vaultHttpError.message);
    this.statusCode = vaultHttpError.statusCode;

    const matchResult = this.message.match(/({.*})/);

    if (matchResult && matchResult.length) {
      try {
        this.errors = JSON.parse(matchResult[1]).errors;
      }
      catch(e) {
        this.errors = [this.message];
      }
    }
    else {
      this.errors = [this.message];
    }
  }
} 
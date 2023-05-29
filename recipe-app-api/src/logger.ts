export class Logger {

  public info(logText: string): void {
    console.log(`\u001b[34m ${new Date()} info::::: ${logText}`);
  }

  public debug(logText: string): void {
    console.log(`\u001b[33m${new Date()} debug::::: ${logText}`);
  }

  public error(logText: string): void {
    console.log(`\u001b[31m ${new Date()} error::::: ${logText}`);
  }
}

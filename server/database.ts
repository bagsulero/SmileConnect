export interface LogEntry {
  timestamp: Date;
  action: string;
  details: string;
}

export class Database {
  public logs: LogEntry[] = [];

  addLog(action: string, details: string) {
    this.logs.push({
      timestamp: new Date(),
      action,
      details,
    });
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export const database = new Database();
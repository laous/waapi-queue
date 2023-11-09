export interface IUser {
  id: string;
  name?: string;
  email: string;
  password?: string;
  actions?: IUserAction[];
}

export interface IAction {
  id: string;
  name: string;
  maxCredits: number;
}

export interface IQueueAction {
  actionId: string;
  name?: string;
  addedAt: Date;
  executedAt?: Date;
  executed?: boolean;
}

export interface IQueue {
  id?: string;
  actions?: IQueueAction[];
  userId?: string;
}

export interface IUserAction {
  actionId?: string;
  name?: string;
  credit?: number;
  calculatedAt?: Date;
}

export enum ActionType {
    LOG_IN = 'LOG_IN',
    LOG_OUT = 'LOG_OUT',
};

interface LogInAction {
    type: typeof ActionType.LOG_IN;
    payload: {
        username: string;
    };
};

interface LogOutAction {
    type: typeof ActionType.LOG_OUT;
};

export type Action = LogInAction | LogOutAction;
// services/ so chama quem registra as funcoes e o app/store,

export interface AuthBridgeHandlers {
  getAccessToken: () => string | null;
  hasRefreshToken: () => boolean;
  renewSession: () => Promise<string>;
  onSessionExpired: () => void;
}

const unregistered: AuthBridgeHandlers = {
  getAccessToken: () => null,
  hasRefreshToken: () => false,
  renewSession: () => Promise.reject(new Error('authBridge ainda nao foi registrado')),
  onSessionExpired: () => {},
};

let handlers: AuthBridgeHandlers = unregistered;

export const authBridge = {
  get token() {
    return handlers.getAccessToken();
  },
  get canRenew() {
    return handlers.hasRefreshToken();
  },
  renew: () => handlers.renewSession(),
  expire: () => handlers.onSessionExpired(),
  register(next: AuthBridgeHandlers) {
    handlers = next;
  },
};

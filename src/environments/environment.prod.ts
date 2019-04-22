export const environment = {
  production: true,
  name: 'PROD',
  CSP_URL: 'https://cspportal.ais.co.th/SFFWeb/pages/home/aisMyChannel.jsf',
  AUTH_URL: 'https://cspportal.ais.co.th/SFFWeb/pages/home/portal.jsf',
  WEB_CONNECT_URL: 'wss://localhost:8088',
  TEST_OTP_MOBILE: null,
  MOBILE_STATUS: ['000', 'active', '377', 'terminate', '378', 'suspend', '379', 'disable'],
  MPAY_QRCODE: {
    PB_SERVICE_ID: '3000000000026569', RL_SERVICE_ID: '3000000000026571',
    PB_TERMINAL_ID: 3082, RL_TERMINAL_ID: 5767,
    PB_TYPE: '003', RB_TYPE: '002'
  }
};

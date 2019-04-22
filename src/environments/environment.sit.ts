export const environment = {
  production: false,
  name: 'SIT',
  CSP_URL: 'https://sffsit.ais.co.th:8103/SFFWeb/pages/home/aisMyChannel.jsf',
  AUTH_URL: 'https://sffsit.ais.co.th:8103/SFFWeb/pages/home/portal.jsf',
  WEB_CONNECT_URL: 'wss://localhost:8088',
  TEST_OTP_MOBILE: '0927095833',
  MOBILE_STATUS: ['000', 'active', '377', 'terminate', '378', 'suspend', '379', 'disable'],
  MPAY_QRCODE: {
    PB_SERVICE_ID: '5000000000004683', RL_SERVICE_ID: '5000000000004683',
    PB_TERMINAL_ID: 1000000, RL_TERMINAL_ID: 1000000,
    PB_TYPE: '003', RB_TYPE: '002'
  }
};

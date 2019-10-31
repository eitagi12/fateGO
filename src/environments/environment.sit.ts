export const environment = {
  production: false,
  name: 'SIT',
  CSP_URL: 'https://sffsit.ais.co.th:8103/SFFWeb/pages/home/aisMyChannel.jsf',
  sffHomeUrl: 'http://10.13.81.39:8103/SFFWeb/pages/home/index.jsf',
  AUTH_URL: 'https://sffsit.ais.co.th:8103/SFFWeb/pages/home/portal.jsf',
  WEB_CONNECT_URL: 'wss://localhost:8088',
  TEST_OTP_MOBILE: '0927095833',
  TEST_OTP_MOBILE_POSTPAID: '0623180146',
  MOBILE_STATUS: ['000', 'active', '377', 'terminate', '378', 'suspend', '379', 'disable'],
  MPAY_QRCODE: {
    PB_SERVICE_ID: '5000000000004683', RL_SERVICE_ID: '5000000000006541',
    PB_WDS_SERVICE_ID: '5000000000004681', RL_WDS_SERVICE_ID: '5000000000006554',
    PB_TERMINAL_ID: 1000000, RL_TERMINAL_ID: 1000605,
    PB_WDS_TERMINAL_ID: 10017, RL_WDS_TERMINAL_ID: 1000607,
    PB_TYPE: '003', RB_TYPE: '002'
  },
  DEVICE: {
    device_os: 'IOS',
    device_version: '12.2',
    udid: 'A851D645-3DA1-41CF-8EAC-6F7B8860C55A'
  },
  USERNAME_MOCK: {
    username: 'kittiskr',
    locationCode: '71900'
  }
};

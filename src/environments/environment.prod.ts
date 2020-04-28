export const environment = {
  production: true,
  name: 'PROD',
  CSP_URL: 'https://cspportal.ais.co.th/SFFWeb/pages/home/aisMyChannel.jsf',
  AUTH_URL: 'https://cspportal.ais.co.th/SFFWeb/pages/home/portal.jsf',
  sffHomeUrl: 'https://sffportal.ais.co.th/SFFWeb/pages/home/index.jsf',
  MYCHANNEL_WEB_URL: 'https://mychannel.ais.co.th/web',
  WEB_CONNECT_URL: 'wss://localhost:8088',
  TEST_OTP_MOBILE: null,
  MOBILE_STATUS: ['000', 'active', '377', 'terminate', '378', 'suspend', '379', 'disable'],
  PREFIX_SHORT_LINK:  'https://m.ais.co.th/mc',
  ENABLE_SHORT_LINK:  true,
  MPAY_QRCODE: {
    PB_SERVICE_ID: '3000000000026569', RL_SERVICE_ID: '3000000000026571',
    PB_WDS_SERVICE_ID: '3000000000028332', RL_WDS_SERVICE_ID: '3000000000028336',
    PB_TERMINAL_ID: 3082, RL_TERMINAL_ID: 5767,
    PB_WDS_TERMINAL_ID: 4799, RL_WDS_TERMINAL_ID: 4804,
    PB_TYPE: '003', RB_TYPE: '002'
  },
  DEVICE: {
    device_os: null,
    device_version: null,
    udid: null
  },
  USERNAME_MOCK: {
    username: null,
    locationCode: null
  }
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'LOCAL',
  CSP_URL: '',
  AUTH_URL: 'http://10.13.81.39:8103/SFFWeb/pages/home/portal.jsf',
  sffHomeUrl: 'http://10.13.81.39:8103/SFFWeb/pages/home/index.jsf',
  MYCHANNEL_WEB_URL: 'http://10.137.16.46:8080/web',
  WEB_CONNECT_URL: 'wss://localhost:8088', // 'wss://172.16.62.114:8088',
  TEST_OTP_MOBILE_POSTPAID: '0623180146',
  TEST_OTP_MOBILE: '0927095833',
  MOBILE_STATUS: ['000', 'active', '377', 'terminate', '378', 'suspend', '379', 'disable'],
  MPAY_QRCODE: {
    PB_SERVICE_ID: '5000000000004683', RL_SERVICE_ID: '5000000000006541',
    PB_WDS_SERVICE_ID: '5000000000004681', RL_WDS_SERVICE_ID: '5000000000006554',
    PB_TERMINAL_ID: 1000000, RL_TERMINAL_ID: 1000000,
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
  },
  PREFIX_SHORT_LINK:  'https://stg-m.ais.co.th/mc',
  ENABLE_SHORT_LINK:  true,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

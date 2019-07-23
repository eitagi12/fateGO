import { Injectable, NgZone, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Environment, Utils, AlertService, MOCK_SIGNATURE } from 'mychannel-shared-libs';

declare let window: any;

export class SignedApi {
    readonly SignaturePad: string = 'SignaturePad';
    readonly ON_SCREEN_SIGNPAD: string = 'OnscreenSignpad';
}

@Injectable({
  providedIn: 'root'
})
export class AisNativeOrderService {

   private barcode: Subject<string> = new Subject<string>();
    private camera: Subject<string> = new Subject<string>();
    private signature: Subject<string> = new Subject<string>();
    private mobileNo: Subject<string> = new Subject<string>();
    private username: Subject<string> = new Subject<string>();
    private locationCode: Subject<string> = new Subject<string>();

    readonly ERROR_BROWSER_NOT_SUPPORTED: string = 'เว็บเบราว์เซอร์นี้ไม่รองรับการเซ็นลายเซ็น';

    constructor(
        @Inject('environment')
        private environment: Environment,
        private _ngZone: NgZone,
        private utils: Utils,
        private alertService: AlertService
    ) {
        this.registerCallback();
    }

    /*signature
    */
    openSigned(apiSigned?: 'SignaturePad' | 'OnscreenSignpad', position?: string): Observable<any> {
        return new Observable(observer => {
            if (!WebSocket) {
                observer.next({
                    error: this.ERROR_BROWSER_NOT_SUPPORTED
                });
                return;
            }

            if (this.utils.isAisNative()) {
                window.aisNative.captureSignature();
                return;
            }

            apiSigned = apiSigned || 'SignaturePad';
            const webSocketURL = `${this.environment.WEB_CONNECT_URL}/${apiSigned}`;
            const ws = new WebSocket(webSocketURL);

            ws.onopen = () => {
                if (apiSigned === 'SignaturePad') {
                    ws.send('{Who:Customer,Why:Purchase}');
                } else {
                    ws.send(position ? position : '{x:100,y:280}');
                }
                observer.next({
                    ws: ws
                });
            };

            ws.onmessage = (evt: any) => {
                if (apiSigned === 'SignaturePad') {
                    this.signature.next(JSON.parse(evt.data).SigImage);
                } else {
                    this.signature.next(JSON.parse(evt.data).Base64Image);
                }
                ws.close();
            };

            ws.onerror = (error) => {
                if (this.environment.production) {
                    this.alertService.error('ไม่สามารถทำรายการได้กรุณาติดต่อพนักงานเพื่อดำเนินการ');
                    return;
                }
                this.alertService.question('ไม่พบ Signpad library *(จำลองลายเซ็นเฉพาะเทสเท่านั้น)')
                    .then((data: any) => {
                        if (data.value) {
                            this.signature.next(MOCK_SIGNATURE);
                        } else {
                            observer.next({
                                error: this.ERROR_BROWSER_NOT_SUPPORTED
                            });
                        }
                    });
                ws.close();
            };

            return (() => {
                ws.close();
            });
        });
    }

    getSigned(): Observable<string> {
        return this.signature;
    }

    /*camera
    */
    openCamera(isCrop: boolean): void {
        if (isCrop) {
            window.aisNative.cropPhotoFromCamera();
        } else {
            window.aisNative.takePhotoFromCamera();
        }
    }

    getCamera(): Observable<string> {
        return this.camera;
    }

    /*barcode
    */
    scanBarcode(): void {
        if (this.utils.isAisNative()) {
            window.aisNative.scanBarcode();
        } else {
            if (this.environment.production) {
                this.alertService.warning('The browser doesn\'t support ais native');
            } else {
                this.alertService.notify({
                    title: 'Enter your imei',
                    input: 'text',
                    inputAttributes: {
                        maxlength: 15,
                        autocapitalize: 'off',
                        autocorrect: 'off'
                    }
                })
                    .then((data: any) => {
                        this.barcode.next(data.value);
                    });
            }
        }
    }

    getBarcode(): Observable<string> {
        return this.barcode;
    }

    getNativeMobileNo(): void {
        if (window.aisNative) {
            window.aisNative.getMobileNo();
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.getMobileNo.postMessage('');
        } else {
            // TODO
        }
    }

    getNativeUsername(): void {
        if (window.aisNative) {
          window.aisNative.getUserName();
        }  else if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.getUserName.postMessage('');
        } else {
            // TODO
        }
    }

    getMobileNo(): Observable<string> {
        return this.mobileNo;
    }

    getUsername(): Observable<string> {
        return this.username;
    }

    getLocationCode(): Observable<string> {
        return this.locationCode;
    }

    printThermalTradeIn(data: string): void {
        window.aisNative.printThermalTradeIn(data);
    }

    /*-------------------*/
    private registerCallback(): void {
        window.onBarcodeCallback = this.barcodeCallback.bind(this);
        window.onCropPhotoCallback = this.cameraCallback.bind(this);
        window.onCameraCallback = this.cameraCallback.bind(this);
        window.onSignatureCallback = this.signatureCallback.bind(this);
        window.onMobilNoCallback  = this.onMobileNoCallback.bind(this);
        window.onUserNameCallback = this.onUserNameCallback.bind(this);
    }

    private barcodeCallback(barcode: any): void {
        if (barcode && barcode.length > 0) {
            this._ngZone.run(() => {
                const parser: any = new DOMParser();
                const xmlDoc: any = parser.parseFromString(`<data> ${barcode}</data>`, 'text/xml');
                const imei = xmlDoc.getElementsByTagName('barcode')[0].firstChild.nodeValue;
                this.barcode.next(imei);
            });
        }
    }

    private cameraCallback(xml: string): void {
        this._ngZone.run(() => {
            const parser: any = new DOMParser();
            const xmlDoc: any = parser.parseFromString(xml, 'text/xml');
            const image = xmlDoc.getElementsByTagName('camera')[0].firstChild.nodeValue;
            this.camera.next(image);
        });
    }

    private signatureCallback(signatureImage: string): void {
        this._ngZone.run(() => {
            const parser: any = new DOMParser();
            const xmlDoc: any = parser.parseFromString(signatureImage, 'text/xml');
            const images = xmlDoc.getElementsByTagName('signature')[0].firstChild.nodeValue;
            this.signature.next(images);
        });
    }

    private onMobileNoCallback(mobileNo: any): void {
        if (mobileNo && mobileNo.length > 0) {
            this._ngZone.run(() => {
                this.mobileNo.next(mobileNo);
            });
        }
    }

  private onUserNameCallback(response: any): void {
      // ios
      if (response && response.hasOwnProperty('username')) {
        this._ngZone.run(() => {
          this.username.next(response.username);
        });
      }
      if (response && response.hasOwnProperty('locationCode')) {
        this._ngZone.run(() => {
          this.locationCode.next(response.locationCode);
        });
      }
      // android
      if (response && response.length > 0) {
        this._ngZone.run(() => {
            this.username.next(response);
        });
      }
    }
}

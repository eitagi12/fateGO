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
export class AisNativeMnpService {

   private barcode: Subject<string> = new Subject<string>();
    private camera: Subject<string> = new Subject<string>();
    private signature: Subject<string> = new Subject<string>();

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
                console.log('evt.data', evt.data);
                ws.close();
            };

            ws.onerror = (error) => {
                if (this.environment.production) {
                    this.alertService.error('ไม่สามารถเซ็นลายเซ็นได้ กรุณาติดต่อ 02-029-6303');
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

    printThermalTradeIn(data: string): void {
        window.aisNative.printThermalTradeIn(data);
    }

    /*-------------------*/
    private registerCallback(): void {
        window.onBarcodeCallback = this.barcodeCallback.bind(this);
        window.onCropPhotoCallback = this.cameraCallback.bind(this);
        window.onCameraCallback = this.cameraCallback.bind(this);
        window.onSignatureCallback = this.signatureCallback.bind(this);

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
}

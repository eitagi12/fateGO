import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PrinterComponent } from '../printer/printer.component';
import { AlertService, PageLoadingService } from 'mychannel-shared-libs';

declare var window: any;

@Component({
  selector: 'app-resize-image',
  templateUrl: './resize-image.component.html',
  styleUrls: ['./resize-image.component.scss']
})
export class ResizeImageComponent implements OnInit {

  @Input() previewImage: string[] = [];

  @ViewChild(PrinterComponent)
  mcprinter: PrinterComponent;

  aisNative: any = window.aisNative;
  MESSAGE_NOT_SUPPORT_BROWSER: string = 'Could not support browser';

  constructor(
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService
  ) {
    this.aisNative = this.aisNative || {
      printToNetwork: (html: any): void => {
        alertService.error(this.MESSAGE_NOT_SUPPORT_BROWSER);
      },
      printToNetworkOrientation: (html: any, rotateCode: string): void => {
        alertService.error(this.MESSAGE_NOT_SUPPORT_BROWSER);
      }
    };
  }

  ngOnInit(): void {
  }

  printToNetwork(): void {
    this.imagePromise(this.previewImage)
    .then((images: string[]) => {
      let htmlCode: string = '';
      images.forEach((image: string) => {
        htmlCode += `<div style='text-align: center;'>` +
          `<img style='margin:0 auto; width: 72%;' src='${image}' alt=''>` +
          `<div>`;
      });
      this.aisNative.printToNetwork(htmlCode);
    });
  }

  printToNetworkOrientation(): void {
    this.imagePromise(this.previewImage)
      .then((images: string[]) => {
        let htmlCode: string = '';
        images.forEach((image: string, index: number) => {
          htmlCode += `<div style='text-align: center;'>` +
            `<img style='margin:0 auto 10px; width: 100%;' src='${image}' alt=''>` +
            `<div>`;
            if (index < images.length - 1) {
              htmlCode += '<hr>';
            }
        });
        this.aisNative.printToNetworkOrientation(htmlCode, '2');
      });
  }

  private imagePromise(images: string[]): Promise<any> {
    const promise: Promise<string>[] = [];
    images.forEach((src: string) => {
      promise.push(this.resizeDataURL(src));
    });
    return Promise.all(promise);
  }

  private resizeDataURL(image: string): Promise<string> {
    return new Promise((resovle, reject) => {
      // Max size for thumbnail
      const maxWidth: number = 700;
      const maxHeight: number = 700;
      // Create and initialize two canvas
      const canvas: any = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      const canvasCopy: any = document.createElement('canvas');
      const copyContext: any = canvasCopy.getContext('2d');

      // Create original image
      const img: any = new Image();
      img.onload = (): void => {
        // Determine new ratio based on max size
        let ratio: number = 1;
        if (img.width > maxWidth) {
          ratio = maxWidth / img.width;
        } else if (img.height > maxHeight) {
          ratio = maxHeight / img.height;
        }
        // Draw original image in second canvas
        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0);
        // Copy and resize second canvas to first canvas
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);

        resovle(canvas.toDataURL('image/jpeg'));
      };
      img.src = image;
    });
  }

  callPrint(): void {
    this.mcprinter.setItems(this.previewImage);
    this.mcprinter.print();
  }

}

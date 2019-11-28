import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss']
})
export class PrinterComponent implements OnInit {

  @ViewChild('elCanvas') elCanvas: ElementRef;
  @Input() items: string[];
  defaultImage: string[] = [];
  printerImage: string[] = [];
  angles: any = {
    '0': 0 * Math.PI,
    '90': 0.5 * Math.PI,
    '180': Math.PI,
    '270': 1.5 * Math.PI
  };

  constructor() { }

  ngOnInit(): void {
  }

  setItems(items: string[]): void {
    this.items = items;
  }

  renderImage(base64: string, deg: number): Promise<string> {
    return new Promise((resovle, reject) => {

      const canvas = this.elCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        ctx.beginPath();
        /// use index to set canvas size
        switch (deg) {
          case 0:
          case 180:
            /// for 0 and 180 degrees size = image
            canvas.width = image.width;
            canvas.height = image.height;
            break;
          case 90:
          case 270:
            /// for 90 and 270 canvas width = img height etc.
            canvas.width = image.height;
            canvas.height = image.width;
            break;
        }

        /// get stored angle and center of canvas
        const angle = this.angles['' + deg],
          cw = canvas.width * 0.5,
          ch = canvas.height * 0.5;

        /// rotate context
        ctx.translate(cw, ch);
        ctx.rotate(angle);
        ctx.translate(-image.width * 0.5, -image.height * 0.5);

        /// draw image and reset transform
        ctx.drawImage(image, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resovle(canvas.toDataURL());
      };
      image.src = base64;
    });
  }

  renderImageHTML(images: string[]): string {
    let html = '';
    images.forEach(image => {
      html += '<img src="' + image + '" />';
    });
    return html;
  }

  print(): void {
    const promises: Promise<any>[] = [];
    (this.items || []).forEach(item => {
      this.defaultImage.push(item);
      promises.push(this.renderImage(item, 90));
    });

    Promise.all(promises).then(values => {
        const popupWin = window.open('', 'E-Application', 'resizable=1,top=50,left=50,width=550');
        const html = `
        <html  moznomarginboxes>
          <head>
            <title>E-Application</title>
            <style>
              html, body { margin: 10px; text-align: center; }
              #print { display: none; }
              #show { display: block; }
              img { width: 100%; }

              @page { size: A5; margin: 5px; }
              @media print {
                @page { size: auto; margin: 0; }
                #Header, #Footer { display: none !important; }
                html, body { margin: 5px; width: 210mm; }
                img { page-break-after: always; }
                #print { display: block; }
                #show { display: none; }
              }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div id="show">`
            + this.renderImageHTML(this.defaultImage) +
            `</div><div id="print">`
            + this.renderImageHTML(values) +
            `</div></body>
        </html>
        `;

        popupWin.document.write(html);
        popupWin.document.close();
    });
  }
}

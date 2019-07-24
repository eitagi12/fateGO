import { Component, OnInit, ViewChild, ElementRef, OnChanges, Input, EventEmitter, Output, Pipe, PipeTransform } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
declare var $: any;

@Pipe({
  name: 'networkTypeFilter',
  pure: false
})
export class NetworkTypeFilter implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) { return items; }
    return items.filter(item => item.customAttributes.allow_ntype.indexOf(filter) !== -1);
  }
}
@Component({
  selector: 'app-vas-package-slider',
  templateUrl: './vas-package-slider.component.html',
  styleUrls: ['./vas-package-slider.component.scss']
})
export class VasPackageSliderComponent implements OnInit, OnChanges {

  @ViewChild('slider')
  slider: ElementRef;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  title: string;
  detail: string;
  selectedVasPackage: string;

  @Input() packages: any = [];
  @Input() networkType: any = '';
  @Output() selectedBestSellerPackage: EventEmitter<any> = new EventEmitter<any>();
  @Output() sellBestSellerPackage: EventEmitter<any> = new EventEmitter<any>();

  private $owl: any;

  constructor(
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.createSlider();
  }
  ngOnChanges(): void {
    this.slider.nativeElement.style.display = 'none';
    setTimeout(() => {
      this.$owl.trigger('destroy.owl.carousel')
        .removeClass('owl-loaded owl-hidden')
        .find('.owl-stage:empty, .owl-item:empty')
        .remove();
      this.createSlider();
    }, 50);
  }

  onSelectedPackage(value: any): void {
    this.selectedBestSellerPackage.emit(value);
  }

  private createSlider(): void {
    this.$owl = $(this.slider.nativeElement).owlCarousel({
      dots: true,
      responsive: {
        0: {
          items: 2
        },
        768: {
          items: 3
        },
        1024: {
          items: 3
        },
        1440: {
          items: 4
        }
      }
    });
    this.slider.nativeElement.style.display = 'block';
  }

  onOpenDetail(pack: any, detail: any, title: any): void {
    this.title = title;
    this.detail = detail;
    this.selectedVasPackage = pack;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  onSell(): void {
    this.modalRef.hide();
    if (this.selectedVasPackage) {
      this.sellBestSellerPackage.emit(this.selectedVasPackage);
    }
  }
}

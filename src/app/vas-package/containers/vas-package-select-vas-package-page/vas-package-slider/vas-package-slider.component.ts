import { Component, OnInit, ViewChild, ElementRef, OnChanges, Input, EventEmitter, Output } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-vas-package-slider',
  templateUrl: './vas-package-slider.component.html',
  styleUrls: ['./vas-package-slider.component.scss']
})
export class VasPackageSliderComponent implements OnInit, OnChanges {

  @ViewChild('slider')
  slider: ElementRef;

  @Input() packages: any;
  @Output() selectedBestSellerPackage: EventEmitter<any> = new EventEmitter<any>();

  private $owl: any;

  constructor() { }

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
}

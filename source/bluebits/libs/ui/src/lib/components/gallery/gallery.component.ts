import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styles: []
})
export class GalleryComponent implements OnInit {
    selectedImageUrl: string;
    _images: string[];

    @Input() set images(value: string[]) {
        if (this._images != value) this._images = value;
        if (this.hasImages) this.selectedImageUrl = this._images[0];
    }

    get images() {
        return this._images;
    }

    get hasImages() {
        return this._images?.length > 0;
    }

    ngOnInit(): void {
        if (this.hasImages) {
            this.selectedImageUrl = this.images[0];
        }
    }

    changeSelectedImage(imageUrl: string) {
        this.selectedImageUrl = imageUrl;
    }
}

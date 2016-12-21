import { Component } from "@angular/core";
import { ImageAsset } from 'image-asset';
import { ImageSource } from 'image-source';
import * as observable from "data/observable";
import * as imagesource from "image-source";
import * as platform from "platform";
import imageAssetModule = require("image-asset");

import * as application from 'application';
import fresco = require("nativescript-fresco");
import { ListViewEventData } from 'nativescript-telerik-ui/listview'
import { path, knownFolders, Folder } from 'file-system';
import { images } from './images';


var Intent = android.content.Intent;
var Activity = android.app.Activity;
var MediaStore = android.provider.MediaStore;
var DocumentsContract = (<any>android.provider).DocumentsContract;
var BitmapFactory = android.graphics.BitmapFactory;
var StaticArrayBuffer = <ArrayBufferStatic>ArrayBuffer;



@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public counter: number = 16;
    imageList: Array<any>;
    imgSelectedList: Array<any> = [];
    private _uri: android.net.Uri;
    constructor() {
        if (application.android) {
            fresco.initialize();
        }
    }

    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }

    onImageItemTap(args) {

    }

    itemSelected(args: ListViewEventData) {
        console.log('itemSelected =>', args.itemIndex);
        if (this.imgSelectedList && this.imgSelectedList.length < 9) {
            let item = this.imageList[args.itemIndex];
            this.imgSelectedList.push(item);
        }
        console.log('itemSelected imgSelectedList length=>', this.imgSelectedList.length);
    }

    itemDeselected(args: ListViewEventData) {
        if (this.imgSelectedList && this.imgSelectedList.length > 0) {
            this.imgSelectedList.splice(args.itemIndex, 1);
        }
        console.log('itemDeselected imgSelectedList length=>', this.imgSelectedList.length);
    }

    public onTap() {
        console.log('Button (tap)');
        this.imageList = this.getGalleryPhotos();
        // let templateList = [];
        // images.forEach(img => {
        //     templateList.push(img);
        // });
        // let templateList = [];
        // images.forEach(img => {
        //     console.log('image.forEach =>', JSON.stringify(img));
        //     let imgPath  = path.join(img.uri);
        //     let imgFile = new java.io.File(img.uri);
        //     let uri = android.net.Uri.parse(imgFile);
        //      img.fileUri = imgPath;
        //     // img.imageSource = this.decodeThumbUri(img.uri);
        //     console.log('onTap =>', JSON.stringify(img));
        //     templateList.push(img);

        // });
        // this.imageList = templateList;
        // console.log('imageList', JSON.stringify(this.imageList));
    }


    getGalleryPhotos() {
        let MediaStore = android.provider.MediaStore;
        console.log('getGalleryPhotos')
        let photoList: Array<any> = [];
        let cursor = null;
        // query columns
        //try {
            // let columns = [android.provider.MediaStore.Images.Media.DATA,
            // android.provider.MediaStore.Images.Media._ID];
            let columns = [MediaStore.MediaColumns.DATA];
            console.log('here ==============');
            // sort by _id
            let order_by = MediaStore.Images.Media._ID;
            let uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
            // get android cursor
            console.log('here ==============uri', uri);
            let provider = this.getContentResolver();
            console.log('here ==============provider', provider);
            cursor = provider.query(uri, columns, null, null, null);
            console.log('cursor =>', JSON.stringify(cursor));
            console.log('cursor getCount', cursor.getCount());
            if (cursor && cursor.getCount() > 0) {
                console.log('cursor moveToNext=>', cursor.moveToNext());
                while (cursor.moveToNext()) {
                    // let imagePicker = new ImagePicker();
                    let column_index = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);
                    let imageUri = cursor.getString(column_index) + '';
                    let name = imageUri.substring(imageUri.lastIndexOf('.'));
                    let imgPath = path.join(imageUri);
                    console.log('get image uri =>',imageUri);
                    // let imagesource = this.decodeThumbUri(imageUri);
                    let image  = {fileUri:imageUri, text:name};
                    photoList.push(image);
                }
            }
            return photoList;
        // } catch (error) {
        //     console.log('getGalleryPhotos=>', JSON.stringify(error));
        //     return undefined;
        // }
    }

    getContentResolver(): android.content.ContentResolver {
        let temp = application.android.nativeApp;
        if (temp) {
            console.log('getContentResolver=>', JSON.stringify(temp));
            return temp.getContentResolver();
        } else {
            console.log('getContentResolver error');
            return undefined;
        }

    }

    private decodeThumbAssetUri(uri: android.net.Uri): imageAssetModule.ImageAsset {
        // Decode image size
        var REQUIRED_SIZE = {
            maxWidth: 100,
            maxHeight: 100
        };
        console.log('decodeThumbAssetUri=>', uri);
        // Decode with scale
        return this.decodeUriForImageAsset(uri, REQUIRED_SIZE);
    }

    private decodeThumbUri(uri: android.net.Uri): imagesource.ImageSource {
        // Decode image size
        var REQUIRED_SIZE = {
            maxWidth: 100,
            maxHeight: 100
        };
        console.log('decodeThumbUri=>', uri);
        // Decode with scale
        return this.decodeUri(uri, REQUIRED_SIZE);
        // this.notifyPropertyChange("thumb", this._thumb);
    }

    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageSource.
     * @param options The options that should be used to decode the image.
     */
    private decodeUri(uri: android.net.Uri, options?: { maxWidth: number, maxHeight: number }): imagesource.ImageSource {
        console.log('decodeUri=>', uri);
        console.log('decodeUri options=>', JSON.stringify(options));
        var downsampleOptions = new BitmapFactory.Options();
        downsampleOptions.inSampleSize = 1;//this.getSampleSize(uri, options);

        console.log('decodeUri downsampleOptions=>', JSON.stringify(downsampleOptions));
        var bitmap = BitmapFactory.decodeStream(this.openInputStream(uri), null, downsampleOptions);
        var image = new imagesource.ImageSource();
        image.setNativeSource(bitmap);
        return image;
    }

    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageAsset.
     * @param options The options that should be used to decode the image.
     */
    private decodeUriForImageAsset(uri: android.net.Uri, options?: { maxWidth: number, maxHeight: number }): imageAssetModule.ImageAsset {
        console.log('decodeThumbAssetUri bitmap');
        var downsampleOptions = new BitmapFactory.Options();
        downsampleOptions.inSampleSize = this.getSampleSize(uri, options);
        var bitmap = BitmapFactory.decodeStream(this.openInputStream(uri), null, downsampleOptions);
        return new imageAssetModule.ImageAsset(bitmap);
    }

    /**
     * Discovers the sample size that a BitmapFactory.Options object should have
     * to scale the retrieved image to the given max size.
     * @param uri The URI of the image that should be scaled.
     * @param options The options that should be used to produce the correct image scale.
     */
    private getSampleSize(uri: android.net.Uri, options?: { maxWidth: number, maxHeight: number }): number {
        var boundsOptions = new BitmapFactory.Options();
        boundsOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeStream(this.openInputStream(uri), null, boundsOptions);

        // Find the correct scale value. It should be the power of 2.
        var outWidth = boundsOptions.outWidth;
        var outHeight = boundsOptions.outHeight;
        var scale = 1;
        if (options) {
            // TODO: Refactor to accomodate different scaling options
            //       Right now, it just selects the smallest of the two sizes
            //       and scales the image proportionally to that.
            var targetSize = options.maxWidth < options.maxHeight ? options.maxWidth : options.maxHeight;
            while (!(this.matchesSize(targetSize, outWidth) ||
                this.matchesSize(targetSize, outHeight))) {
                outWidth /= 2;
                outHeight /= 2;
                scale *= 2;
            }
        }
        return scale;
    }

    openInputStream(uri: android.net.Uri): java.io.InputStream {
        return this.getContentResolver().openInputStream(uri);
    }

    private matchesSize(targetSize: number, actualSize: number): boolean {
        return targetSize && actualSize / 2 < targetSize;
    }
}

export class ImagePicker {
    uri: string;
    text: string;
    fileUri: string;
    imgUri: android.net.uri;
    imageSource: ImageSource;
    constructor() {

    }
}

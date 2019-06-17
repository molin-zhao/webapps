import { Component, OnInit } from "@angular/core";
import { ObjectDetectionService } from "src/app/service/object-detection.service";
import { Ng2ImgMaxService } from "ng2-img-max";

@Component({
  selector: "app-service",
  templateUrl: "./service.component.html",
  styleUrls: ["./service.component.css"]
})
export class ServiceComponent implements OnInit {
  public imageUrl: any;
  public message: string;
  public uploading: boolean = false;
  private imageFile = null;
  public response: any = null;

  constructor(
    private objectDetectionService: ObjectDetectionService,
    private ng2ImgMax: Ng2ImgMaxService
  ) {}

  ngOnInit() {}

  preview = files => {
    if (!files || files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only image is supported";
    }
    let reader = new FileReader();
    this.imageFile = files[0];
    reader.readAsDataURL(this.imageFile);
    reader.onload = e => {
      this.imageUrl = reader.result;
    };
  };

  sendToServer = image => {
    let uploadImage = new FormData();
    uploadImage.append("image", image);
    this.objectDetectionService.objectDetection(uploadImage).subscribe(
      res => {
        this.response = res;
        this.uploading = false;
      },
      err => {
        console.log(err);
        this.message = typeof err === "string" ? err : err.message;
        this.uploading = false;
      }
    );
  };

  uploadFile = () => {
    this.uploading = true;
    this.message = "";
    this.response = null;
    if (this.imageFile) {
      if (this.imageFile.size > 1024 * 1024) {
        return this.ng2ImgMax.compressImage(this.imageFile, 1).subscribe(
          result => {
            let resultFile = this.blobToFile(result);
            return this.ng2ImgMax.resizeImage(resultFile, 300, 300).subscribe(
              result => {
                let resizedFile = this.blobToFile(result);
                return this.sendToServer(resizedFile);
              },
              error => {
                console.log(error);
                this.message = error.reason;
                this.uploading = false;
              }
            );
          },
          error => {
            console.log(error);
            this.message = error.reason;
            this.uploading = false;
          }
        );
      }
      return this.sendToServer(this.imageFile);
    }
  };

  showKey(data) {
    return Object.keys(data)[0];
  }

  showValue(data) {
    return Object.values(data)[0];
  }

  private blobToFile = (blob: Blob) => {
    let blob_obj: any = blob;
    return new File([blob], blob_obj.name, {
      lastModified: Date.now(),
      type: "image/jpeg"
    });
  };
}

import { Component, OnInit } from "@angular/core";
import { ObjectDetectionService } from "src/app/service/object-detection.service";

@Component({
  selector: "app-service",
  templateUrl: "./service.component.html",
  styleUrls: ["./service.component.css"]
})
export class ServiceComponent implements OnInit {
  public imagePath;
  public imageUrl: any;
  public message: string;
  public uploading: boolean = false;
  private imageFile = null;
  public response: any = null;

  constructor(private objectDetectionService: ObjectDetectionService) {}

  ngOnInit() {}

  preview(files) {
    if (!files || files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only image is supported";
    }
    let reader = new FileReader();
    this.imagePath = files;
    this.imageFile = files[0];
    reader.readAsDataURL(this.imageFile);
    reader.onload = e => {
      this.imageUrl = reader.result;
    };
  }

  uploadFile() {
    if (this.imageFile) {
      let image = new FormData();
      image.append("image", this.imageFile);
      this.uploading = true;
      this.message = "";
      this.response = null;
      this.objectDetectionService.objectDetection(image).subscribe(res => {
        this.response = res;
        this.uploading = false;
      });
    }
  }

  showKey(data) {
    return Object.keys(data)[0];
  }

  showValue(data) {
    return Object.values(data)[0];
  }
}

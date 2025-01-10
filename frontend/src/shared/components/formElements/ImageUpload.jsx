import { useRef, useState } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [isValid, setIsVaild] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const pickedHandler = (event) => {
    let valid = isValid;
    let file;
    if (event.target.files && event.target.files.length === 1) {
      valid = true;
      setIsVaild(true);
      file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      valid = false;
      setIsVaild(false);
    }

    props.onInput(props.id, file, valid);
  };


  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl&&<img src={previewUrl} alt="Preview" />}
          {!previewUrl&&<p>select Image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;

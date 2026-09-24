import { db } from "./firebase";

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "rvbujouj";
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ghazal_products";

export async function compressBase64(
  base64Data: string,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.5
): Promise<string> {
  if (!base64Data || typeof base64Data !== "string" || !base64Data.startsWith("data:image/")) {
    return base64Data;
  }
  
  if (base64Data.length < 40000) {
    return base64Data;
  }
  
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (result: string) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    const timer = setTimeout(() => finish(base64Data), 1500);

    try {
      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finish(canvas.toDataURL("image/webp", quality));
          } else {
            finish(base64Data);
          }
        } catch {
          finish(base64Data);
        }
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish(base64Data);
      };
      img.src = base64Data;
    } catch {
      clearTimeout(timer);
      finish(base64Data);
    }
  });
}

export async function uploadBase64ToCloudinary(base64Data: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", cloudinaryUploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Cloudinary image upload failed.");

  const result = await response.json();
  if (!result.secure_url) throw new Error("Cloudinary did not return an image URL.");
  return result.secure_url as string;
}

export async function uploadBase64ToStorage(base64Data: string, folder: string): Promise<string> {
  if (!base64Data.startsWith("data:")) {
    return base64Data;
  }

  if (base64Data.startsWith("data:image/")) {
    try {
      return await uploadBase64ToCloudinary(base64Data);
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed. Compressing base64 image as fallback...", cloudinaryError);
    }
  }

  try {
    return await compressBase64(base64Data, 500, 500, 0.5);
  } catch (compressError) {
    console.error("Compression failed:", compressError);
    return base64Data;
  }
}

function isPlainObject(val: any): boolean {
  if (typeof val !== "object" || val === null) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

export async function uploadAllBase64InObject<T>(obj: T, folder: string): Promise<T> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        return (await uploadBase64ToStorage(obj, folder)) as unknown as T;
      } catch (error) {
        console.error("Failed to upload base64 image to storage:", error);
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = await Promise.all(
      obj.map((item) => uploadAllBase64InObject(item, folder))
    );
    return newArray as unknown as T;
  }

  if (isPlainObject(obj)) {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await uploadAllBase64InObject((obj as any)[key], folder);
    }
    return newObj as T;
  }

  return obj;
}

export async function uploadAdminImage(folder: string, file: File): Promise<string> {
  let maxWidth = 450;
  let maxHeight = 450;
  let quality = 0.4;

  if (folder === "homepage" || folder === "hero") {
    maxWidth = 800;
    maxHeight = 800;
    quality = 0.5;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/webp", quality);
          uploadBase64ToStorage(dataUrl, folder)
            .then(resolve)
            .catch((err) => {
              console.error("Storage upload failed, using fallback base64:", err);
              resolve(dataUrl);
            });
        } else {
          const rawData = event.target?.result as string;
          uploadBase64ToStorage(rawData, folder)
            .then(resolve)
            .catch((err) => {
              console.error("Storage upload failed, using fallback base64:", err);
              resolve(rawData);
            });
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

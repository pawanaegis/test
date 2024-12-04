import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';

export const processImage = async(inputImagePath, outputImagePath, elements, signature) => {
  try {
    const image = await loadImage(inputImagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original image onto the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Configure text style
    ctx.font = '22px Arial';
    ctx.fillStyle = 'black'; // You can change the color

    // Process elements
    for (const element of elements) {
        ctx.fillText(element.text, element.position.x, element.position.y);
      
    }

    // Add signature image
    if (signature.image) {
      const signatureBuffer = Buffer.from(signature.image, 'base64');
      const signatureImage = await loadImage(signatureBuffer);
        ctx.drawImage(
          signatureImage,
          signature.position.x,
          signature.position.y,
          signature.size.width,
          signature.size.height
        );
    }

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/jpeg');

    // Use sharp to save the modified image
    await sharp(buffer).toFile(outputImagePath);
    return 'Text and signature added successfully!';
  } catch (error) {
    throw new Error(`Error processing image: ${error.message}`);
  }
}

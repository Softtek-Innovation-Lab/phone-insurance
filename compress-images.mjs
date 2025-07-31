import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import { globby } from 'globby';
import { stat, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const SOURCE_DIR = 'src/assets';
const DEST_DIR = 'src/assets-compressed';

async function compressImages() {
    console.log('Searching for images in:', SOURCE_DIR);
    const imagePaths = await globby(`${SOURCE_DIR}/**/*.{jpg,jpeg,png,gif,svg}`);
    console.log(`Found ${imagePaths.length} images to compress.`);

    if (imagePaths.length === 0) {
        console.log('No images found. Exiting.');
        return;
    }

    await mkdir(DEST_DIR, { recursive: true });

    for (const imagePath of imagePaths) {
        try {
            const sourceData = await stat(imagePath);
            const compressedFiles = await imagemin([imagePath], {
                destination: path.join(DEST_DIR, path.dirname(path.relative(SOURCE_DIR, imagePath))),
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({ quality: [0.6, 0.8] }),
                    imageminGifsicle(),
                    imageminSvgo(),
                ],
            });

            if (compressedFiles.length > 0) {
                const destPath = compressedFiles[0].destinationPath;
                await writeFile(destPath, compressedFiles[0].data);
                const destData = await stat(destPath);
                const savings = ((sourceData.size - destData.size) / sourceData.size * 100).toFixed(2);
                console.log(`Compressed: ${imagePath} -> ${destPath} (Saved: ${savings}%)`);
            }
        } catch (error) {
            console.error(`Error compressing ${imagePath}:`, error);
        }
    }

    console.log('Image compression finished.');
}

compressImages();

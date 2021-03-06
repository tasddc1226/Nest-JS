
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {

	try {
		console.log('๐พ Create a root uploads folder...');
		fs.mkdirSync(path.join(__dirname, '..', `uploads`));
	} catch (error) {
		console.log('The folder already exists...');
	}

	try {
		console.log(`๐พ Create a ${folder} uploads folder...`);
		fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
	} catch (error) {
		console.log(`The ${folder} folder already exists...`);
	}
};


// ํด๋๋ช์ ์ธ์๋ก ๋ฐ์์์ createFolder๋ฅผ ํตํด upload ํด๋์ ์๋ก์ด ํด๋๋ฅผ ๋ง๋ ๋ค
const storage = (folder: string): multer.StorageEngine => {

	createFolder(folder);
	return multer.diskStorage({
		destination(req, file, cb) {
			//* ์ด๋์ ์ ์ฅํ  ์ง
			const folderName = path.join(__dirname, '..', `uploads/${folder}`);
			cb(null, folderName);
		},

		filename(req, file, cb) {
			//* ์ด๋ค ์ด๋ฆ์ผ๋ก ์ฌ๋ฆด ์ง
			const ext = path.extname(file.originalname); // ํ์ฅ์ ์ถ์ถ

			const fileName = `${path.basename(
				file.originalname,
				ext,
			)}${Date.now()}${ext}`; // ํ์ผ์๋ก๋ ์ ์๊ฐ์ ์ฐ์ด์ filename์ ๋ง๋ ๋ค
			cb(null, fileName);
		},
	});
};


// multer ๋ชจ๋์ 2๋ฒ์งธ ์ธ์์ ๋ํ options
export const multerOptions = (folder: string) => { // upload ํด๋์์ ํด๋๋ฅผ ์ถ๊ฐ

	const result: MulterOptions = {
		storage: storage(folder),
	};
	return result;

};
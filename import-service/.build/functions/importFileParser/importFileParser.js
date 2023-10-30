"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFileParser = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const s3 = new aws_sdk_1.default.S3();
const importFileParser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const records = (event === null || event === void 0 ? void 0 : event.Records) || [];
    try {
        const resultPromises = records.map((record) => __awaiter(void 0, void 0, void 0, function* () {
            const bucketName = record.s3.bucket.name;
            const objectKey = record.s3.object.key;
            const params = { Bucket: bucketName, Key: objectKey };
            const s3Stream = yield s3.getObject(params).createReadStream();
            const newObjectKey = objectKey.replace('uploaded', 'parsed');
            yield s3.copyObject({
                Bucket: bucketName, CopySource: bucketName + '/' + objectKey, Key: newObjectKey,
            }).promise();
            console.log('File copied to ', "/parsed");
            yield s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();
            console.log('Old file deleted', objectKey);
            return new Promise((resolve, reject) => {
                const results = [];
                s3Stream
                    .pipe((0, csv_parser_1.default)())
                    .on('data', (data) => {
                    console.log('CSV Record:', data);
                    results.push(data);
                })
                    .on('end', () => {
                    console.log('CSV Parsing Completed');
                    resolve(results);
                })
                    .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
            });
        }));
        const allResults = yield Promise.all(resultPromises);
        console.log('All Results:', allResults);
        return 'CSV processing started.';
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
});
exports.importFileParser = importFileParser;

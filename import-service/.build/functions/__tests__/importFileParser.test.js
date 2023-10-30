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
const aws_sdk_mock_1 = __importDefault(require("aws-sdk-mock"));
const importFileParser_1 = require("../importFileParser");
describe('Lambda Function Tests', () => {
    beforeAll(() => {
        aws_sdk_mock_1.default.mock('S3', 'getObject', (params, callback) => {
            const data = {
                Body: [{
                        id: '9878a151100',
                        title: 'The Great Gatsby100',
                        description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
                        price: '15.99'
                    }]
            };
            callback(null, data);
        });
    });
    afterAll(() => {
        aws_sdk_mock_1.default.restore('S3');
    });
    it('should process S3 events and parse CSV data', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            Records: [
                {
                    s3: {
                        bucket: {
                            name: 'my-store-app-import-vks',
                        },
                        object: {
                            key: 'data.csv',
                        },
                    },
                },
            ],
        };
        const result = yield (0, importFileParser_1.importFileParser)(event);
        expect(result).toEqual('CSV processing started.');
    }));
});

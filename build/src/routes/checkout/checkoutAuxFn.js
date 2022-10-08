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
exports.getAllDonations = void 0;
const models_1 = __importDefault(require("../../../models"));
// ---------- FUNCIONES AUXILIARES PARA LAS RUTAS: ------------
const getAllDonations = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("en function getAllDonations");
    try {
        const allDonations = yield models_1.default.Donation.findAll();
        return allDonations;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
exports.getAllDonations = getAllDonations;

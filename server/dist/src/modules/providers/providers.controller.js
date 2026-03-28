"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const providers_service_1 = require("./providers.service");
let ProvidersController = class ProvidersController {
    constructor(providersService) {
        this.providersService = providersService;
    }
    async findNearby(latitude, longitude, radius) {
        return this.providersService.findNearby(parseFloat(latitude), parseFloat(longitude), radius ? parseFloat(radius) : 10);
    }
    async findByCategory(categoryId, latitude, longitude) {
        return this.providersService.findByCategory(categoryId, latitude ? parseFloat(latitude) : undefined, longitude ? parseFloat(longitude) : undefined);
    }
    async create(body) {
        return this.providersService.create(body.userId, body);
    }
    async updateStatus(id, body) {
        return this.providersService.updateStatus(id, body.status);
    }
    async updateLocation(id, body) {
        return this.providersService.updateLocation(id, body.latitude, body.longitude);
    }
    async getEarnings(id) {
        return this.providersService.getEarnings(id);
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby providers' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get providers by category' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)('latitude')),
    __param(2, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create provider profile' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider location' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Get)(':id/earnings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get provider earnings' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getEarnings", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, swagger_1.ApiTags)('providers'),
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map
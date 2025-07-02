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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
let UserSession = class UserSession {
    id;
    user_id;
    session_token;
    refresh_token;
    ip_address;
    user_agent;
    device_info;
    created_at;
    last_activity_at;
    expires_at;
    is_active;
    revoked_at;
    revoked_by_id;
    user;
    revoked_by;
    get is_expired() {
        return this.expires_at < new Date();
    }
    get is_valid() {
        return this.is_active && !this.is_expired && !this.revoked_at;
    }
};
exports.UserSession = UserSession;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSession.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session token' }),
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], UserSession.prototype, "session_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refresh token', required: false }),
    (0, typeorm_1.Column)({ unique: true, nullable: true, length: 255 }),
    __metadata("design:type", String)
], UserSession.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client IP address', required: false }),
    (0, typeorm_1.Column)({ type: 'inet', nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "ip_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User agent', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], UserSession.prototype, "user_agent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device information', required: false }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], UserSession.prototype, "device_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session creation time' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserSession.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last activity time' }),
    (0, typeorm_1.Column)({ default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserSession.prototype, "last_activity_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session expiration time' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserSession.prototype, "expires_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether session is active' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserSession.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session revocation time', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserSession.prototype, "revoked_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "revoked_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.sessions),
    __metadata("design:type", user_entity_1.User)
], UserSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], UserSession.prototype, "revoked_by", void 0);
exports.UserSession = UserSession = __decorate([
    (0, typeorm_1.Entity)('user_sessions'),
    (0, typeorm_1.Index)(['session_token']),
    (0, typeorm_1.Index)(['refresh_token'])
], UserSession);
//# sourceMappingURL=user-session.entity.js.map
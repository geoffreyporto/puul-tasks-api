"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannel = exports.NotificationStatus = exports.NotificationType = exports.TaskPriority = exports.TaskStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["MEMBER"] = "member";
    UserRole["CLIENT"] = "client";
})(UserRole || (exports.UserRole = UserRole = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["ACTIVE"] = "active";
    TaskStatus["PENDING"] = "pending";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["ARCHIVED"] = "archived";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["REMINDER_3_DAYS"] = "REMINDER_3_DAYS";
    NotificationType["REMINDER_1_DAY"] = "REMINDER_1_DAY";
    NotificationType["DUE_TODAY"] = "DUE_TODAY";
    NotificationType["OVERDUE"] = "OVERDUE";
    NotificationType["ESCALATION"] = "ESCALATION";
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["TASK_COMPLETED"] = "TASK_COMPLETED";
    NotificationType["TASK_UPDATED"] = "TASK_UPDATED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["CANCELLED"] = "cancelled";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["SLACK"] = "slack";
    NotificationChannel["TEAMS"] = "teams";
    NotificationChannel["WHATSAPP"] = "whatsapp";
    NotificationChannel["TELEGRAM"] = "telegram";
    NotificationChannel["DISCORD"] = "discord";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
//# sourceMappingURL=index.js.map
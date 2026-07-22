import { mockRequest, paginate } from "@/lib/mock/client";
import { adminStats, adminUsers, auditLogs, courses } from "@/mocks/db";
import type {
  AdminStats,
  AdminUserRow,
  AuditLog,
  Course,
  Paginated,
} from "@/types";

export const adminService = {
  async stats(): Promise<AdminStats> {
    return mockRequest(adminStats);
  },
  async users(params?: {
    page?: number;
    pageSize?: number;
    query?: string;
    role?: string;
  }): Promise<Paginated<AdminUserRow>> {
    const { page = 1, pageSize = 8, query, role } = params ?? {};
    let rows = adminUsers;
    if (query)
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      );
    if (role && role !== "all") rows = rows.filter((u) => u.role === role);
    return mockRequest(() => paginate(rows, page, pageSize));
  },
  async courses(): Promise<Course[]> {
    return mockRequest(courses);
  },
  async auditLogs(page = 1): Promise<Paginated<AuditLog>> {
    return mockRequest(() => paginate(auditLogs, page, 10));
  },
};

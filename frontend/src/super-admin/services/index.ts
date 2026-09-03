import {
  mockClients,
  mockPlans,
  mockTickets,
  mockStaff,
  mockAuditLogs,
  mockFeatureFlags,
  mockServiceHealth,
  clientGrowthChartData,
} from "../mock";
import {
  Client,
  PlanTier,
  AdminTicket,
  StaffMember,
  AuditLogEntry,
  FeatureFlag,
  ServiceHealth,
  AdminTicketStatus,
  TicketPriority,
} from "../types";

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    return [...mockClients];
  },
  getById: async (id: string): Promise<Client | undefined> => {
    return mockClients.find((c) => c.id === id);
  },
  create: async (newClient: Omit<Client, "id" | "mrr" | "totalUsers" | "lastActive">): Promise<Client> => {
    const created: Client = {
      ...newClient,
      id: `cl-${Date.now()}`,
      mrr: newClient.plan === "Enterprise" ? 4500 : newClient.plan === "Pro" ? 1200 : newClient.plan === "Growth" ? 99 : 29,
      totalUsers: 1,
      lastActive: "Just now",
    };
    mockClients.unshift(created);
    return created;
  },
  updateStatus: async (id: string, status: Client["status"]): Promise<Client | undefined> => {
    const client = mockClients.find((c) => c.id === id);
    if (client) {
      client.status = status;
    }
    return client;
  },
  update: async (id: string, updatedData: Partial<Client>): Promise<Client | undefined> => {
    const client = mockClients.find((c) => c.id === id);
    if (client) {
      Object.assign(client, updatedData);
      if (updatedData.plan) {
        client.mrr =
          updatedData.plan === "Enterprise"
            ? 4500
            : updatedData.plan === "Pro"
            ? 1200
            : updatedData.plan === "Growth"
            ? 99
            : 29;
      }
    }
    return client;
  },
  delete: async (id: string): Promise<boolean> => {
    const index = mockClients.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockClients.splice(index, 1);
      return true;
    }
    return false;
  },
};

export const billingService = {
  getPlans: async (): Promise<PlanTier[]> => {
    return [...mockPlans];
  },
  savePlan: async (plan: PlanTier): Promise<PlanTier> => {
    const index = mockPlans.findIndex((p) => p.id === plan.id);
    if (index !== -1) {
      mockPlans[index] = plan;
    } else {
      mockPlans.push(plan);
    }
    return plan;
  },
};

export const supportService = {
  getAllTickets: async (): Promise<AdminTicket[]> => {
    return [...mockTickets];
  },
  getTicketById: async (id: string): Promise<AdminTicket | undefined> => {
    return mockTickets.find((t) => t.id === id);
  },
  updateTicketStatus: async (id: string, status: AdminTicketStatus): Promise<AdminTicket | undefined> => {
    const ticket = mockTickets.find((t) => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = "Just now";
    }
    return ticket;
  },
  updateTicketPriority: async (id: string, priority: TicketPriority): Promise<AdminTicket | undefined> => {
    const ticket = mockTickets.find((t) => t.id === id);
    if (ticket) {
      ticket.priority = priority;
      ticket.updatedAt = "Just now";
    }
    return ticket;
  },
  addReply: async (
    ticketId: string,
    message: string,
    isInternalNote = false,
    author = "Super Admin"
  ): Promise<AdminTicket | undefined> => {
    const ticket = mockTickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({
        id: `m-${Date.now()}`,
        sender: "support",
        senderName: author,
        senderRole: isInternalNote ? "Internal Staff Note" : "Super Admin",
        avatarUrl: "https://i.pravatar.cc/56?img=47",
        message,
        timestamp: "Just now",
        isInternalNote,
      });
      ticket.updatedAt = "Just now";
      if (!isInternalNote && ticket.status === "Waiting for Customer") {
        ticket.status = "In Progress";
      }
    }
    return ticket;
  },
};

export const staffService = {
  getAll: async (): Promise<StaffMember[]> => {
    return [...mockStaff];
  },
  create: async (newStaff: Omit<StaffMember, "id" | "lastActive" | "createdAt">): Promise<StaffMember> => {
    const created: StaffMember = {
      ...newStaff,
      id: `st-${Date.now()}`,
      lastActive: "Just now",
      createdAt: "Today",
    };
    mockStaff.unshift(created);
    return created;
  },
};

export const auditService = {
  getAll: async (): Promise<AuditLogEntry[]> => {
    return [...mockAuditLogs];
  },
};

export const featureFlagService = {
  getAll: async (): Promise<FeatureFlag[]> => {
    return [...mockFeatureFlags];
  },
  toggle: async (id: string): Promise<FeatureFlag | undefined> => {
    const flag = mockFeatureFlags.find((f) => f.id === id);
    if (flag) {
      flag.isEnabled = !flag.isEnabled;
      flag.lastUpdated = "Just now";
      flag.updatedBy = "Super Admin";
    }
    return flag;
  },
  save: async (flag: FeatureFlag): Promise<FeatureFlag> => {
    const index = mockFeatureFlags.findIndex((f) => f.id === flag.id);
    if (index !== -1) {
      mockFeatureFlags[index] = flag;
    } else {
      mockFeatureFlags.unshift(flag);
    }
    return flag;
  },
};

export const systemHealthService = {
  getHealth: async (): Promise<ServiceHealth[]> => {
    return [...mockServiceHealth];
  },
};

export const analyticsService = {
  getGrowthChartData: async () => {
    return [...clientGrowthChartData];
  },
};

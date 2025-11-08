import { supabase } from "@/lib/supabase";

export interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: "incident" | "hazard" | "maintenance" | "other";
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
}

export const reportsService = {
  /**
   * Fetch paginated reports for the current user
   */
  async getReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Get total count
      const { count, error: countError } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) throw countError;

      // Get paginated data
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        reports: data || [],
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  /**
   * Create a new report
   */
  async createReport(
    reportData: Omit<Report, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Report> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("reports")
        .insert([{ ...reportData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  },

  /**
   * Update a report
   */
  async updateReport(
    reportId: string,
    updates: Partial<Omit<Report, "id" | "user_id" | "created_at">>
  ): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", reportId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error updating report:", error);
      throw error;
    }
  },

  /**
   * Delete a report
   */
  async deleteReport(reportId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  },

  /**
   * Get a single report by ID
   */
  async getReportById(reportId: string): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  },
};

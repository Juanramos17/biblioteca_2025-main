import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../lib/axios";

export interface Zone {
  id: string;
  name: number;
  category: string;
  n_bookshelves: number;
  count: number;
  floor_name: string;
  created_at: string;
}

// Interface representing the actual API response structure
export interface ApiPaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Interface representing the expected format for the Table component
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface UseZonesParams {
  search?: string[];
  page?: number;
  perPage?: number;
}

export function useZones({ search, page = 1, perPage = 10 }: UseZonesParams = {}) {
  return useQuery({
    queryKey: ["zones", { search, page, perPage }],
    queryFn: async () => {
      const { data: apiResponse } = await axios.get<ApiPaginatedResponse<Zone>>("/api/zones", {
        params: {
          search,
          page,
          per_page: perPage,
        },
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Transform the API response to the expected format
      return {
        data: apiResponse.data,
        meta: {
          current_page: apiResponse.current_page,
          from: apiResponse.from,
          last_page: apiResponse.last_page,
          per_page: apiResponse.per_page,
          to: apiResponse.to,
          total: apiResponse.total
        }
      } as PaginatedResponse<Zone>;
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await axios.post("/api/users", data, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      return response.data;
    },
  });
}

export function useUpdateUser(userId: string) {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password?: string }) => {
      const response = await axios.put(`/api/users/${userId}`, data, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      return response.data;
    },
  });
}

export function useDeleteZone() {
  return useMutation({
    mutationFn: async (zoneId: string) => {
      await axios.delete(`/api/zones/${zoneId}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    },
  });
}

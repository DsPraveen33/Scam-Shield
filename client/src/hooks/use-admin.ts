import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBlacklist, type InsertKeyword } from "@shared/routes";

// --- Blacklist Hooks ---

export function useBlacklist() {
  return useQuery({
    queryKey: [api.blacklist.list.path],
    queryFn: async () => {
      const res = await fetch(api.blacklist.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch blacklist");
      return api.blacklist.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBlacklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBlacklist) => {
      const res = await fetch(api.blacklist.create.path, {
        method: api.blacklist.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to add to blacklist");
      return api.blacklist.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blacklist.list.path] });
    },
  });
}

export function useDeleteBlacklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.blacklist.delete.path, { id });
      const res = await fetch(url, { method: api.blacklist.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete from blacklist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blacklist.list.path] });
    },
  });
}

// --- Keywords Hooks ---

export function useKeywords() {
  return useQuery({
    queryKey: [api.keywords.list.path],
    queryFn: async () => {
      const res = await fetch(api.keywords.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch keywords");
      return api.keywords.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateKeyword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertKeyword) => {
      const res = await fetch(api.keywords.create.path, {
        method: api.keywords.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to add keyword");
      return api.keywords.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.keywords.list.path] });
    },
  });
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.keywords.delete.path, { id });
      const res = await fetch(url, { method: api.keywords.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete keyword");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.keywords.list.path] });
    },
  });
}

"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  projects as initialProjects,
  services as initialServices,
} from "./mock-data";
import type { ChurchService, Project } from "./types";

export interface UserProfile {
  name: string;
  email: string; // read-only, tied to auth provider
  location: string;
  address: string;
  phone: string;
  birthday: string;
}

interface DashboardState {
  services: ChurchService[];
  projects: Project[];
  profile: UserProfile;

  addService: (service: Omit<ChurchService, "id">) => void;
  updateService: (id: string, patch: Partial<ChurchService>) => void;
  removeService: (id: string) => void;

  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  updateProfile: (patch: Partial<Omit<UserProfile, "email">>) => void;

  resetDemoData: () => void;
}

const defaultProfile: UserProfile = {
  name: "Demo User",
  email: "member@example.org",
  location: "Kudenda, Kaduna",
  address: "",
  phone: "",
  birthday: "",
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      services: initialServices,
      projects: initialProjects,
      profile: defaultProfile,

      addService: (service) =>
        set((state) => ({
          services: [...state.services, { ...service, id: `s_${Date.now()}` }],
        })),

      updateService: (id, patch) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        })),

      removeService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: `p_${Date.now()}` }],
        })),

      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      updateProfile: (patch) =>
        set((state) => ({
          profile: { ...state.profile, ...patch },
        })),

      resetDemoData: () =>
        set({
          services: initialServices,
          projects: initialProjects,
          profile: defaultProfile,
        }),
    }),
    {
      name: "tbc-dashboard-demo",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

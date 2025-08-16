import { ProjectFields } from "@/constants";
import { create } from "zustand";

type ProjectKeys = keyof typeof ProjectFields;

export type ProjectKeysFields = { [key in ProjectKeys]: string };

type ProjectsStore = {
	project: ProjectKeysFields | undefined;
	updateProjects: (p: ProjectKeysFields) => void;
};

export const useProjectStore = create<ProjectsStore>(set => ({
	project: undefined,
	updateProjects: project =>
		set(() => ({
			project: project,
		})),
}));

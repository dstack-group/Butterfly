export enum Service {
  GITLAB = 'GITLAB',
  REDMINE = 'REDMINE',
  SONARQUBE = 'SONARQUBE',
}

export interface FindProject {
  projectName: string;
}

export interface CreateProject extends FindProject {
  projectURL: {[key in Service]?: string};
}

export type UpdateProject = CreateProject;

export interface RemoveProject extends FindProject {
  service?: Service;
}

export interface Project extends CreateProject {
  projectId: number;
  created: Date;
  modified: Date;
}

export enum Service {
  GITLAB = 'GITLAB',
  REDMINE = 'REDMINE',
  SONARQUBE = 'SONARQUBE',
}

export interface CreateProject {
  name: string;
  urls: {[key in Service]?: string};
}

export type UpdateProject = CreateProject;

export interface FindProject {
  name: string;
}

export interface RemoveProject extends FindProject {
  service?: Service;
}

export interface Project {
  projectId: number;
  projectName: string;
  projectURL: {[key in Service]?: string};
  created: Date;
  modified: Date;
}

import { ThirdPartyProducerService } from '../../common/ThirdPartyProducerService';

// tslint:disable-next-line: interface-over-type-literal
export type ProjectURL = {
  [key in keyof typeof ThirdPartyProducerService]?: string;
};

export interface ProjectName {
  projectName: string;
}

export interface CreateProject extends ProjectName {
  projectURL: ProjectURL;
}

export interface Project extends CreateProject {
  projectId: string;
}

export interface RemoveServiceFromProject {
  producerService: ThirdPartyProducerService;
  projectName: string;
}

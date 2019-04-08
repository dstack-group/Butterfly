import { ThirdPartyProducerService } from '../../common/ThirdPartyProducerService';

// tslint:disable-next-line: interface-over-type-literal
export type ProjectURL = {
  [key in keyof typeof ThirdPartyProducerService]?: string;
};

export interface Project {
  projectId?: string;
  projectName: string;
  projectURL?: ProjectURL;
}

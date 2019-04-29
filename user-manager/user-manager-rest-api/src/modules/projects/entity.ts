/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  entity.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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

export interface UpdateProjectBody {
  projectURL: ProjectURL;
}

export interface UpdateProject extends ProjectName, UpdateProjectBody {
  // tslint:disable-next-line: no-trailing-whitespace
}

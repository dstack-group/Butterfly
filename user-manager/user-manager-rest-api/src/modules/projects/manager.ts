/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  manager.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Project, ProjectName, RemoveServiceFromProject } from './entity';
import { ProjectRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';
import { NotFoundError } from '../../errors';

export class ProjectManager extends AbstractCRUDManager<any, ProjectRepository> {

  constructor(repository: ProjectRepository) {
    super(repository);
  }

  async removeServiceURL(params: RemoveServiceFromProject): Promise<Project> {
    const result = await this.repository.removeServiceURL(params);
    if (result.length === 0) {
      throw new NotFoundError('Project entity not found');
    } else {
      return result[0];
    }
  }
}

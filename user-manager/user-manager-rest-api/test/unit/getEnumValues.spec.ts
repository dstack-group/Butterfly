import { ServiceEventType } from '../../src/common/Event';
import { UserPriority } from '../../src/common/UserPriority';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';
import { ThirdPartyProducerService } from '../../src/common/ThirdPartyProducerService';
import { getEnumValues } from '../../src/utils/getEnumValues';

describe(`getEnumValues should return an array of enum values`, () => {
  it(`getEnumValues should return the values of ServiceEventType`, () => {
    expect(getEnumValues(ServiceEventType)).toEqual([
      ServiceEventType.REDMINE_TICKET_CREATED,
      ServiceEventType.REDMINE_TICKET_EDITED,
      ServiceEventType.GITLAB_COMMIT_CREATED,
      ServiceEventType.GITLAB_ISSUE_CREATED,
      ServiceEventType.GITLAB_ISSUE_EDITED,
      ServiceEventType.GITLAB_MERGE_REQUEST_CREATED,
      ServiceEventType.GITLAB_MERGE_REQUEST_EDITED,
      ServiceEventType.GITLAB_MERGE_REQUEST_MERGED,
      ServiceEventType.GITLAB_MERGE_REQUEST_CLOSED,
      ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED,
    ]);
  });

  it(`getEnumValues should return the values of UserPriority`, () => {
    expect(getEnumValues(UserPriority)).toEqual([
      UserPriority.LOW,
      UserPriority.MEDIUM,
      UserPriority.HIGH,
    ]);
  });

  it(`getEnumValues should return the values of ThirdPartyContactService`, () => {
    expect(getEnumValues(ThirdPartyContactService)).toEqual([
      ThirdPartyContactService.TELEGRAM,
      ThirdPartyContactService.SLACK,
      ThirdPartyContactService.EMAIL,
    ]);
  });

  it(`getEnumValues should return the values of ThirdPartyProducerService`, () => {
    expect(getEnumValues(ThirdPartyProducerService)).toEqual([
      ThirdPartyProducerService.REDMINE,
      ThirdPartyProducerService.GITLAB,
      ThirdPartyProducerService.SONARQUBE,
    ]);
  });
});

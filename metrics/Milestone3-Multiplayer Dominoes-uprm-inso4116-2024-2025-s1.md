# Milestone Data

## Date Generated: 2024-12-20
| Developer | Points Closed | Percent Contribution | Projected Grade | Lecture Topic Tasks |
| --------- | ------------- | -------------------- | --------------- | ------------------- |
| Total | 0 | /100% | /100% | 0 |


## Sprint Task Completion

| Developer | S1 (2024/12/19-2024/12/19) | S2 (2024/12/19-2024/12/19) |
|---|---|---|
# Metrics Generation Logs

| Message |
| ------- |
| WARNING: 'NoneType' object is not subscriptable |
| INFO: Found Project(name='Multiplayer Dominoes', number=2, url='https://github.com/orgs/uprm-inso4116-2024-2025-s1/projects/2', public=False) |
| WARNING: Project visibility is set to private. This can lead to issues not being found if the Personal Access Token doesn't have permissions for viewing private projects. |
| WARNING: [Issue #148](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-multiplayer-dominoes/issues/148) does not have the Urgency and/or Difficulty fields populated |
| WARNING: [Issue #161](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-multiplayer-dominoes/issues/161) was closed by non-manager fernandopizarro1. Only issues closed by managers are accredited. Managers for this project are: ['Keiven-Soto', 'AngelCIICMorales'] |
| WARNING: [Issue #140](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-multiplayer-dominoes/issues/140) was closed by non-manager frances-sepulveda. Only issues closed by managers are accredited. Managers for this project are: ['Keiven-Soto', 'AngelCIICMorales'] |
| WARNING: [Issue #115](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-trolley-tracker-app/issues/115) is not associated with a milestone. |
| WARNING: [Issue #279](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-multiplayer-dominoes/issues/279) was closed by non-manager fernandopizarro1. Only issues closed by managers are accredited. Managers for this project are: ['Keiven-Soto', 'AngelCIICMorales'] |
| WARNING: [Issue #301](https://github.com/uprm-inso4116-2024-2025-s1/semester-project-multiplayer-dominoes/issues/301) is not associated with a milestone. |
| ERROR: Query failed to run, status code 403 |
| { |
|   "documentation_url": "https://docs.github.com/free-pro-team@latest/rest/overview/rate-limits-for-the-rest-api#about-secondary-rate-limits", |
|   "message": "You have exceeded a secondary rate limit. Please wait a few minutes before you try again. If you reach out to GitHub Support for help, please include the request ID 1040:1E3788:1208CDE:23E2895:6764B9B0." |
| } |
| Traceback (most recent call last): |
|   File "/home/runner/work/semester-project-multiplayer-dominoes/semester-project-multiplayer-dominoes/inso-gh-query-metrics/src/generateMilestoneMetricsForActions.py", line 65, in generateMetricsFromV2Config |
|     team_metrics = getTeamMetricsForMilestone( |
|                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-multiplayer-dominoes/semester-project-multiplayer-dominoes/inso-gh-query-metrics/src/generateTeamMetrics.py", line 238, in getTeamMetricsForMilestone |
|     for issue_dict in fetchIssuesFromGithub(org=org, team=team, logger=logger): |
|   File "/home/runner/work/semester-project-multiplayer-dominoes/semester-project-multiplayer-dominoes/inso-gh-query-metrics/src/generateTeamMetrics.py", line 170, in fetchIssuesFromGithub |
|     response: dict = runGraphqlQuery(query=get_team_issues, variables=params) |
|                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-multiplayer-dominoes/semester-project-multiplayer-dominoes/inso-gh-query-metrics/src/utils/queryRunner.py", line 62, in runGraphqlQuery |
|     raise ConnectionError( |
| ConnectionError: Query failed to run, status code 403 |
| { |
|   "documentation_url": "https://docs.github.com/free-pro-team@latest/rest/overview/rate-limits-for-the-rest-api#about-secondary-rate-limits", |
|   "message": "You have exceeded a secondary rate limit. Please wait a few minutes before you try again. If you reach out to GitHub Support for help, please include the request ID 1040:1E3788:1208CDE:23E2895:6764B9B0." |
| } |

import { reportedCategoriesMock, weeklyReportLoadMock } from '../data/moderationInsights.mock'

export function useModerationInsights() {
  return {
    weeklyReportLoad: weeklyReportLoadMock,
    reportedCategories: reportedCategoriesMock,
  }
}

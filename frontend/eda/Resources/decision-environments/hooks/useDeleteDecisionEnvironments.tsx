import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { compareStrings, useBulkConfirmation } from '../../../../../framework';
import { requestDelete } from '../../../../common/crud/Data';
import { idKeyFn } from '../../../../hub/useHubView';
import { API_PREFIX } from '../../../constants';
import { EdaDecisionEnvironment } from '../../../interfaces/EdaDecisionEnvironment';
import { useDecisionEnvironmentColumns } from './useDecisionEnvironmentColumns';

export function useDeleteDecisionEnvironments(
  onComplete: (decisionEnvironments: EdaDecisionEnvironment[]) => void
) {
  const { t } = useTranslation();
  const confirmationColumns = useDecisionEnvironmentColumns();
  const actionColumns = useMemo(() => [confirmationColumns[0]], [confirmationColumns]);
  const bulkAction = useBulkConfirmation<EdaDecisionEnvironment>();
  return useCallback(
    (decisionEnvironments: EdaDecisionEnvironment[]) => {
      bulkAction({
        title: t('Permanently delete decision environments', {
          count: decisionEnvironments.length,
        }),
        confirmText: t(
          'Yes, I confirm that I want to delete these {{count}} decisionEnvironments.',
          {
            count: decisionEnvironments.length,
          }
        ),
        actionButtonText: t('Delete decision environments', { count: decisionEnvironments.length }),
        items: decisionEnvironments.sort((l, r) => compareStrings(l.name, r.name)),
        keyFn: idKeyFn,
        isDanger: true,
        confirmationColumns,
        actionColumns,
        onComplete,
        actionFn: (decisionEnvironment: EdaDecisionEnvironment) =>
          requestDelete(`${API_PREFIX}/decision-environments/${decisionEnvironment.id}/`),
      });
    },
    [actionColumns, bulkAction, confirmationColumns, onComplete, t]
  );
}

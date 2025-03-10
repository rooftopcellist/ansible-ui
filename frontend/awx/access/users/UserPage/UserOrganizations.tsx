/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonVariant } from '@patternfly/react-core';
import { MinusCircleIcon, PlusIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IPageAction,
  PageActionSelection,
  PageActionType,
  PageTable,
} from '../../../../../framework';
import { DetailInfo } from '../../../../../framework/components/DetailInfo';
import { Organization } from '../../../interfaces/Organization';
import { User } from '../../../interfaces/User';
import { useAwxView } from '../../../useAwxView';
import {
  useOrganizationsColumns,
  useOrganizationsFilters,
} from '../../organizations/Organizations';
import { useRemoveOrganizationsFromUsers } from '../../organizations/hooks/useRemoveOrganizationsFromUsers';
import { useSelectOrganizationsAddUsers } from '../../organizations/hooks/useSelectOrganizationsAddUsers';

export function UserOrganizations(props: { user: User }) {
  const { user } = props;
  const { t } = useTranslation();
  const toolbarFilters = useOrganizationsFilters();
  const tableColumns = useOrganizationsColumns();
  const view = useAwxView<Organization>({
    url: `/api/v2/users/${user.id}/organizations/`,
    toolbarFilters,
    disableQueryString: true,
  });

  const selectOrganizationsAddUsers = useSelectOrganizationsAddUsers(view.selectItemsAndRefresh);
  const removeOrganizationsFromUsers = useRemoveOrganizationsFromUsers();
  const toolbarActions = useMemo<IPageAction<Organization>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.None,
        variant: ButtonVariant.primary,
        isPinned: true,
        icon: PlusIcon,
        label: t('Add user to organizations'),
        onClick: () => selectOrganizationsAddUsers([user]),
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: MinusCircleIcon,
        label: t('Remove user from selected organizations'),
        onClick: () =>
          removeOrganizationsFromUsers([user], view.selectedItems, view.unselectItemsAndRefresh),
        isDanger: true,
      },
    ],
    [
      removeOrganizationsFromUsers,
      selectOrganizationsAddUsers,
      t,
      user,
      view.selectedItems,
      view.unselectItemsAndRefresh,
    ]
  );
  const rowActions = useMemo<IPageAction<Organization>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: MinusCircleIcon,
        label: t('Remove user from organization'),
        onClick: (organization) =>
          removeOrganizationsFromUsers([user], [organization], view.unselectItemsAndRefresh),
        isDanger: true,
      },
    ],
    [removeOrganizationsFromUsers, t, user, view.unselectItemsAndRefresh]
  );
  return (
    <>
      <DetailInfo
        title={t(
          'Adding a user to an organization adds them as a member only. Permissions can be granted using teams and user roles.'
        )}
      />
      <PageTable<Organization>
        toolbarFilters={toolbarFilters}
        tableColumns={tableColumns}
        toolbarActions={toolbarActions}
        rowActions={rowActions}
        errorStateTitle={t('Error loading organizations')}
        emptyStateTitle={t('User is not a member of any organizations.')}
        emptyStateDescription={t('To get started, add the user to an organization.')}
        emptyStateButtonText={t('Add user to organization')}
        emptyStateButtonClick={() => selectOrganizationsAddUsers([user])}
        {...view}
      />
    </>
  );
}

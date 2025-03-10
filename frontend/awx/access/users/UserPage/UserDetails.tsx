/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTranslation } from 'react-i18next';
import { PageDetail, PageDetails, DateTimeCell } from '../../../../../framework';
import { User } from '../../../interfaces/User';
import { AuthenticationType } from '../components/AuthenticationType';
import { UserType } from '../components/UserType';

export function UserDetails(props: { user: User }) {
  const { t } = useTranslation();
  const { user } = props;

  return (
    <>
      <PageDetails>
        <PageDetail label={t('Username')}>{user.username}</PageDetail>
        <PageDetail label={t('First name')}>{user.first_name}</PageDetail>
        <PageDetail label={t('Last name')}>{user.last_name}</PageDetail>
        <PageDetail label={t('Email')}>{user.email}</PageDetail>
        <PageDetail label={t('User type')}>
          <UserType user={user} />
        </PageDetail>
        <PageDetail label={t('Authentication type')}>
          <AuthenticationType user={user} />
        </PageDetail>
        <PageDetail label={t('Created')}>
          <DateTimeCell format="since" value={user.created} />
        </PageDetail>
        <PageDetail label={t('Modified')}>
          <DateTimeCell format="since" value={user.modified} />
        </PageDetail>
        <PageDetail label={t('Last login')}>
          <DateTimeCell format="since" value={user.last_login} />
        </PageDetail>
      </PageDetails>
    </>
  );
}

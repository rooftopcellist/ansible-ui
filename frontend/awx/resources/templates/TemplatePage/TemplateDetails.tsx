import {
  Label,
  LabelGroup,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PageDetail, PageDetails } from '../../../../../framework';
import { RouteObj } from '../../../../Routes';
import { useGet } from '../../../../common/crud/useGet';
import { CredentialLabel } from '../../../common/CredentialLabel';
import { UserDateDetail } from '../../../common/UserDateDetail';
import { useVerbosityString } from '../../../common/useVerbosityString';
import { InstanceGroup } from '../../../interfaces/InstanceGroup';
import { JobTemplate } from '../../../interfaces/JobTemplate';

function useInstanceGroups(templateId: string) {
  const { data } = useGet<{ results: InstanceGroup[] }>(
    `/api/v2/job_templates/${templateId}/instance_groups/`
  );
  return data?.results ?? [];
}

export function TemplateDetails(props: { template: JobTemplate }) {
  const { t } = useTranslation();
  const { template } = props;
  const params = useParams<{ id: string }>();
  const { summary_fields: summaryFields } = template;

  const instanceGroups = useInstanceGroups(params.id || '0');

  const showOptionsField =
    template.become_enabled ||
    template.host_config_key ||
    template.allow_simultaneous ||
    template.use_fact_cache ||
    template.webhook_service ||
    template.prevent_instance_group_fallback;

  const inventoryUrlPaths: { [key: string]: string } = {
    '': 'inventory',
    smart: 'smart_inventory',
    constructed: 'constructed_inventory',
  };

  return (
    <PageDetails>
      <PageDetail label={t('Name')}>{template.name}</PageDetail>
      <PageDetail label={t('Description')}>{template.description}</PageDetail>
      <PageDetail label={t('Job type')}>{template.job_type}</PageDetail>
      <PageDetail label={t('Organization')} isEmpty={!summaryFields.organization}>
        <Link
          to={RouteObj.OrganizationDetails.replace(
            ':id',
            summaryFields.organization?.id.toString() ?? ''
          )}
        >
          {summaryFields.organization?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t('Inventory')} isEmpty={!summaryFields.inventory}>
        <Link
          to={RouteObj.InventoryDetails.replace(
            ':inventory_type',
            inventoryUrlPaths[summaryFields.inventory.kind]
          ).replace(':id', summaryFields.inventory?.id.toString() ?? '')}
        >
          {summaryFields.inventory?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t`Project`} isEmpty={!summaryFields.project}>
        <Link
          to={RouteObj.ProjectDetails.replace(':id', summaryFields.project?.id.toString() ?? '')}
        >
          {summaryFields.project?.name}
        </Link>
      </PageDetail>
      {/* TODO: more flushed out ExecutionEnvironmentDetail ? */}
      <PageDetail label={t`Execution environment`} isEmpty={!summaryFields.resolved_environment}>
        <Link
          to={RouteObj.ExecutionEnvironmentDetails.replace(
            ':id',
            summaryFields.resolved_environment?.id.toString() ?? ''
          )}
        >
          {summaryFields.resolved_environment?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t('Source control branch')}>{template.scm_branch}</PageDetail>
      <PageDetail label={t('Playbook')}>{template.playbook}</PageDetail>
      <PageDetail label={t('Credentials')} isEmpty={!summaryFields.credentials.length}>
        <LabelGroup>
          {summaryFields.credentials.map((credential) => (
            <CredentialLabel credential={credential} key={credential.id} />
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail
        label={t`Instance groups`}
        helpText={t`The instance groups for this job template to run on.`}
        isEmpty={instanceGroups.length === 0}
      >
        <LabelGroup>
          {instanceGroups.map((ig) => (
            <Label color="blue" key={ig.id}>
              <Link to={RouteObj.InstanceGroupDetails.replace(':id', (ig.id ?? 0).toString())}>
                {ig.name}
              </Link>
            </Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Forks')}>{template.forks || 0}</PageDetail>
      <PageDetail label={t('Limit')}>{template.limit}</PageDetail>
      <PageDetail label={t('Verbosity')}>{useVerbosityString(template.verbosity)}</PageDetail>
      <PageDetail label={t('Timeout')}>{template.timeout || 0}</PageDetail>
      <PageDetail label={t('Show changes')}>{template.diff_mode ? t`On` : t`Off`}</PageDetail>
      <PageDetail label={t('Job slicing')}>{template.job_slice_count}</PageDetail>
      <PageDetail label={t('Host config key')}>{template.host_config_key}</PageDetail>
      <PageDetail label={t('Provisioning callback URL')} isEmpty={!template.host_config_key}>
        {`${window.location.origin} ${template.url}callback/`}
      </PageDetail>
      <PageDetail label={t('Webhook service')} isEmpty={!template.webhook_service}>
        {template.webhook_service === 'github' ? t('GitHub') : t('GitLab')}
      </PageDetail>
      <PageDetail label={t('Webhook credential')} isEmpty={!summaryFields.webhook_credential}>
        <Link
          to={RouteObj.CredentialDetails.replace(
            ':id',
            summaryFields.webhook_credential?.id?.toString() as string
          )}
        >
          {summaryFields.webhook_credential?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t('Prevent instance group fallback')}>
        {template.prevent_instance_group_fallback ? t`On` : ''}
      </PageDetail>
      <UserDateDetail
        label={t('Created')}
        date={template.created}
        user={template.summary_fields.created_by}
      />
      <UserDateDetail
        label={t('Last modified')}
        date={template.modified}
        user={template.summary_fields.modified_by}
      />
      <PageDetail label={t('Enabled options')} isEmpty={!showOptionsField}>
        <TextList component={TextListVariants.ul}>
          {template.become_enabled && (
            <TextListItem component={TextListItemVariants.li}>
              {t`Privilege Escalation`}
            </TextListItem>
          )}
          {template.host_config_key && (
            <TextListItem component={TextListItemVariants.li}>
              {t`Provisioning Callbacks`}
            </TextListItem>
          )}
          {template.allow_simultaneous && (
            <TextListItem component={TextListItemVariants.li}>{t`Concurrent jobs`}</TextListItem>
          )}
          {template.use_fact_cache && (
            <TextListItem component={TextListItemVariants.li}>{t`Fact storage`}</TextListItem>
          )}
          {template.webhook_service && (
            <TextListItem component={TextListItemVariants.li}>{t`Webhooks`}</TextListItem>
          )}
          {template.prevent_instance_group_fallback && (
            <TextListItem component={TextListItemVariants.li}>
              {t`Prevent instance group fallback`}
            </TextListItem>
          )}
        </TextList>
      </PageDetail>
      <PageDetail label={t('Labels')} isEmpty={!summaryFields.labels?.results?.length}>
        <LabelGroup>
          {summaryFields.labels.results.map((label) => (
            <Label key={label.id}>{label.name}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Job tags')} isEmpty={!template.job_tags}>
        <LabelGroup>
          {template.job_tags.split(',').map((tag) => (
            <Label key={tag}>{tag}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Skip tags')} isEmpty={!template.skip_tags}>
        <LabelGroup>
          {template.skip_tags.split(',').map((tag) => (
            <Label key={tag}>{tag}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
    </PageDetails>
  );
}

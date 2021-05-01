/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, LinearProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import type { IWikiWorkspaceFormProps } from './useForm';
import { useValidateCloneWiki, useCloneWiki } from './useCloneWiki';
import { useWikiCreationProgress } from './useIndicator';
import { WikiLocation, CloseButton } from './FormComponents';

export function CloneWikiDoneButton({ form, isCreateMainWorkspace }: IWikiWorkspaceFormProps & { isCreateMainWorkspace: boolean }): JSX.Element {
  const { t } = useTranslation();
  const [, hasError, wikiCreationMessage, wikiCreationMessageSetter, hasErrorSetter] = useValidateCloneWiki(isCreateMainWorkspace, form);
  const onSubmit = useCloneWiki(isCreateMainWorkspace, form, wikiCreationMessageSetter, hasErrorSetter);
  const [logPanelOpened, logPanelSetter, inProgressOrError] = useWikiCreationProgress(wikiCreationMessageSetter, wikiCreationMessage, hasError);
  if (hasError) {
    return (
      <CloseButton variant="contained" disabled>
        {wikiCreationMessage}
      </CloseButton>
    );
  }
  return (
    <>
      {inProgressOrError && <LinearProgress color="secondary" />}
      <Snackbar open={logPanelOpened} autoHideDuration={5000} onClose={() => logPanelSetter(false)}>
        <Alert severity="info">{wikiCreationMessage}</Alert>
      </Snackbar>

      {isCreateMainWorkspace ? (
        <CloseButton variant="contained" color="secondary" disabled={inProgressOrError} onClick={onSubmit}>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.CloneWiki')}
          </Typography>
          <WikiLocation>{form.wikiFolderLocation}</WikiLocation>
        </CloseButton>
      ) : (
        <CloseButton variant="contained" color="secondary" disabled={inProgressOrError} onClick={onSubmit}>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.CloneWiki')}
          </Typography>
          <WikiLocation>{form.wikiFolderLocation}</WikiLocation>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.AndLinkToMainWorkspace')}
          </Typography>
        </CloseButton>
      )}
    </>
  );
}

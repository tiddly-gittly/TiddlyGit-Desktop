import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Typography, Button, LinearProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import type { IWikiWorkspaceFormProps } from './useForm';
import { useValidateExistedWiki, useExistedWiki } from './useExistedWiki';
import { useWikiCreationProgress } from './useIndicator';

const CloseButton = styled(Button)`
  white-space: nowrap;
  width: 100%;
`;

export function ExistedWikiDoneButton({ form, isCreateMainWorkspace }: IWikiWorkspaceFormProps & { isCreateMainWorkspace: boolean }): JSX.Element {
  const { t } = useTranslation();
  const [wikiCreationMessage, hasError, wikiCreationMessageSetter, hasErrorSetter] = useValidateExistedWiki(isCreateMainWorkspace, form);
  const onSubmit = useExistedWiki(isCreateMainWorkspace, form, wikiCreationMessageSetter, hasErrorSetter);
  const [logPanelOpened, logPanelSetter, progressBarOpen] = useWikiCreationProgress(wikiCreationMessage, hasError);
  return (
    <>
      {progressBarOpen && <LinearProgress color="secondary" />}
      <Snackbar open={logPanelOpened} autoHideDuration={5000} onClose={() => logPanelSetter(false)}>
        <Alert severity="info">{wikiCreationMessage}</Alert>
      </Snackbar>

      {isCreateMainWorkspace ? (
        <CloseButton variant="contained" color="secondary" disabled={hasError} onClick={onSubmit}>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.ImportWiki')}
          </Typography>
          <Typography variant="body2" noWrap display="inline" align="center" style={{ direction: 'rtl', textTransform: 'none' }}>
            {form.existedWikiFolderPath}
          </Typography>
        </CloseButton>
      ) : (
        <CloseButton variant="contained" color="secondary" disabled={hasError} onClick={onSubmit}>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.ImportWiki')}
          </Typography>
          <Typography variant="body2" noWrap display="inline" align="center" style={{ direction: 'rtl', textTransform: 'none' }}>
            {form.existedWikiFolderPath}
          </Typography>
          <Typography variant="body1" display="inline">
            {t('AddWorkspace.AndLinkToMainWorkspace')}
          </Typography>
        </CloseButton>
      )}
    </>
  );
}
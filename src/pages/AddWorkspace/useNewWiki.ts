/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWikiWorkspaceForm, workspaceConfigFromFrom } from './useForm';

export function useValidateNewWiki(
  isCreateMainWorkspace: boolean,
  isCreateSyncedWorkspace: boolean,
  form: IWikiWorkspaceForm,
): [Record<string, boolean>, boolean, string | undefined, (m: string) => void, (m: boolean) => void] {
  const { t } = useTranslation();
  const [wikiCreationMessage, wikiCreationMessageSetter] = useState<string | undefined>();
  const [hasError, hasErrorSetter] = useState<boolean>(false);
  const [errorInWhichComponent, errorInWhichComponentSetter] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!form.parentFolderLocation) {
      wikiCreationMessageSetter(`${t('AddWorkspace.NotFilled')}：${t('AddWorkspace.WorkspaceFolder')}`);
      errorInWhichComponentSetter({ parentFolderLocation: true });
      hasErrorSetter(true);
    } else if (!form.wikiFolderName) {
      wikiCreationMessageSetter(`${t('AddWorkspace.NotFilled')}：${t('AddWorkspace.WorkspaceFolderNameToCreate')}`);
      errorInWhichComponentSetter({ wikiFolderName: true });
      hasErrorSetter(true);
    } else if (isCreateSyncedWorkspace && !form.gitRepoUrl) {
      wikiCreationMessageSetter(`${t('AddWorkspace.NotFilled')}：${t('AddWorkspace.GitRepoUrl')}`);
      errorInWhichComponentSetter({ gitRepoUrl: true });
      hasErrorSetter(true);
    } else if (!isCreateMainWorkspace && !form.mainWikiToLink?.name) {
      wikiCreationMessageSetter(`${t('AddWorkspace.NotFilled')}：${t('AddWorkspace.MainWorkspace')}`);
      errorInWhichComponentSetter({ mainWikiToLink: true });
      hasErrorSetter(true);
    } else if (!isCreateMainWorkspace && !form.tagName) {
      wikiCreationMessageSetter(`${t('AddWorkspace.NotFilled')}：${t('AddWorkspace.TagName')}`);
      errorInWhichComponentSetter({ tagName: true });
      hasErrorSetter(true);
    } else if (isCreateSyncedWorkspace && (form.gitUserInfo === undefined || !(form.gitUserInfo.accessToken?.length > 0))) {
      wikiCreationMessageSetter(t('AddWorkspace.NotLoggedIn'));
      errorInWhichComponentSetter({ gitUserInfo: true });
      hasErrorSetter(true);
    } else {
      wikiCreationMessageSetter('');
      errorInWhichComponentSetter({});
      hasErrorSetter(false);
    }
  }, [
    t,
    isCreateMainWorkspace,
    isCreateSyncedWorkspace,
    form.parentFolderLocation,
    form.wikiFolderName,
    form.gitRepoUrl,
    form.gitUserInfo,
    form.mainWikiToLink?.name,
    form.tagName,
  ]);

  return [errorInWhichComponent, hasError, wikiCreationMessage, wikiCreationMessageSetter, hasErrorSetter];
}

export function useNewWiki(
  isCreateMainWorkspace: boolean,
  isCreateSyncedWorkspace: boolean,
  form: IWikiWorkspaceForm,
  wikiCreationMessageSetter: (m: string) => void,
  hasErrorSetter: (m: boolean) => void,
): () => Promise<void> {
  const { t } = useTranslation();

  const onSubmit = useCallback(async () => {
    if (!form.parentFolderLocation || !form.wikiFolderName) return;
    wikiCreationMessageSetter(t('AddWorkspace.Processing'));
    hasErrorSetter(false);
    try {
      if (isCreateMainWorkspace) {
        await window.service.wiki.copyWikiTemplate(form.parentFolderLocation, form.wikiFolderName);
        if (isCreateSyncedWorkspace) {
          await window.service.wikiGitWorkspace.initWikiGitTransaction(form.wikiFolderLocation, true, true, form.gitRepoUrl, form.gitUserInfo!);
        } else {
          await window.service.wikiGitWorkspace.initWikiGitTransaction(form.wikiFolderLocation, true, false);
        }
      } else {
        await window.service.wiki.createSubWiki(form.parentFolderLocation, form.wikiFolderName, form.mainWikiToLink?.name, form.tagName);
        if (isCreateSyncedWorkspace) {
          await window.service.wikiGitWorkspace.initWikiGitTransaction(
            form.wikiFolderLocation,
            false,
            true,
            form.gitRepoUrl,
            form.gitUserInfo!,
            form.mainWikiToLink?.name,
          );
        } else {
          await window.service.wikiGitWorkspace.initWikiGitTransaction(form.wikiFolderLocation, false, false, form.mainWikiToLink?.name);
        }
      }
      // we are done physical creation! we can create the workspace
      await window.service.workspaceView.createWorkspaceView(workspaceConfigFromFrom(form, isCreateMainWorkspace, isCreateSyncedWorkspace));

      // wait for wiki to start and close the window now.

      await window.remote.closeCurrentWindow();
    } catch (error) {
      wikiCreationMessageSetter((error as Error).message);
      hasErrorSetter(true);
    }
  }, [form, wikiCreationMessageSetter, t, hasErrorSetter, isCreateMainWorkspace, isCreateSyncedWorkspace]);

  return onSubmit;
}

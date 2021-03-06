import { useState, useMemo } from 'react';
import { map } from 'rxjs/operators';
import { useObservable } from 'beautiful-react-hooks';
import { IWorkspace } from './interface';

export function useWorkspacesListObservable(): IWorkspace[] | undefined {
  const [workspaces, workspacesSetter] = useState<IWorkspace[] | undefined>();
  // beware not pipe directly in the react hock, as it will re-pipe every time React reRenders, and every time regarded as new Observable, so it will re-subscribe
  // useMemo will solve this
  const workspacesList$ = useMemo(
    () =>
      window.observables.workspace.workspaces$.pipe(
        map<Record<string, IWorkspace>, IWorkspace[]>((workspaces) => Object.values(workspaces)),
      ),
    [],
  );
  useObservable<IWorkspace[] | undefined>(workspacesList$, workspacesSetter);
  return workspaces;
}

export function useWorkspaceObservable(id: string): IWorkspace | undefined {
  const [workspace, workspaceSetter] = useState<IWorkspace | undefined>();
  const workspace$ = useMemo(() => window.observables.workspace.get$(id), [id]);
  useObservable<IWorkspace | undefined>(workspace$, workspaceSetter);
  return workspace;
}

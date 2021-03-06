import Promise from 'bluebird';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BadgeRaw from '@material-ui/core/Badge';
import styled, { css, keyframes } from 'styled-components';

import defaultIcon from '../../images/default-icon.png';
import { getAssetsFileUrl } from '@/helpers/url';
import { Theme } from '@material-ui/core';

Promise.config({ cancellation: true });

const Root = styled.div<{ hibernated?: boolean; active?: boolean }>`
  height: fit-content;
  width: 68px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  outline: none;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  -webkit-app-region: no-drag;
  opacity: 0.8;
  position: relative;
  border: 0;
  border-color: transparent;
  ${({ hibernated }) =>
    hibernated === true &&
    css`
      opacity: 0.4;
    `}
  ${({ active }) =>
    active === true &&
    css`
      opacity: 1;
    `}
`;

const backgroundColorShift = keyframes`
from {background-color: #dddddd;}
  to {background-color: #eeeeee}
`;
interface IAvatarProps {
  large?: boolean;
  transparent?: boolean;
  addAvatar: boolean;
  highlightAdd: boolean;
}
const Avatar = styled.div<IAvatarProps>`
  height: 36px;
  width: 36px;
  border-radius: 4px;
  line-height: 36px;
  text-align: center;
  font-weight: 500;
  text-transform: uppercase;
  overflow: hidden;
  ${({ large }) =>
    large === true &&
    css`
      height: 44px;
      width: 44px;
      line-height: 44px;
    `}
  ${({ transparent }) =>
    transparent === true &&
    css`
      background: transparent;
      border: none;
      border-radius: 0;
    `}

  &${({ highlightAdd, addAvatar }) => (highlightAdd && addAvatar ? '' : ':hover')}, &:hover {
    background-color: ${({ theme }) => theme.palette.background.default};
    animation: ${backgroundColorShift} 5s infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    color: ${({ theme }) => theme.palette.common.black};
  }
  ${({ addAvatar }: IAvatarProps) =>
    addAvatar
      ? ''
      : css`
          background-color: transparent;
        `}
`;

const AvatarPicture = styled.img<{ large?: boolean }>`
  height: calc(36px - 2px);
  width: calc(36px - 2px);
  ${({ large }) =>
    large === true &&
    css`
      height: 44px;
      width: 44px;
    `}
`;

const ShortcutText = styled.p`
  margin-top: 2px;
  margin-bottom: 0;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  word-break: normal;
  text-align: center;
`;
const Badge = styled(BadgeRaw)`
  line-height: 20px;
`;

interface Props {
  active?: boolean;
  badgeCount?: number;
  hibernated?: boolean;
  id: string;
  index?: number;
  picturePath?: string | null;
  showSidebarShortcutHints?: boolean;
  transparentBackground?: boolean;
  workspaceName?: string;
  onClick?: () => void;
}
export default function WorkspaceSelector({
  active = false,
  badgeCount = 0,
  hibernated = false,
  id,
  index = 0,
  picturePath,
  showSidebarShortcutHints = false,
  transparentBackground = false,
  workspaceName,
  onClick = () => {},
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [shortWorkspaceName, shortWorkspaceNameSetter] = useState<string>(t('Loading'));
  useEffect(() => {
    const baseName = window.remote.getBaseName(workspaceName);
    shortWorkspaceNameSetter(baseName !== undefined ? baseName : t('WorkspaceSelector.BadWorkspacePath'));
  }, [workspaceName, t]);
  return (
    <Root hibernated={hibernated} active={active} onClick={onClick}>
      <Badge color="secondary" badgeContent={badgeCount} max={99}>
        <Avatar
          large={!showSidebarShortcutHints}
          transparent={transparentBackground}
          addAvatar={id === 'add'}
          highlightAdd={index === 0}
          id={id === 'add' ? 'add-workspace-button' : `workspace-avatar-${id}`}>
          {id !== 'add' ? (
            <AvatarPicture alt="Icon" large={!showSidebarShortcutHints} src={getAssetsFileUrl(picturePath ?? defaultIcon)} draggable={false} />
          ) : (
            '+'
          )}
        </Avatar>
      </Badge>
      {showSidebarShortcutHints && <ShortcutText>{id === 'add' ? t('WorkspaceSelector.Add') : shortWorkspaceName}</ShortcutText>}
    </Root>
  );
}

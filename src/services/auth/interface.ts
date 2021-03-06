/* eslint-disable unicorn/no-null */
import { ProxyPropertyType } from '@/helpers/electron-ipc-proxy/common';
import { AuthenticationChannel } from '@/constants/channels';
import { BehaviorSubject } from 'rxjs';
import { IGitUserInfos } from '@services/git/interface';
import { SupportedStorageServices } from '@services/types';

export type ServiceTokenTypes = `${SupportedStorageServices}-token`;
/** Git Login: token */
type TokenRecord = Record<ServiceTokenTypes, string>;

export type ServiceUserNameTypes = `${SupportedStorageServices}-userName`;
/** Git Login: username , this is also used to filter user's repo when searching repo */
type UserNameRecord = Record<ServiceUserNameTypes, string>;

export type ServiceEmailTypes = `${SupportedStorageServices}-email`;
/** Git push: Git commit message email, you may use different email for different storage service */
type EmailRecord = Record<ServiceEmailTypes, string>;

export type IUserInfos = {
  /** Default UserName in TiddlyWiki, each wiki can have different username, but fallback to this if not specific on */
  userName: string;
} & Partial<TokenRecord> &
  Partial<UserNameRecord> &
  Partial<EmailRecord>;

/**
 * Handle login to Github GitLab Coding.net
 */
export interface IAuthenticationService {
  userInfo$: BehaviorSubject<IUserInfos>;
  getStorageServiceUserInfo(serviceName: SupportedStorageServices): Promise<IGitUserInfos | undefined>;
  /**
   * Get a random storage info, useful for checking if user have any token in the storage
   */
  getRandomStorageServiceUserInfo(): Promise<{ name: SupportedStorageServices; info: IGitUserInfos } | undefined>;
  getUserInfos: () => Promise<IUserInfos>;
  get<K extends keyof IUserInfos>(key: K): Promise<IUserInfos[K] | undefined>;
  set<K extends keyof IUserInfos>(key: K, value: IUserInfos[K]): Promise<void>;
  reset(): Promise<void>;
}
export const AuthenticationServiceIPCDescriptor = {
  channel: AuthenticationChannel.name,
  properties: {
    userInfo$: ProxyPropertyType.Value$,
    getStorageServiceUserInfo: ProxyPropertyType.Function,
    getRandomStorageServiceUserInfo: ProxyPropertyType.Function,
    getUserInfos: ProxyPropertyType.Function,
    get: ProxyPropertyType.Function,
    set: ProxyPropertyType.Function,
    reset: ProxyPropertyType.Function,
  },
};

export interface IGithubOAuthResult {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: any;
  company: any;
  blog: string;
  location: any;
  email: any;
  hireable: any;
  bio: any;
  twitter_username: any;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

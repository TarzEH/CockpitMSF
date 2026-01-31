export interface Session {
  id: number;
  host: string;
  port: number;
  type: string;
  desc: string;
  username?: string;
  uuid?: string;
  exploit_uuid?: string;
  via_exploit?: string;
  via_payload?: string;
  tunnel_local?: string;
  tunnel_peer?: string;
  closed_at?: string;
  closed_reason?: string;
  last_seen?: string;
  stype?: string;
  platform?: string;
  arch?: string;
  workspace_id?: number;
}

export interface Host {
  id: number;
  address: string;
  mac?: string;
  comm?: string;
  name?: string;
  state?: string;
  os_name?: string;
  os_flavor?: string;
  os_sp?: string;
  os_lang?: string;
  arch?: string;
  workspace_id: number;
  updated_at: string;
  created_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  name: string;
  fullname: string;
  rank: number;
  disclosure_date?: string;
  type: string;
  author?: string[];
  description?: string;
  references?: string[];
  platform?: string[];
  targets?: string[];
  arch?: string[];
}

export interface Credential {
  id: number;
  username: string;
  password?: string;
  realm?: string;
  realm_type?: string;
  private_type?: string;
  private_data?: string;
  jtr_format?: string;
  workspace_id: number;
}

export interface Loot {
  id: number;
  ltype: string;
  path: string;
  host_id?: number;
  workspace_id: number;
  created_at: string;
}

export interface Job {
  id: number;
  name: string;
  start_time: number;
  uri_path?: string;
  datastore?: Record<string, any>;
}

export interface RpcRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number | string;
}

export interface RpcResponse {
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string;
}

export interface Console {
  id: number;
  prompt: string;
  busy: boolean;
}

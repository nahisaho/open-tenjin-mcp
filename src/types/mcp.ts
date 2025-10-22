/**
 * Model Context Protocol (MCP) 2025-06-18 Types
 * 
 * 最新のMCP仕様に準拠した型定義
 */

// Base JSON-RPC Types
export const LATEST_PROTOCOL_VERSION = "2025-06-18";
export const JSONRPC_VERSION = "2.0";

export type RequestId = string | number;
export type ProgressToken = string | number;
export type Cursor = string;

export interface Request {
  method: string;
  params?: {
    /**
     * See [General fields: `_meta`] for notes on `_meta` usage.
     */
    _meta?: {
      /**
       * If specified, the caller is requesting out-of-band progress
       * notifications for this request.
       */
      progressToken?: ProgressToken;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export interface Notification {
  method: string;
  params?: {
    /**
     * See [General fields: `_meta`] for notes on `_meta` usage.
     */
    _meta?: { [key: string]: unknown };
    [key: string]: unknown;
  };
}

export interface Result {
  /**
   * See [General fields: `_meta`] for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
  [key: string]: unknown;
}

export interface JSONRPCRequest extends Request {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
}

export interface JSONRPCNotification extends Notification {
  jsonrpc: typeof JSONRPC_VERSION;
}

export interface JSONRPCResponse {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
  result: Result;
}

export interface JSONRPCError {
  jsonrpc: typeof JSONRPC_VERSION;
  id: RequestId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// Base Metadata Interface
export interface BaseMetadata {
  /**
   * Intended for programmatic or logical use, but used as a display name in
   * past specs or fallback (if title isn't present).
   */
  name: string;
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and
   * easily understood.
   */
  title?: string;
}

// Implementation Info
export interface Implementation extends BaseMetadata {
  version: string;
}

// MCP Protocol Types
export interface InitializeParams {
  protocolVersion: string;
  capabilities: ClientCapabilities;
  clientInfo: Implementation;
}

export interface InitializeResult extends Result {
  protocolVersion: string;
  capabilities: ServerCapabilities;
  serverInfo: Implementation;
  instructions?: string;
}

export interface ClientCapabilities {
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental?: { [key: string]: object };
  /**
   * Present if the client supports listing roots.
   */
  roots?: {
    listChanged?: boolean;
  };
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling?: object;
  /**
   * Present if the client supports elicitation from the server.
   */
  elicitation?: object;
}

export interface ServerCapabilities {
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental?: { [key: string]: object };
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging?: object;
  /**
   * Present if the server supports argument autocompletion suggestions.
   */
  completions?: object;
  /**
   * Present if the server offers any prompt templates.
   */
  prompts?: {
    listChanged?: boolean;
  };
  /**
   * Present if the server offers any resources to read.
   */
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  /**
   * Present if the server offers any tools to call.
   */
  tools?: {
    listChanged?: boolean;
  };
}

// Annotations
export interface Annotations {
  /**
   * Describes who the intended customer of this object or data is.
   */
  audience?: Role[];
  /**
   * Describes how important this data is for operating the server.
   * A value of 1 means "most important," while 0 means "least important."
   */
  priority?: number;
  /**
   * The moment the resource was last modified, as an ISO 8601 formatted string.
   */
  lastModified?: string;
}

// Tool Annotations
export interface ToolAnnotations {
  /**
   * A human-readable title for the tool.
   */
  title?: string;
  /**
   * If true, the tool does not modify its environment.
   */
  readOnlyHint?: boolean;
  /**
   * If true, the tool may perform destructive updates to its environment.
   */
  destructiveHint?: boolean;
}

// Tools
export interface Tool extends BaseMetadata {
  /**
   * A description of what this tool does.
   */
  description?: string;
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: {
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
  };
  /**
   * An optional JSON Schema object defining the structure of the tool's output
   * returned in the structuredContent field of a CallToolResult.
   */
  outputSchema?: {
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
  };
  /**
   * Optional additional tool information.
   */
  annotations?: ToolAnnotations;
  /**
   * See [General fields: `_meta`] for notes on `_meta` usage.
   */
  _meta?: { [key: string]: unknown };
}

export interface CallToolRequest extends Request {
  method: "tools/call";
  params: {
    name: string;
    arguments?: { [key: string]: unknown };
  };
}

export interface CallToolResult extends Result {
  /**
   * A list of content objects that represent the unstructured result of the tool call.
   */
  content: ContentBlock[];
  /**
   * An optional JSON object that represents the structured result of the tool call.
   */
  structuredContent?: { [key: string]: unknown };
  /**
   * Whether the tool call ended in an error.
   */
  isError?: boolean;
}

// Role Types
export type Role = "user" | "assistant";

// Content Types
export type ContentBlock =
  | TextContent
  | ImageContent
  | AudioContent
  | ResourceLink
  | EmbeddedResource;

export interface TextContent {
  type: "text";
  text: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

export interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

export interface AudioContent {
  type: "audio";
  data: string;
  mimeType: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

// Resource Types
export interface Resource extends BaseMetadata {
  uri: string;
  description?: string;
  mimeType?: string;
  annotations?: Annotations;
  size?: number;
  _meta?: { [key: string]: unknown };
}

export interface ResourceContents {
  uri: string;
  mimeType?: string;
  _meta?: { [key: string]: unknown };
}

export interface TextResourceContents extends ResourceContents {
  text: string;
}

export interface BlobResourceContents extends ResourceContents {
  blob: string;
}

export interface ResourceLink extends Resource {
  type: "resource_link";
}

export interface EmbeddedResource {
  type: "resource";
  resource: TextResourceContents | BlobResourceContents;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

// Standard Error Codes (JSON-RPC 2.0)
export const ErrorCodes = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // MCP specific errors
  RESOURCE_NOT_FOUND: -32002,
} as const;
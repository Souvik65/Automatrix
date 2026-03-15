export interface Item {
  json: Record<string, any>;
  binary?: Record<string, Buffer | string>;
}

export interface ExecutionContext {
  workflowId: string;
  executionId: string;
  nodeData: Record<string, any>;
  inputData: Item[];
  getCredentials: (credentialName: string) => Promise<Record<string, string>>;
  getVariable: (name: string) => any;
  setVariable: (name: string, value: any) => void;
}

export interface NodeResult {
  success: boolean;
  data: Item[];
  error?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowNode {
  type: string;
  ports: { inputs: number; outputs: number };
  execute(context: ExecutionContext): Promise<NodeResult>;
}

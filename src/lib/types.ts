export type DroneCategory = 'iniciante' | 'fpv' | 'filmagem' | 'freestyle' | 'long-range';

export type ComponentType =
  | 'frame'
  | 'motor'
  | 'esc'
  | 'flight-controller'
  | 'propeller'
  | 'battery'
  | 'camera'
  | 'vtx'
  | 'receiver'
  | 'radio';

export interface DroneComponent {
  id: string;
  name: string;
  brand: string;
  type: ComponentType;
  price: number;
  weight: number; // grams
  description: string;
  specs: Record<string, string>;
  compatibleCategories: DroneCategory[];
  compatibleWith?: string[]; // IDs of compatible components (optional constraints)
  image?: string;
  inStock: boolean;
}

export interface SelectedBuild {
  frame?: DroneComponent;
  motor?: DroneComponent;
  esc?: DroneComponent;
  flightController?: DroneComponent;
  propeller?: DroneComponent;
  battery?: DroneComponent;
  camera?: DroneComponent;
  vtx?: DroneComponent;
  receiver?: DroneComponent;
  radio?: DroneComponent;
}

export interface BuildSummary {
  components: SelectedBuild;
  totalPrice: number;
  totalWeight: number;
  estimatedFlightTime: number; // minutes
  performanceLevel: 'iniciante' | 'intermediário' | 'avançado' | 'profissional';
  compatibilityOk: boolean;
  warnings: string[];
  assemblyPrice: number;
}

export interface Quote {
  id: string;
  build: BuildSummary;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  status: 'pending' | 'analyzing' | 'assembling' | 'testing' | 'ready' | 'shipped';
}

export interface ConfiguratorStep {
  id: string;
  label: string;
  componentType: ComponentType | 'summary';
  description: string;
  required: boolean;
}

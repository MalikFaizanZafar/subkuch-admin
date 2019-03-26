export interface NavigationTab {
  id: number;
  title: string;
  active: boolean;
  route?: string;
  value?: number;
  disabled?: boolean;
  over?: boolean;
}

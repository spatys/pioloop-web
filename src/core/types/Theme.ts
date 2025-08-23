export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export interface Theme {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
}

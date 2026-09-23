declare module "react-simple-maps" {
  import type { ReactNode, SVGProps } from "react";
  export const ComposableMap: (props: SVGProps<SVGSVGElement> & { projection?: string; projectionConfig?: object; width?: number; height?: number }) => ReactNode;
  export const Geographies: (props: { geography: unknown; parseGeographies?: (features: { properties?: { name?: string } | null }[]) => unknown[]; children: (input: { geographies: { rsmKey: string; id?: string | number; properties?: { name?: string } | null }[] }) => ReactNode }) => ReactNode;
  export const Geography: (props: Record<string, unknown>) => ReactNode;
  export const Marker: (props: { coordinates: [number, number]; children?: ReactNode }) => ReactNode;
  export const Sphere: (props: Record<string, unknown>) => ReactNode;
  export const Graticule: (props: Record<string, unknown>) => ReactNode;
}

export type VinculumPd7Device = {
  client?: {
    // User-defined device name
    name?: string | null,
  } | null,
  id: number,
  services?: any,
  type?: {
    type?: string | null,
    subtype?: string | null,
  } | null,
};

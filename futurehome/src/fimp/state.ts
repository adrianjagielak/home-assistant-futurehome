export type DeviceState = {
  id?: number | null;
  services?: DeviceStateService[] | null;
};

export type DeviceStateService = {
  addr?: string;
  attributes?: Attribute[];
  name?: string;
};

export type Attribute = {
  name: string;
  values: AttributeValue[];
};

export type AttributeValue =
  | StringValue
  | IntValue
  | FloatValue
  | BoolValue
  | NullValue
  | StrArrayValue
  | IntArrayValue
  | FloatArrayValue
  | StrMapValue
  | IntMapValue
  | FloatMapValue
  | BoolMapValue
  | ObjectValue
  | BinValue;

export type Timestamp = string;

export type StringValue = {
  ts: Timestamp;
  val: string;
  val_t: 'string';
};

export type IntValue = {
  ts: Timestamp;
  val: number;
  val_t: 'int';
};

export type FloatValue = {
  ts: Timestamp;
  val: number;
  val_t: 'float';
};

export type BoolValue = {
  ts: Timestamp;
  val: boolean;
  val_t: 'bool';
};

export type NullValue = {
  ts: Timestamp;
  val?: null;
  val_t: 'null';
};

export type StrArrayValue = {
  ts: Timestamp;
  val: string[];
  val_t: 'str_array';
};

export type IntArrayValue = {
  ts: Timestamp;
  val: number[];
  val_t: 'int_array';
};

export type FloatArrayValue = {
  ts: Timestamp;
  val: number[];
  val_t: 'float_array';
};

export type StrMapValue = {
  ts: Timestamp;
  val: {
    [key: string]: string;
  };
  val_t: 'str_map';
};

export type IntMapValue = {
  ts: Timestamp;
  val: {
    [key: string]: number;
  };
  val_t: 'int_map';
};

export type FloatMapValue = {
  ts: Timestamp;
  val: {
    [key: string]: number;
  };
  val_t: 'float_map';
};

export type BoolMapValue = {
  ts: Timestamp;
  val: {
    [key: string]: boolean;
  };
  val_t: 'bool_map';
};

export type ObjectValue = {
  ts: Timestamp;
  val: {
    [key: string]: any;
  };
  val_t: 'object';
};

export type BinValue = {
  ts: Timestamp;
  val: string;
  val_t: 'bin';
};

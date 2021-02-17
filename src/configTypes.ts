import { AccessoryIdentifier, AccessoryName } from 'homebridge';

export type SmartLedStripConfig = {
  accessory: AccessoryName | AccessoryIdentifier;
  name: string;
  uuid_base?: string;
  rPin?: number;
  gPin?: number;
  bPin?: number;
  wPin?: number;
};
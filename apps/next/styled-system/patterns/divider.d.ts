/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface DividerProperties {
   color?: ConditionalValue<Tokens["colors"] | Properties["borderColor"]>
	orientation?: ConditionalValue<"horizontal" | "vertical" | "horizontal" | "vertical">
	thickness?: ConditionalValue<string>
}

interface DividerStyles extends DividerProperties, DistributiveOmit<SystemStyleObject, keyof DividerProperties > {}

interface DividerPatternFn {
  (styles?: DividerStyles): string
  raw: (styles?: DividerStyles) => SystemStyleObject
}

/**
 * divider pattern
 */
export declare const divider: DividerPatternFn;

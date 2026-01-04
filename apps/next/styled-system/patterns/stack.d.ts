/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface StackProperties {
   direction?: "horizontal" | "vertical"
	gap?: SystemProperties["gap"]
	align?: SystemProperties["alignItems"]
	justify?: SystemProperties["justifyContent"]
}

interface StackStyles extends StackProperties, DistributiveOmit<SystemStyleObject, keyof StackProperties > {}

interface StackPatternFn {
  (styles?: StackStyles): string
  raw: (styles?: StackStyles) => SystemStyleObject
}

/**
 * A pattern for stacking elements with consistent spacing
 */
export declare const stack: StackPatternFn;

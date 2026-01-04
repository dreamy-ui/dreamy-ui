/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface TextProperties {
   variant?: "heading" | "link"
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
}

interface TextStyles extends TextProperties, DistributiveOmit<SystemStyleObject, keyof TextProperties > {}

interface TextPatternFn {
  (styles?: TextStyles): string
  raw: (styles?: TextStyles) => SystemStyleObject
}


export declare const text: TextPatternFn;

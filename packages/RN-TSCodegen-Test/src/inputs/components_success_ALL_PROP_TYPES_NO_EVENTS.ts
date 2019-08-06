
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const codegenNativeComponent = require('codegenNativeComponent');

import type {
  Int32,
  Float,
  WithDefault,
} from 'CodegenTypes';

import type {ColorValue, ColorArrayValue, PointValue} from 'StyleSheetTypes';
import type {ImageSource} from 'ImageSource';
import type {ViewProps} from 'ViewPropTypes';

type ModuleProps = $ReadOnly<{|
  ...ViewProps,

  // Props
  // Boolean props
  boolean_required: boolean,
  boolean_optional_key?: WithDefault<boolean, true>,
  boolean_optional_both?: WithDefault<boolean, true>,

  // String props
  string_required: string,
  string_optional_key?: WithDefault<string, ''>,
  string_optional_both?: WithDefault<string, ''>,

  // String props, null default
  string_null_optional_key?: WithDefault<string, null>,
  string_null_optional_both?: WithDefault<string, null>,

  // Stringish props
  stringish_required: Stringish,
  stringish_optional_key?: WithDefault<Stringish, ''>,
  stringish_optional_both?: WithDefault<Stringish, ''>,

  // Stringish props, null default
  stringish_null_optional_key?: WithDefault<Stringish, null>,
  stringish_null_optional_both?: WithDefault<Stringish, null>,

  // Float props
  float_required: Float,
  float_optional_key?: WithDefault<Float, 1.1>,
  float_optional_both?: WithDefault<Float, 1.1>,

  // Int32 props
  int32_required: Int32,
  int32_optional_key?: WithDefault<Int32, 1>,
  int32_optional_both?: WithDefault<Int32, 1>,

  // String enum props
  enum_optional_key?: WithDefault<('small' | 'large'), 'small'>,
  enum_optional_both?: WithDefault<('small' | 'large'), 'small'>,

  // ImageSource props
  image_required: ImageSource,
  image_optional_value: ?ImageSource,
  image_optional_both?: ?ImageSource,

  // ColorValue props
  color_required: ColorValue,
  color_optional_key?: ColorValue,
  color_optional_value: ?ColorValue,
  color_optional_both?: ?ColorValue,

  // ColorArrayValue props
  color_array_required: ColorArrayValue,
  color_array_optional_key?: ColorArrayValue,
  color_array_optional_value: ?ColorArrayValue,
  color_array_optional_both?: ?ColorArrayValue,

  // PointValue props
  point_required: PointValue,
  point_optional_key?: PointValue,
  point_optional_value: ?PointValue,
  point_optional_both?: ?PointValue,
|}>;

export default codegenNativeComponent<ModuleProps, Options>('Module');

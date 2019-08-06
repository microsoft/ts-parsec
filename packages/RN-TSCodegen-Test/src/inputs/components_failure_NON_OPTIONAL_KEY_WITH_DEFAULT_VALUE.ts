import {Float} from '../lib/CodegenTypes';import {WithDefault} from '../lib/CodegenTypes';import codegenNativeComponent = require('../lib/codegenNativeComponent');

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





import {ViewProps} from '../lib/ViewPropTypes';


export type ModuleProps = Readonly<ViewProps & {
  required_key_with_default: WithDefault<Float, 1.0>;
}>;

export default codegenNativeComponent<ModuleProps>('Module');

/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2017 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
 * @fileoverview Tests for Blockly.FieldVariable
 * @author marisaleung@google.com (Marisa Leung)
 */
'use strict';

var workspace;
var saved_msg = Blockly.Msg.DELETE_VARIABLE;
Blockly.defineBlocksWithJsonArray([{
    "type": "get_var_block",
    "message0": "%1",
    "args0": [
    {
      "type": "field_variable",
      "name": "VAR",
      "variable": "name1"
    }
  ]
}]);

function fieldVariableTest_setUp() {
  workspace = new Blockly.Workspace();
  // Need to define this because field_variable's dropdownCreate() calls replace
  // on undefined value, Blockly.Msg.DELETE_VARIABLE. To fix this, define
  // Blockly.Msg.DELETE_VARIABLE as %1 so the replace function finds the %1 it
  // expects.
  Blockly.Msg.DELETE_VARIABLE = '%1';
}

function fieldVariableTest_tearDown() {
  workspace.dispose();
  Blockly.Msg.DELETE_VARIABLE = saved_msg;
}

/**
 * Check if the variable has the given name, type, and id.
 * @param {!VariableModel} variable The variable to check.
 * @param {!string} name The expected name of the variable.
 * @param {!string} type The expected type of the variable.
 * @param {!string} id The expected id of the variable.
 */
function fieldVariableTest_checkVariableValues(variable, name, type, id) {
  assertNotUndefined(variable);
  assertEquals(name, variable.name);
  assertEquals(type, variable.type);
  assertEquals(id, variable.getId());
}

function test_fieldVariable_constructorTrivial() {
  fieldVariableTest_setUp();

  fieldVariableTest_tearDown();
}

function test_fieldVariable_setValue_Trivial() {
  fieldVariableTest_setUp();
  workspace.createVariable('name1', 'type1', 'id1');
  //create block and set it as source block
  var block = new Blockly.Block(workspace, 'get_var_block');
  var field_variable = new Blockly.FieldVariable('name1');

  field_variable.setSourceBlock(block);
  field_variable.setValue('id1');
  var id = field_variable.value_;
  var result_var = workspace.getVariableById(id);
  fieldVariableTest_checkVariableValues(result_var, 'name1', 'type1', 'id1');
  fieldVariableTest_tearDown();
}

function test_fieldVariable_setValue_NoSourceBlock() {
  fieldVariableTest_setUp();
  workspace.createVariable('name1', 'type1', 'id1');
  var field_variable = new Blockly.FieldVariable('name1');

  try {
    field_variable.setValue('id1');
    fail();
  } catch (e) {
    console.log(e.message);
    var expected_msg = ('Variable with the id \'id1\' could not be found ' +
                        'because sourceBlock_ is undefined.');
    assertEquals(expected_msg, e.message);

    // expected
  }
  fieldVariableTest_tearDown();
}

function test_fieldVariable_setValue_InvalidId() {
  fieldVariableTest_setUp();
  workspace.createVariable('name1', 'type1', 'id1');
  var block = new Blockly.Block(workspace, 'get_var_block');
  var field_variable = new Blockly.FieldVariable('name1');
  field_variable.setSourceBlock(block);
  try {
    field_variable.setValue('id2');
    fail();
  } catch (e) {
    var expected_msg = ('Variable with the id \'id2\' could not be found in ' +
                         'the VariableMap.');
    assertEquals(expected_msg, e.message);
    // expected
  }
  fieldVariableTest_tearDown();
}

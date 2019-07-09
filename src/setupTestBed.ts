import { TestBed, async, TestModuleMetadata } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const resetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
const allowAngularToReset = () => TestBed.resetTestingModule = resetTestingModule;
const makeSchemas = (schemas: any[] = []) => {
  return [...schemas, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA].filter((elem, i, arr) => arr.indexOf(elem) === i);
};

global.setupTestBed = (moduleDef: TestModuleMetadata) => {
  beforeAll(async(async() => {
    resetTestingModule();
    preventAngularFromResetting();
    moduleDef.schemas = makeSchemas(moduleDef.schemas);
    TestBed.configureTestingModule(moduleDef);
    await TestBed.compileComponents();
  }));

  afterAll(() => allowAngularToReset());
};

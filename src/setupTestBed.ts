import { TestBed, async, TestModuleMetadata } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const resetTestingModule = TestBed.resetTestingModule,
  preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
  const allowAngularToReset = () => TestBed.resetTestingModule = resetTestingModule;

global.setupTestBed = (moduleDef: TestModuleMetadata) => {
  beforeAll(async(async() => {
    resetTestingModule();
    preventAngularFromResetting();
    moduleDef.schemas = [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    TestBed.configureTestingModule(moduleDef);
    await TestBed.compileComponents();
  }));

  afterAll(() => allowAngularToReset());
};

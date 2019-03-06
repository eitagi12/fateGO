module.exports = {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/src/setupJest.ts"],
    "transform": {
      "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
      "^.+\\.js$": "babel-jest"
    },
    "rootDir": ".",
    "globals": {
      "ts-jest": {
        "tsConfigFile": "<rootDir>/src/app/tsconfig.spec.json"
      },
      "__TRANSFORM_HTML__": true
    },
    "testMatch": [
      "<rootDir>/**/*.spec.ts"
    ],
    "moduleFileExtensions": [
      "ts",
      "js",
      "html",
      "json"
    ],
    "mapCoverage": true,
    "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/modules/*.*/"
    ],
    "moduleNameMapper": {
      "^@ngrx/(?!db)(.*)": "<rootDir>/../../modules/$1",
      "^@example-app/(.*)": "<rootDir>/src/app/$1"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!mychannel-shared-libs)"
    ],
    "modulePathIgnorePatterns": [
      "dist"
    ]
  };
  
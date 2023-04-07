import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './config.yaml';
const YAML_CONFIG_TEST_FILENAME = './config-test.yaml';

export default (isTest: boolean = false) => {
    return yaml.load(
        readFileSync(
            join(
                __dirname,
                isTest ? YAML_CONFIG_TEST_FILENAME : YAML_CONFIG_FILENAME
            ),
            'utf8'
        ),
    ) as Record<string, any>;
};

import createConfigMicroOrm from '../../mikro-orm.config';
import { ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ApiConfigService } from '../../src/app/common/providers/api-config.service';

const createTestConfigMicroOrm = () =>
    createConfigMicroOrm(
        new ApiConfigService(new ConfigService(configuration(true))),
    );

export default createTestConfigMicroOrm;

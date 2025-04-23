/**
 * @file admin.ts
 * @description 管理员模拟数据
 */

import { faker } from '@faker-js/faker';

// 创建者社交信息
export const creatorSocial = {
  website: faker.helpers.maybe(() => faker.internet.url()),
  twitter: faker.helpers.maybe(() => faker.internet.username()),
  github: faker.helpers.maybe(() => faker.internet.username()),
  instagram: faker.helpers.maybe(() => faker.internet.username()),
  location: faker.helpers.maybe(() => faker.location.city() + ', ' + faker.location.country()),
};

export default creatorSocial;

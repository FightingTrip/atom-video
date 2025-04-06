import { faker } from '@faker-js/faker';
import { generateId } from '@/utils/format';
// 生成用户数据
export const generateUsers = (count) => {
    return Array.from({ length: count }, () => ({
        id: generateId(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
        verified: faker.datatype.boolean(0.2),
        subscribers: faker.number.int({ min: 100, max: 1000000 }),
        subscribing: faker.number.int({ min: 10, max: 500 }),
        totalViews: faker.number.int({ min: 1000, max: 10000000 }),
        joinedAt: faker.date.past({ years: 3 }).toISOString(),
        social: {
            website: faker.helpers.maybe(() => faker.internet.url()),
            twitter: faker.helpers.maybe(() => faker.internet.userName()),
            github: faker.helpers.maybe(() => faker.internet.userName()),
            instagram: faker.helpers.maybe(() => faker.internet.userName()),
        },
    }));
};
// 生成视频数据
export const generateVideos = (users, count) => {
    return Array.from({ length: count }, () => {
        const user = faker.helpers.arrayElement(users);
        return {
            id: generateId(),
            title: faker.helpers.arrayElement([
                'Vue 3 完整教程 2024 - 从入门到精通',
                'React 实战项目开发教程',
                'TypeScript 高级特性详解',
                'Node.js 服务端开发实践',
                'Python 数据分析入门指南',
            ]),
            description: faker.lorem.paragraphs(2),
            thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
            duration: faker.number.int({ min: 300, max: 7200 }),
            views: faker.number.int({ min: 1000, max: 1000000 }),
            likes: faker.number.int({ min: 100, max: 50000 }),
            dislikes: faker.number.int({ min: 0, max: 1000 }),
            createdAt: faker.date.past({ years: 1 }).toISOString(),
            tags: faker.helpers.arrayElements(['javascript', 'typescript', 'vue', 'react', 'nodejs'], faker.number.int({ min: 1, max: 3 })),
            user: {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
                verified: user.verified,
            },
        };
    });
};
//# sourceMappingURL=data.js.map
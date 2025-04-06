import 'dayjs/locale/zh-cn';
import type { Comment } from '@/types';
interface Props {
    comments: Comment[];
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    reply: (commentId: string, content: string, replyToId?: string | undefined) => any;
    like: (commentId: string) => any;
    post: (content: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onReply?: ((commentId: string, content: string, replyToId?: string | undefined) => any) | undefined;
    onLike?: ((commentId: string) => any) | undefined;
    onPost?: ((content: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

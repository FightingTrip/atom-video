import 'dayjs/locale/zh-cn';
import type { Video } from '@/types';
interface Props {
    video: Video | null;
    isLiked: boolean;
    isFavorited: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    like: () => any;
    favorite: () => any;
    share: () => any;
    follow: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onLike?: (() => any) | undefined;
    onFavorite?: (() => any) | undefined;
    onShare?: (() => any) | undefined;
    onFollow?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

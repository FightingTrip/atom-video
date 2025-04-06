import 'vue-plyr/dist/vue-plyr.css';
import type { Video } from '@/types';
type __VLS_Props = {
    video: Video;
    currentTime?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    ended: () => any;
    pause: () => any;
    play: () => any;
    "time-update": (time: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEnded?: (() => any) | undefined;
    onPause?: (() => any) | undefined;
    onPlay?: (() => any) | undefined;
    "onTime-update"?: ((time: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

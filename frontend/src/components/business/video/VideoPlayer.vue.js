/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';
import { NButton, NButtonGroup, NIcon, NInput, NSpin } from 'naive-ui';
import { AlertCircleIcon, ChatBubbleIcon, SendIcon } from '@vicons/ionicons5';
const props = defineProps();
const emit = defineEmits();
// 状态
const playerRef = ref();
const videoRef = ref();
const loading = ref(true);
const error = ref(null);
const isDanmakuEnabled = ref(true);
const isDanmakuInputVisible = ref(false);
const danmakuText = ref('');
const danmakuAreaRef = ref();
const danmakuList = ref([]);
// 播放器配置
const playerOptions = {
    controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    quality: { default: 720, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] }
};
// 计算属性
const visibleDanmaku = computed(() => {
    if (!videoRef.value)
        return [];
    const currentTime = videoRef.value.currentTime;
    return danmakuList.value.filter(danmaku => Math.abs(danmaku.time - currentTime) < 3);
});
// 方法
const handleReady = () => {
    loading.value = false;
    if (props.currentTime) {
        videoRef.value.currentTime = props.currentTime;
    }
};
const handleError = (err) => {
    error.value = '视频加载失败';
    console.error('Video error:', err);
};
const handleTimeUpdate = () => {
    if (videoRef.value) {
        emit('time-update', videoRef.value.currentTime);
    }
};
const handlePlay = () => {
    emit('play');
};
const handlePause = () => {
    emit('pause');
};
const handleEnded = () => {
    emit('ended');
};
const retry = () => {
    loading.value = true;
    error.value = null;
    videoRef.value?.load();
};
const toggleDanmaku = () => {
    isDanmakuEnabled.value = !isDanmakuEnabled.value;
};
const toggleDanmakuInput = () => {
    isDanmakuInputVisible.value = !isDanmakuInputVisible.value;
};
const sendDanmaku = () => {
    if (!danmakuText.value.trim() || !videoRef.value)
        return;
    const danmaku = {
        id: Date.now(),
        content: danmakuText.value,
        time: videoRef.value.currentTime,
        top: Math.random() * 80 + 10, // 10% 到 90% 之间
        offset: danmakuAreaRef.value?.offsetWidth || 0,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`
    };
    danmakuList.value.push(danmaku);
    danmakuText.value = '';
    isDanmakuInputVisible.value = false;
};
// 键盘快捷键
const handleKeydown = (event) => {
    if (!videoRef.value)
        return;
    switch (event.key) {
        case ' ':
            event.preventDefault();
            if (videoRef.value.paused) {
                videoRef.value.play();
            }
            else {
                videoRef.value.pause();
            }
            break;
        case 'ArrowLeft':
            event.preventDefault();
            videoRef.value.currentTime -= 5;
            break;
        case 'ArrowRight':
            event.preventDefault();
            videoRef.value.currentTime += 5;
            break;
        case 'ArrowUp':
            event.preventDefault();
            videoRef.value.volume = Math.min(1, videoRef.value.volume + 0.1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            videoRef.value.volume = Math.max(0, videoRef.value.volume - 0.1);
            break;
    }
};
// 生命周期钩子
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['plyr__control--overlaid']} */ ;
/** @type {__VLS_StyleScopedClasses['plyr__menu__container']} */ ;
/** @type {__VLS_StyleScopedClasses['plyr__menu__container']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-input']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-player" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-overlay" },
    });
    const __VLS_0 = {}.NSpin;
    /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: "large",
    }));
    const __VLS_2 = __VLS_1({
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "loading-text" },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-overlay" },
    });
    const __VLS_4 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        size: "48",
        ...{ class: "error-icon" },
    }));
    const __VLS_6 = __VLS_5({
        size: "48",
        ...{ class: "error-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.AlertCircleIcon;
    /** @type {[typeof __VLS_components.AlertCircleIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-text" },
    });
    (__VLS_ctx.error);
    const __VLS_12 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.retry)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "player-container" },
    });
    const __VLS_20 = {}.VuePlyr;
    /** @type {[typeof __VLS_components.VuePlyr, typeof __VLS_components.vuePlyr, typeof __VLS_components.VuePlyr, typeof __VLS_components.vuePlyr, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onReady': {} },
        ...{ 'onError': {} },
        ...{ 'onTimeupdate': {} },
        ...{ 'onPlay': {} },
        ...{ 'onPause': {} },
        ...{ 'onEnded': {} },
        ref: "playerRef",
        options: (__VLS_ctx.playerOptions),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onReady': {} },
        ...{ 'onError': {} },
        ...{ 'onTimeupdate': {} },
        ...{ 'onPlay': {} },
        ...{ 'onPause': {} },
        ...{ 'onEnded': {} },
        ref: "playerRef",
        options: (__VLS_ctx.playerOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onReady: (__VLS_ctx.handleReady)
    };
    const __VLS_28 = {
        onError: (__VLS_ctx.handleError)
    };
    const __VLS_29 = {
        onTimeupdate: (__VLS_ctx.handleTimeUpdate)
    };
    const __VLS_30 = {
        onPlay: (__VLS_ctx.handlePlay)
    };
    const __VLS_31 = {
        onPause: (__VLS_ctx.handlePause)
    };
    const __VLS_32 = {
        onEnded: (__VLS_ctx.handleEnded)
    };
    /** @type {typeof __VLS_ctx.playerRef} */ ;
    var __VLS_33 = {};
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
        ref: "videoRef",
        src: (__VLS_ctx.video.url),
        poster: (__VLS_ctx.video.coverUrl),
        preload: ('auto'),
        crossorigin: true,
        playsinline: true,
    });
    /** @type {typeof __VLS_ctx.videoRef} */ ;
    for (const [source] of __VLS_getVForSourceType((__VLS_ctx.video.sources))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.source)({
            key: (source.url),
            src: (source.url),
            type: (source.type),
            size: (source.size),
            label: (source.label),
        });
    }
    for (const [subtitle] of __VLS_getVForSourceType((__VLS_ctx.video.subtitles))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.track)({
            key: (subtitle.url),
            src: (subtitle.url),
            label: (subtitle.label),
            srclang: (subtitle.srclang),
            default: (subtitle.default),
            kind: "subtitles",
        });
    }
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "danmaku-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "danmaku-controls" },
    });
    const __VLS_35 = {}.NButtonGroup;
    /** @type {[typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_38.slots.default;
    const __VLS_39 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
        quaternary: true,
        type: (__VLS_ctx.isDanmakuEnabled ? 'primary' : 'default'),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
        quaternary: true,
        type: (__VLS_ctx.isDanmakuEnabled ? 'primary' : 'default'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_43;
    let __VLS_44;
    let __VLS_45;
    const __VLS_46 = {
        onClick: (__VLS_ctx.toggleDanmaku)
    };
    __VLS_42.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_42.slots;
        const __VLS_47 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({}));
        const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
        __VLS_50.slots.default;
        const __VLS_51 = {}.ChatBubbleIcon;
        /** @type {[typeof __VLS_components.ChatBubbleIcon, ]} */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({}));
        const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
        var __VLS_50;
    }
    var __VLS_42;
    const __VLS_55 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        quaternary: true,
        type: (__VLS_ctx.isDanmakuInputVisible ? 'primary' : 'default'),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        quaternary: true,
        type: (__VLS_ctx.isDanmakuInputVisible ? 'primary' : 'default'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_59;
    let __VLS_60;
    let __VLS_61;
    const __VLS_62 = {
        onClick: (__VLS_ctx.toggleDanmakuInput)
    };
    __VLS_58.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_58.slots;
        const __VLS_63 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
        const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
        __VLS_66.slots.default;
        const __VLS_67 = {}.SendIcon;
        /** @type {[typeof __VLS_components.SendIcon, ]} */ ;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({}));
        const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
        var __VLS_66;
    }
    var __VLS_58;
    var __VLS_38;
    if (__VLS_ctx.isDanmakuInputVisible) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "danmaku-input" },
        });
        const __VLS_71 = {}.NInput;
        /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
            ...{ 'onKeydown': {} },
            value: (__VLS_ctx.danmakuText),
            placeholder: "发送弹幕...",
        }));
        const __VLS_73 = __VLS_72({
            ...{ 'onKeydown': {} },
            value: (__VLS_ctx.danmakuText),
            placeholder: "发送弹幕...",
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        let __VLS_75;
        let __VLS_76;
        let __VLS_77;
        const __VLS_78 = {
            onKeydown: (__VLS_ctx.sendDanmaku)
        };
        var __VLS_74;
        const __VLS_79 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.danmakuText.trim()),
        }));
        const __VLS_81 = __VLS_80({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.danmakuText.trim()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_80));
        let __VLS_83;
        let __VLS_84;
        let __VLS_85;
        const __VLS_86 = {
            onClick: (__VLS_ctx.sendDanmaku)
        };
        __VLS_82.slots.default;
        var __VLS_82;
    }
    if (__VLS_ctx.isDanmakuEnabled) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "danmaku-area" },
            ref: "danmakuAreaRef",
        });
        /** @type {typeof __VLS_ctx.danmakuAreaRef} */ ;
        for (const [danmaku] of __VLS_getVForSourceType((__VLS_ctx.visibleDanmaku))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (danmaku.id),
                ...{ class: "danmaku-item" },
                ...{ style: ({
                        top: `${danmaku.top}%`,
                        transform: `translateX(${danmaku.offset}px)`,
                        color: danmaku.color
                    }) },
            });
            (danmaku.content);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['video-player']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['error-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
/** @type {__VLS_StyleScopedClasses['player-container']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-container']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-input']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-area']} */ ;
/** @type {__VLS_StyleScopedClasses['danmaku-item']} */ ;
// @ts-ignore
var __VLS_34 = __VLS_33;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VuePlyr: VuePlyr,
            NButton: NButton,
            NButtonGroup: NButtonGroup,
            NIcon: NIcon,
            NInput: NInput,
            NSpin: NSpin,
            AlertCircleIcon: AlertCircleIcon,
            ChatBubbleIcon: ChatBubbleIcon,
            SendIcon: SendIcon,
            playerRef: playerRef,
            videoRef: videoRef,
            loading: loading,
            error: error,
            isDanmakuEnabled: isDanmakuEnabled,
            isDanmakuInputVisible: isDanmakuInputVisible,
            danmakuText: danmakuText,
            danmakuAreaRef: danmakuAreaRef,
            playerOptions: playerOptions,
            visibleDanmaku: visibleDanmaku,
            handleReady: handleReady,
            handleError: handleError,
            handleTimeUpdate: handleTimeUpdate,
            handlePlay: handlePlay,
            handlePause: handlePause,
            handleEnded: handleEnded,
            retry: retry,
            toggleDanmaku: toggleDanmaku,
            toggleDanmakuInput: toggleDanmakuInput,
            sendDanmaku: sendDanmaku,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=VideoPlayer.vue.js.map
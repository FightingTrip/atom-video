/**
 * @file components/business/library/playlist/index.ts
 * @description 播放列表相关组件的统一导出
 * @author Atom Video Team
 * @date 2025-04-23
 */

import PlaylistSelector from './PlaylistSelector.vue';
import SaveToPlaylistButton from './SaveToPlaylistButton.vue';

export { PlaylistSelector, SaveToPlaylistButton };

// 导出默认对象，包含所有组件
export default {
  PlaylistSelector,
  SaveToPlaylistButton,
};

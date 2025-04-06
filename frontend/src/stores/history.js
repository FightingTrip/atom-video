import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
export const useHistoryStore = defineStore('history', () => {
    // 状态
    const watchHistory = ref([]);
    const searchHistory = ref([]);
    const loading = ref(false);
    const error = ref(null);
    // 获取观看历史
    const getWatchHistory = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.get('/history/watch');
            watchHistory.value = response.data;
            return response.data;
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '获取观看历史失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 清除观看历史
    const clearWatchHistory = async () => {
        try {
            loading.value = true;
            error.value = null;
            await api.delete('/history/watch');
            watchHistory.value = [];
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '清除观看历史失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 从历史记录中移除视频
    const removeFromWatchHistory = async (videoId) => {
        try {
            loading.value = true;
            error.value = null;
            await api.delete(`/history/watch/${videoId}`);
            watchHistory.value = watchHistory.value.filter(v => v.id !== videoId);
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '移除视频失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 添加视频到观看历史
    const addToWatchHistory = async (videoId) => {
        try {
            loading.value = true;
            error.value = null;
            await api.post(`/history/watch/${videoId}`);
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '添加视频失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 获取搜索历史
    const getSearchHistory = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.get('/history/search');
            searchHistory.value = response.data;
            return response.data;
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '获取搜索历史失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 清除搜索历史
    const clearSearchHistory = async () => {
        try {
            loading.value = true;
            error.value = null;
            await api.delete('/history/search');
            searchHistory.value = [];
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '清除搜索历史失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 从搜索历史中移除关键词
    const removeFromSearchHistory = async (keyword) => {
        try {
            loading.value = true;
            error.value = null;
            await api.delete(`/history/search/${encodeURIComponent(keyword)}`);
            searchHistory.value = searchHistory.value.filter(k => k !== keyword);
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '移除关键词失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    // 添加关键词到搜索历史
    const addToSearchHistory = async (keyword) => {
        try {
            loading.value = true;
            error.value = null;
            await api.post(`/history/search/${encodeURIComponent(keyword)}`);
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : '添加关键词失败';
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    return {
        watchHistory,
        searchHistory,
        loading,
        error,
        getWatchHistory,
        clearWatchHistory,
        removeFromWatchHistory,
        addToWatchHistory,
        getSearchHistory,
        clearSearchHistory,
        removeFromSearchHistory,
        addToSearchHistory,
    };
});
//# sourceMappingURL=history.js.map
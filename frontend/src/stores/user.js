import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isLoading: false,
        error: null,
    }),
    getters: {
        isLoggedIn: state => !!state.user,
        username: state => state.user?.username || '',
        avatarUrl: state => state.user?.avatar || '',
        userId: state => state.user?.id || '',
        userRole: state => state.user?.role || '',
        isAdmin: state => state.user?.role === 'admin',
        isCreator: state => state.user?.role === 'creator' || state.user?.role === 'admin',
    },
    actions: {
        async fetchCurrentUser() {
            this.isLoading = true;
            this.error = null;
            try {
                this.user = await userService.getCurrentUser();
            }
            catch (error) {
                this.error = error;
                console.error('Failed to fetch current user:', error);
            }
            finally {
                this.isLoading = false;
            }
        },
        async updateProfile(data) {
            this.isLoading = true;
            this.error = null;
            try {
                this.user = await userService.updateProfile(data);
            }
            catch (error) {
                this.error = error;
                console.error('Failed to update profile:', error);
                throw error;
            }
            finally {
                this.isLoading = false;
            }
        },
        setUser(user) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
        setError(error) {
            this.error = error;
        },
        refreshToken() {
            const authStore = useAuthStore();
            return authStore.refreshToken();
        },
        async logout() {
            const authStore = useAuthStore();
            await authStore.logout();
            this.clearUser();
        },
    },
});
//# sourceMappingURL=user.js.map
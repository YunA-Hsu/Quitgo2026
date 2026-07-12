export const profileService = {
  /**
   * 更新大頭貼 (V1 先以 localStorage 模擬)
   */
  updateAvatar: async (avatarData: string): Promise<{ avatarUrl: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('userAvatar', avatarData);
        resolve({ avatarUrl: avatarData });
      }, 300);
    });
  },

  /**
   * 更新暱稱 (V1 先以 localStorage 模擬)
   */
  updateNickname: async (nickname: string): Promise<{ nickname: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('userNickname', nickname);
        resolve({ nickname });
      }, 300);
    });
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 清除登入相關資料
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userNickname');
        localStorage.removeItem('isLoggedIn');
        resolve();
      }, 300);
    });
  },
};

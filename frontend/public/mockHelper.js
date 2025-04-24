/**
 * 模拟数据辅助工具
 * 在浏览器控制台中使用
 */

// 全局辅助函数
window.enableMock = function() {
  localStorage.setItem('mock_mode', 'true');
  console.log('已启用模拟数据模式，正在刷新页面...');
  window.location.reload();
};

window.disableMock = function() {
  localStorage.setItem('mock_mode', 'false');
  console.log('已禁用模拟数据模式，正在刷新页面...');
  window.location.reload();
};

window.toggleMock = function() {
  const current = localStorage.getItem('mock_mode') === 'true';
  localStorage.setItem('mock_mode', String(!current));
  console.log(`已${!current ? '启用' : '禁用'}模拟数据模式，正在刷新页面...`);
  window.location.reload();
};

window.checkMockStatus = function() {
  const isMockMode = localStorage.getItem('mock_mode') === 'true';
  console.log('当前模拟数据模式状态:', isMockMode ? '已启用' : '已禁用');
  return isMockMode;
};

window.resetMockData = function() {
  localStorage.removeItem('mock_db_initialized');
  console.log('已重置模拟数据库，正在刷新页面...');
  window.location.reload();
};

// 自动执行检查
(function() {
  console.log('=== 模拟数据辅助工具已加载 ===');
  console.log('可用命令:');
  console.log('  window.enableMock() - 启用模拟数据');
  console.log('  window.disableMock() - 禁用模拟数据');
  console.log('  window.toggleMock() - 切换模拟数据状态');
  console.log('  window.checkMockStatus() - 检查模拟数据状态');
  console.log('  window.resetMockData() - 重置模拟数据库');
  
  const isMockMode = localStorage.getItem('mock_mode') === 'true';
  console.log('当前模拟数据模式状态:', isMockMode ? '已启用' : '已禁用');
})(); 
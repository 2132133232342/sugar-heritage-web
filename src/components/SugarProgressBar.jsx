import { useEffect, useState } from 'react';

/**
 * 全站底部糖稀进度条（带 10px 糖滴领头圆点）。
 * 设计要点：进度状态自持，独立订阅 scroll/resize，
 * 避免把高频滚动状态提升到 AppShell 造成整棵路由树重渲染与监听器反复重建。
 * 复用第 13 节 `.sugar-progress-bar / .sugar-progress-fill / .sugar-drop-head` 样式。
 */
export default function SugarProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
        const percent =
          maxScroll <= 1
            ? 100
            : Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        // 变化小于 0.2% 不触发重渲染，进一步降低开销
        setProgress((prev) => (Math.abs(prev - percent) < 0.2 ? prev : percent));
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sugar-progress-bar" aria-hidden="true">
      <div className="sugar-progress-fill" style={{ width: `${progress.toFixed(1)}%` }}>
        <span className="sugar-drop-head" />
      </div>
    </div>
  );
}

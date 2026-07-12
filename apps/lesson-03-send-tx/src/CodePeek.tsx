import { useState, useEffect } from 'react'

/**
 * CodePeek · 侧边抽屉版
 *
 * 交互设计：
 * - 闭合：屏幕右侧一个竖直 tab（"📄 源码"），点击展开
 * - 展开：右侧半屏抽屉，与主内容左右并排，中英对照式
 * - 主内容用 margin-right 让位，避免被挡；抽屉自身垂直滚动，不影响主内容
 *
 * 用法：<CodePeek files={{ 'App.tsx': appSrc }} />
 *
 * 关键：源码通过 Vite `?raw` import 进来，永远和实际跑的代码一致。
 */
export default function CodePeek({
  files,
  defaultOpen = false,
}: {
  files: Record<string, string>
  defaultOpen?: boolean
}) {
  const names = Object.keys(files)
  const [active, setActive] = useState(names[0])
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const DRAWER_WIDTH = 'min(48vw, 720px)'

  // 打开抽屉时，给 body 加一层 padding-right，让主内容让位
  // 这样即使主内容用了 margin: auto，也不会被抽屉遮住
  useEffect(() => {
    if (open) {
      document.body.style.transition = 'padding-right 0.25s ease'
      document.body.style.paddingRight = DRAWER_WIDTH
    } else {
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.paddingRight = ''
    }
  }, [open])

  const copy = async () => {
    await navigator.clipboard.writeText(files[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const code = files[active]
  const lines = code.split('\n')

  return (
    <>
      {/* 闭合态：右侧固定 tab，垂直文字，点击展开 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '30%',
            zIndex: 100,
            padding: '14px 10px',
            background: '#18181b',
            color: '#fafafa',
            border: 'none',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            fontSize: 13,
            writingMode: 'vertical-rl',
            letterSpacing: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: 'system-ui',
          }}
          title="查看本页源码"
        >
          📄 查看源码
        </button>
      )}

      {/* 展开态：右侧抽屉 */}
      {open && (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            zIndex: 100,
            background: '#fafafa',
            borderLeft: '1px solid #e4e4e7',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui',
          }}
        >
          {/* 顶部：标题 + tab + 关闭 */}
          <header
            style={{
              padding: '12px 16px 0',
              background: '#f4f4f5',
              borderBottom: '1px solid #e4e4e7',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <strong style={{ fontSize: 14 }}>📄 本页源码</strong>
              <span style={{ fontSize: 11, color: '#71717a' }}>
                Vite <code>?raw</code> · 实时同步
              </span>
              <button
                onClick={copy}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  border: '1px solid #d4d4d8',
                  borderRadius: 4,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {copied ? '✓ 已复制' : '📋 复制'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '4px 10px',
                  border: '1px solid #d4d4d8',
                  borderRadius: 4,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
                title="关闭"
              >
                ✕ 关闭
              </button>
            </div>
            {/* 文件 tab */}
            <div style={{ display: 'flex', gap: 4 }}>
              {names.map((n) => (
                <button
                  key={n}
                  onClick={() => setActive(n)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: n === active ? '#fff' : 'transparent',
                    borderRadius: '6px 6px 0 0',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: n === active ? 600 : 400,
                    color: n === active ? '#18181b' : '#71717a',
                    borderTop: n === active ? '1px solid #e4e4e7' : '1px solid transparent',
                    borderLeft: n === active ? '1px solid #e4e4e7' : '1px solid transparent',
                    borderRight: n === active ? '1px solid #e4e4e7' : '1px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </header>

          {/* 代码区：强制左对齐 + 编辑器视觉 */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              background: '#fafafa',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, "Fira Code", monospace',
              fontSize: 12.5,
              lineHeight: 1.55,
              textAlign: 'left',
            }}
          >
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <tbody>
                {lines.map((ln, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        userSelect: 'none',
                        textAlign: 'right',
                        padding: '0 10px 0 12px',
                        color: '#a1a1aa',
                        fontVariantNumeric: 'tabular-nums',
                        width: 44,
                        minWidth: 44,
                        verticalAlign: 'top',
                        borderRight: '1px solid #e4e4e7',
                        background: '#f4f4f5',
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        padding: '0 12px 0 14px',
                        whiteSpace: 'pre',
                        verticalAlign: 'top',
                        textAlign: 'left',
                        color: '#18181b',
                      }}
                    >
                      {ln || ' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer
            style={{
              padding: '8px 14px',
              background: '#f4f4f5',
              borderTop: '1px solid #e4e4e7',
              fontSize: 11,
              color: '#71717a',
            }}
          >
            💡 改文件保存 → HMR 推 → 这里也自动更新
          </footer>
        </aside>
      )}
    </>
  )
}

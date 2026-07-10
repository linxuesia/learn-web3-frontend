import { useState } from 'react'

/**
 * CodePeek · 就地查看当前页面的源码
 *
 * 用法：<CodePeek files={{ 'App.tsx': appSrc, 'wagmi.ts': wagmiSrc }} />
 *
 * 关键：源码字符串通过 Vite 的 `?raw` 特性 import 进来，
 * 这样看到的永远是"此刻真的在跑的代码"，改代码不需要同步改文档。
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

  const copy = async () => {
    await navigator.clipboard.writeText(files[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const code = files[active]
  const lines = code.split('\n')

  return (
    <section
      style={{
        marginTop: 24,
        border: '1px solid #e4e4e7',
        borderRadius: 8,
        overflow: 'hidden',
        fontFamily: 'system-ui',
      }}
    >
      <header
        style={{
          padding: '10px 14px',
          background: '#f4f4f5',
          borderBottom: open ? '1px solid #e4e4e7' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: 14 }}>{open ? '▼' : '▶'}</span>
        <strong style={{ fontSize: 14 }}>📄 查看本页源码</strong>
        <span style={{ fontSize: 12, color: '#71717a', marginLeft: 'auto' }}>
          {open ? '点收起' : '点展开对比学习'}
        </span>
      </header>

      {open && (
        <>
          <nav
            style={{
              display: 'flex',
              gap: 4,
              padding: '8px 8px 0',
              background: '#fafafa',
              borderBottom: '1px solid #e4e4e7',
              alignItems: 'center',
            }}
          >
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
            <button
              onClick={copy}
              style={{
                marginLeft: 'auto',
                marginBottom: 4,
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
          </nav>

          <div
            style={{
              maxHeight: 480,
              overflow: 'auto',
              background: '#fafafa',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.55,
            }}
          >
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                        width: 42,
                        verticalAlign: 'top',
                      }}
                    >
                      {i + 1}
                    </td>
                    <td style={{ padding: '0 12px 0 0', whiteSpace: 'pre', verticalAlign: 'top' }}>
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
              background: '#fafafa',
              borderTop: '1px solid #e4e4e7',
              fontSize: 11,
              color: '#71717a',
            }}
          >
            💡 这段代码通过 Vite <code>?raw</code> 特性从磁盘实时读取，
            永远和你正在跑的版本一致。改文件保存 → HMR 推 → 这里也自动更新。
          </footer>
        </>
      )}
    </section>
  )
}

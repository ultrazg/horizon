# 项目级指令（用户偏好）

这些是用户明确让 Claude 记住、并在本项目内长期生效的规则。

## Git Commit

- **Commit message 要简短**：标题一行直击变更要点；正文可省略；若需要列点，控制在 3 条以内。避免冗长的列表式描述。
- **必须带 Co-Authored-By trailer**：涉及 Claude 编写并提交代码时，在 commit message 末尾追加 `Co-Authored-By: Claude <noreply@anthropic.com>。
- 不修改 git config（不动 `user.name` / `user.email`），仅在 commit message 里加 trailer。
- HEREDOC 提交格式示例：

  ```bash
  git commit -m "$(cat <<'EOF'
  feat: 简短标题
  
  Co-Authored-By: Claude <noreply@anthropic.com>
  EOF
  )"
  ```

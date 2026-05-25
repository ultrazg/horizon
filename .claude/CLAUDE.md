# 项目级指令（用户偏好）

这些是用户明确让 Claude 记住、并在本项目内长期生效的规则。

## Git Commit

- **Commit message 要简短**：标题一行直击变更要点；正文可省略；若需要列点，控制在 3 条以内。避免冗长的列表式描述。
- **必须带类别（scope）**：标题格式为 `type(scope): summary`，scope 取自改动所在区域，例如 `feat(ui)`、`fix(config)`、`fix(bridge)`、`style(ui)`、`refactor(frontend)`、`docs`、`build`、`ci` 等。多区域改动时挑主导 scope，不要堆叠；除非用户要求拆分，否则不要拆 commit。
- **必须带 Co-Authored-By trailer**：涉及 Claude 编写并提交的代码，在 commit message 末尾追加 `Claude Opus 4.7 (1M context) <noreply@anthropic.com>`。
- 不修改 git config（不动 `user.name` / `user.email`），仅在 commit message 里加 trailer。
- HEREDOC 提交格式示例：

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(ui): 简短标题
  
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  EOF
  )"
  ```

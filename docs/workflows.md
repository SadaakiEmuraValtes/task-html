# GitHub Actions ワークフロー ドキュメント

このドキュメントでは、`.github/workflows` ディレクトリに含まれる GitHub Actions ワークフローの設定について説明します。

---

## 1. Claude Code (`claude.yml`)

### 概要

issue やプルリクエストのコメントで `@claude` とメンションすることで、Claude AI に自動的にタスクを依頼できるワークフローです。

### トリガー条件

| イベント | 条件 |
|---|---|
| `issue_comment` | コメント本文に `@claude` が含まれる場合 |
| `pull_request_review_comment` | レビューコメント本文に `@claude` が含まれる場合 |
| `pull_request_review` | レビュー本文に `@claude` が含まれる場合 |
| `issues` | issue 本文またはタイトルに `@claude` が含まれる場合（opened / assigned） |

### パーミッション

| 権限 | レベル |
|---|---|
| `contents` | read |
| `pull-requests` | read |
| `issues` | read |
| `id-token` | write |
| `actions` | read（CI 結果の読み取り用） |

### 主な設定

- **使用アクション**: `anthropics/claude-code-action@v1`
- **認証**: `CLAUDE_CODE_OAUTH_TOKEN` シークレットを使用
- **追加権限**: `actions: read`（PR の CI 結果を読み取るために設定）

### カスタマイズ可能な項目

- `prompt`: Claude に渡すカスタムプロンプト（省略時はコメント内容が使用される）
- `claude_args`: Claude の動作を制御する追加引数（例: `--allowed-tools Bash(gh pr:*)`）

### 利用方法

issue またはプルリクエストのコメントに `@claude` を含めて投稿すると、Claude が自動的に内容を解析してタスクを実行します。

---

## 2. Claude Code Review (`claude-code-review.yml`)

### 概要

プルリクエストが作成・更新されたときに、Claude AI が自動でコードレビューを行うワークフローです。

### トリガー条件

以下のプルリクエストイベントで実行されます。

| イベント | 説明 |
|---|---|
| `opened` | PR が新規作成されたとき |
| `synchronize` | PR に新しいコミットが追加されたとき |
| `ready_for_review` | ドラフト PR がレビュー可能になったとき |
| `reopened` | クローズされた PR が再オープンされたとき |

### パーミッション

| 権限 | レベル |
|---|---|
| `contents` | read |
| `pull-requests` | read |
| `issues` | read |
| `id-token` | write |

### 主な設定

- **使用アクション**: `anthropics/claude-code-action@v1`
- **認証**: `CLAUDE_CODE_OAUTH_TOKEN` シークレットを使用
- **プラグイン**: `code-review@claude-code-plugins`（`https://github.com/anthropics/claude-code.git` から取得）
- **プロンプト**: `/code-review:code-review {リポジトリ}/pull/{PR番号}`

### カスタマイズ可能な項目

- `if` 条件を追加することで、特定の PR 作成者のみにレビューを限定できます（例: 外部コントリビューターや初回コントリビューターのみ）
- `paths` を設定することで、特定のファイルが変更された場合のみワークフローを実行できます（例: `src/**/*.ts`）

---

## 必要なシークレット

| シークレット名 | 説明 |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code の認証に使用する OAuth トークン。両ワークフローで共通して使用。 |

---

## 参考リンク

- [claude-code-action リポジトリ](https://github.com/anthropics/claude-code-action)
- [使用方法ドキュメント](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md)
- [Claude CLI リファレンス](https://code.claude.com/docs/en/cli-reference)

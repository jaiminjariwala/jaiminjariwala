# All-time coding hours

The daily `Update all-time coding stats` GitHub Action reads WakaTime's `all_time` language totals and updates only the `waka` section in README.md. It displays language, hours/minutes, colored progress blocks and percentage, plus total tracked time. Guestbook and coding-stat updates share a concurrency group to prevent overlapping README edits.

## One-time activation

1. Create your account at https://wakatime.com. Install the official WakaTime extension in Cursor: https://wakatime.com/cursor. Review its tracking/privacy settings before enabling it. It collects metadata such as project names and file paths, not source code.
2. Copy your API key privately from https://wakatime.com/settings/api-key. Enter it into Cursor's **WakaTime API Key** command.
3. Open https://github.com/jaiminjariwala/jaiminjariwala/settings/secrets/actions/new. Set the name to `WAKATIME_API_KEY` and paste the key in the secret field. Never put it in chat, a commit, or README.
4. After your WakaTime dashboard shows activity, open https://github.com/jaiminjariwala/jaiminjariwala/actions/workflows/wakatime.yml and choose **Run workflow**. It also refreshes daily at 10:23 UTC.

Without a secret the workflow skips the update and leaves README untouched. There are no placeholder or estimated hours. All-time means available recorded history, not hours before tracking began. WakaTime may calculate long-range statistics asynchronously on the first request; rerun later if the initial chart is not ready.

Only aggregate language hours are published. The API key stays in GitHub Actions secrets and is supplied to the approved, commit-pinned athul/waka-readme action during its run. This workflow does not install tracking software or change your editor's telemetry settings. No extra GitHub personal access token is required.

References: https://wakatime.com/developers#stats and https://github.com/athul/waka-readme.

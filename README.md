# Serverless kernel releaser ![build](https://github.com/mishamyrt/serverless-kernel-releaser/workflows/build/badge.svg?branch=master)

The function for Yandex.Сloud that allows you to create kernel releases via Telegram.

## Setup

### Requirements

* Created Yandex.Cloud function
* Created Telegram Bot

### Environment

For the function to work it is necessary to set environment variables:

* `GITHUB_PAT` — GitHub personal access token. Must have read and action permissions and allowed to create releases.
* `OWNER` — Repository owner username. Should be same as Telegram username, because other users will be ignored.
* `REPOSITORY` — Repository name.
* `BRANCH` — Trunk branch name.
* `KERNEL_NAME` — Kernel name. Shoud be lowercase, because name will be capitalized.
* `SUPPORT_URL` — Link to a place where users can help resolve issues.
* `PROD_GIST_ID` — Production release Gist ID.
* `BETA_GIST_ID` — Beta release Gist ID.

### Callback

Set function as webhook for the bot.

```sh
curl -F "url=https://functions.yandexcloud.net/$FUNCTION_ID" "https://api.telegram.org/bot$BOT_ID/setWebhook"
```

## Using

Open chat with bot and write something like this using Markdown:

```
1.5-beta2

Some description

* Important feature
* Another feature
```

First line should be version. When `beta` word is found in version name, function marks release as prerelease.
---
name: Press
progress: 50
status: wip
startDate: 2020-05-01
references:
  - development/web
  - database/mysql
  - database/redis
  - language/typescript
  - technology/wordpress
  - technology/graphql
summary:
  format: mdx
  raw: CMS used to build this and other public websites.
---

`Press` is the core library used for to make this website happen. The library reads from different sources ([](technology/wordpress) or filesystem for now) and serves a [](technology/graphql) server to get all the content. It also provides some tools to transform the media (resize, optimize, etc.).

It's built using some `design patterns` that allow additions of new sources in the future. It's private for now, but I want to get to a more stable phase and make it public.

## Update

The new website is also using `Press`, but following a completely new approach. It does not use [](technology/graphql) at all.

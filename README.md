[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![downloads][downloads]][downloads-url]

# mongoose-search

Mongoose schema plugin to search on multiple fields. Supports:

- Search on ObjectID
- Regex search, or custom search
- [MongoDB text indexes](https://docs.mongodb.com/manual/core/index-text/) search (MongoDB >= 2.4, mongoose >=3.6).

There are already [multiple plugins](https://www.npmtrends.com/mongoose-partial-search-vs-mongoose-search-plugin-vs-mongoose-searchable-vs-mongoose-partial-full-search-vs-mongoose-text-search-vs-mongoose-fulltext-plugin-vs-mongoose-fulltext) to manage search, but most of them are handling too much (like filtering or pagination). This plugin only build the query related to a fulltext search, and let other plugins handle their part (pagination, ...).

## Installation

```sh
$ npm install @cme-pro/mongoose-search --save
```

or

```sh
$ yarn add @cme-pro/mongoose-search
```

## Overview

### Adding plugin to the schema

```js
const mongoose = require("mongoose");
const mongooseSearch = require("@cme-pro/mongoose-search");
const { Schema } = mongoose;

const BlogPost = new Schema({
  title: { type: String, searchable: true },
  body: { type: String, searchable: (q: string) => new RegExp(`${q}`) },
  excerpt: { type: String }
});

BlogPost.index({ title: "text", body: "text" });

const BlogPostModel = mongoose.model("Post", BlogPost);
```

### Usage

Simple search:

```js
const query = BlogPostModel.searchQuery("reactjs");

/**
  query = {
      $or: [
        {
          $text: { $search: "reactjs" }
        },
        {
          title: /^reactjs/
        },
        {
          description: /reactjs/
        }
      ]
    }
*/
```

Search on ObjectID:

```js
const query = BlogPostModel.searchQuery("5cfa2debabe4d93a5b35897c");

/**
  query = { $_id_: "5cfa2debabe4d93a5b35897c" }
*/
```

Custom search

```js
const query = BlogPostModel.searchQuery("reactjs", { fields: { title: true } });

/**
  query = {
      $or: [
        {
          $text: { $search: "reactjs" }
        },
        {
          title: /^reactjs/
        }
      ]
    }
*/
```

[npm]: https://img.shields.io/npm/v/@cme-pro/mongoose-search.svg
[npm-url]: https://npmjs.com/package/@cme-pro/mongoose-search
[node]: https://img.shields.io/node/v/@cme-pro/mongoose-search.svg
[node-url]: https://nodejs.org
[tests]: http://img.shields.io/travis/cme-pro/mongoose-search.svg
[tests-url]: https://travis-ci.org/cme-pro/mongoose-search
[downloads]: https://img.shields.io/npm/dt/@cme-pro/mongoose-search.svg
[downloads-url]: https://npmjs.com/package/@cme-pro/mongoose-search

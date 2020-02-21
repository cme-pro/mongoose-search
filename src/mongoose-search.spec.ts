/* eslint-env jest */
import mongoose from "mongoose";
import mongooseSearch from "./mongoose-search";

const { Schema } = mongoose;

let sampleId = mongoose.Types.ObjectId().toString();
let Sample: any;

describe("Plugin mongooseSearch", () => {
  beforeAll(async () => {
    const schema = new Schema(
      {
        title: { type: String, searchable: true },
        description: {
          type: String,
          searchable: (q: string) => new RegExp(`${q}`)
        },
        excerpt: { type: String }
      },
      {
        strict: "throw"
      }
    );

    schema.index({ title: "text", description: "text" });

    schema.plugin(mongooseSearch, {});
    Sample = mongoose.model("Sample", schema);
  });

  test("should be able to search ObjectID", async () => {
    expect(Sample.searchQuery("5cfa2debabe4d93a5b35897c")).toEqual({
      _id: "5cfa2debabe4d93a5b35897c"
    });
  });

  test("should be able to search a string", async () => {
    expect(Sample.searchQuery("reactjs")).toEqual({
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
    });
  });

  test("should be able to search a string on a specific string", async () => {
    expect(Sample.searchQuery("reactjs", { fields: { title: true } })).toEqual({
      $or: [
        {
          $text: { $search: "reactjs" }
        },
        {
          title: /^reactjs/
        }
      ]
    });
  });
});

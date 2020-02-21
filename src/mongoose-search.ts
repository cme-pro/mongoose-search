import { Schema } from "mongoose";
import { ObjectID } from "bson";

interface SearchQueryOptions {
  fields?: object;
}

export default function mongooseSearch(schema: any): void {
  schema.statics.searchQuery = function(
    str: string,
    options: SearchQueryOptions
  ) {
    let query = {};

    if (ObjectID.isValid(str)) {
      query = { _id: str };
      return query;
    }
    const indexFields: any = [];
    const fulltextIndexes = schema
      .indexes()[0]
      .filter((o: object) => Object.values(o).includes("text"));

    if (fulltextIndexes && fulltextIndexes.length) {
      indexFields.push({ $text: { $search: str } });
    }

    let searchableFields: any = options && options.fields;
    if (!searchableFields) {
      searchableFields = {};
      schema.eachPath((path: string) => {
        if (
          schema.paths[path].options &&
          schema.paths[path].options.searchable
        ) {
          const searchable = schema.paths[path].options.searchable;
          searchableFields[path] = searchable;
        }
      });
    }

    Object.keys(searchableFields).map(key => {
      indexFields.push({
        [key]:
          searchableFields[key] === true
            ? new RegExp(`^${str}`)
            : searchableFields[key](str)
      });
    });

    query = indexFields.length === 1 ? indexFields[0] : { $or: indexFields };
    return query;
  };
}

import { Schema } from 'mongoose';
import { ObjectID } from 'bson';

interface SearchQueryOptions {
  fields?: object;
}

export default function mongooseSearch(schema: Schema): void {
  schema.statics.searchQuery = (str: string, options: SearchQueryOptions) => {
    let query = {};

    if (ObjectID.isValid(str)) {
      query = { _id: str };
      return query;
    }
    const indexFields: any = [];

    const fulltextIndexes = schema
      .indexes()
      .map((index: any[]) => index.filter((o: any[]) => Object.values(o).includes('text')))
      .filter((index: any[]) => index.length);

    if (fulltextIndexes && fulltextIndexes.length) {
      indexFields.push({ $text: { $search: str } });
    }

    let searchableFields: any = options && options.fields;
    if (!searchableFields) {
      searchableFields = {};
      schema.eachPath((path: string) => {
        // @ts-ignore
        const schemaPaths: any = schema.paths;

        if (schemaPaths[path].options && schemaPaths[path].options.searchable) {
          const searchable = schemaPaths[path].options.searchable;
          searchableFields[path] = searchable;
        }
      });
    }

    Object.keys(searchableFields).map((key: string) => {
      indexFields.push({
        [key]: searchableFields[key] === true ? new RegExp(`^${str}`) : searchableFields[key](str),
      });
    });

    if (indexFields.length) {
      return indexFields.length === 1 ? indexFields[0] : { $or: indexFields };
    }
    return {};
  };
}

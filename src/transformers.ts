import {
  type CreateIndexNode,
  type DropIndexNode,
  OperationNodeTransformer,
  type TableNode,
} from "kysely";

export interface PrefixOperationNodeTransformerOptions {
  prefix: string;
  exclude?: string[];
}

export type TablePrefixOperationNodeTransformerOptions =
  PrefixOperationNodeTransformerOptions;

export type IndexPrefixOperationNodeTransformerOptions =
  PrefixOperationNodeTransformerOptions;

export class TablePrefixOperationNodeTransformer extends OperationNodeTransformer {
  readonly #prefix: string;

  readonly #exclude: string[];

  constructor(options: TablePrefixOperationNodeTransformerOptions) {
    super();

    this.#prefix = options.prefix;
    this.#exclude = options.exclude ?? [];
  }

  protected transformTable(node: TableNode): TableNode {
    const transformedNode = super.transformTable(node);

    return {
      ...transformedNode,
      table: {
        ...transformedNode.table,
        identifier: {
          ...transformedNode.table.identifier,
          name: this.#exclude.includes(transformedNode.table.identifier.name)
            ? transformedNode.table.identifier.name
            : `${this.#prefix}_${transformedNode.table.identifier.name}`,
        },
      },
    };
  }
}

export class IndexPrefixOperationNodeTransformer extends OperationNodeTransformer {
  readonly #prefix: string;

  readonly #exclude: string[];

  constructor(options: IndexPrefixOperationNodeTransformerOptions) {
    super();

    this.#prefix = options.prefix;
    this.#exclude = options.exclude ?? [];
  }

  protected transformCreateIndex(node: CreateIndexNode): CreateIndexNode {
    const transformedNode = super.transformCreateIndex(node);

    return {
      ...transformedNode,
      name: {
        ...transformedNode.name,
        name: this.#exclude.includes(transformedNode.name.name)
          ? transformedNode.name.name
          : `${this.#prefix}_${transformedNode.name.name}`,
      },
    };
  }

  protected transformDropIndex(node: DropIndexNode): DropIndexNode {
    const transformedNode = super.transformDropIndex(node);

    return {
      ...transformedNode,
      name: {
        ...transformedNode.name,
        identifier: {
          ...transformedNode.name.identifier,
          name: this.#exclude.includes(transformedNode.name.identifier.name)
            ? transformedNode.name.identifier.name
            : `${this.#prefix}_${transformedNode.name.identifier.name}`,
        },
      },
    };
  }
}

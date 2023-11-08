import { OperationNodeTransformer, type TableNode } from "kysely";

export interface TablePrefixOperationNodeTransformerOptions {
  prefix: string;
  exclude?: string[];
}

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

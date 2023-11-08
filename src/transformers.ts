import { OperationNodeTransformer, type TableNode } from "kysely";

export class PrefixOperationNodeTransformer extends OperationNodeTransformer {
  readonly #prefix: string;

  constructor(prefix: string) {
    super();

    this.#prefix = prefix;
  }

  protected transformTable(node: TableNode): TableNode {
    const transformedNode = super.transformTable(node);

    return {
      ...transformedNode,
      table: {
        ...transformedNode.table,
        identifier: {
          ...transformedNode.table.identifier,
          name: `${this.#prefix}_${transformedNode.table.identifier.name}`,
        },
      },
    };
  }
}

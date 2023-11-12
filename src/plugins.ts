import {
  type KyselyPlugin,
  type PluginTransformQueryArgs,
  type PluginTransformResultArgs,
} from "kysely";

import {
  IndexPrefixOperationNodeTransformer,
  type IndexPrefixOperationNodeTransformerOptions,
  TablePrefixOperationNodeTransformer,
  type TablePrefixOperationNodeTransformerOptions,
} from "./transformers";

export type TablePrefixPluginOptions =
  TablePrefixOperationNodeTransformerOptions;

export class TablePrefixPlugin implements KyselyPlugin {
  readonly #prefixTransformer: TablePrefixOperationNodeTransformer;

  constructor(options: TablePrefixPluginOptions) {
    this.#prefixTransformer = new TablePrefixOperationNodeTransformer(options);
  }

  transformQuery(args: PluginTransformQueryArgs) {
    return this.#prefixTransformer.transformNode(args.node);
  }

  async transformResult(args: PluginTransformResultArgs) {
    return args.result;
  }
}

export type IndexPrefixPluginOptions =
  IndexPrefixOperationNodeTransformerOptions;

export class IndexPrefixPlugin implements KyselyPlugin {
  readonly #prefixTransformer: IndexPrefixOperationNodeTransformer;

  constructor(options: IndexPrefixPluginOptions) {
    this.#prefixTransformer = new IndexPrefixOperationNodeTransformer(options);
  }

  transformQuery(args: PluginTransformQueryArgs) {
    return this.#prefixTransformer.transformNode(args.node);
  }

  async transformResult(args: PluginTransformResultArgs) {
    return args.result;
  }
}

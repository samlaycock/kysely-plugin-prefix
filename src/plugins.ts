import {
  type KyselyPlugin,
  type PluginTransformQueryArgs,
  type PluginTransformResultArgs,
} from "kysely";

import { PrefixOperationNodeTransformer } from "./transformers";

export class TablePrefixPlugin implements KyselyPlugin {
  readonly #prefixTransformer: PrefixOperationNodeTransformer;

  constructor(prefix: string) {
    this.#prefixTransformer = new PrefixOperationNodeTransformer(prefix);
  }

  transformQuery(args: PluginTransformQueryArgs) {
    return this.#prefixTransformer.transformNode(args.node);
  }

  async transformResult(args: PluginTransformResultArgs) {
    return args.result;
  }
}

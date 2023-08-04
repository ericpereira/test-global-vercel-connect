import { EventBus, Logger, PluginCommonModule, VendurePlugin, Type } from '@vendure/core';
import { OnApplicationBootstrap, Inject } from '@nestjs/common';
import { VercelConnectResolver } from './resolver';
import { VercelConnectService } from './service';
import { VercelDeploy } from './entities/vercel-deploy.entity';
import { VercelDeploymentWorker } from './workers/building-vercel';
import { shopApiExtensions } from './schema/shop.schema';
import { TemplateSelectedEvent } from './events/template-selected-event';
import { CreateShopEvent } from './events/shop-event';
import { VercelPluginOptions } from './types';
import { VERCEL_PLUGIN_OPTIONS } from './constants';

@VendurePlugin({
  compatibility: "^2.0.5",
  entities: [VercelDeploy],
  imports: [PluginCommonModule],
  providers: [{ provide: VERCEL_PLUGIN_OPTIONS, useFactory: () => VercelConnectPlugin.options }, VercelConnectService, VercelDeploymentWorker],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [VercelConnectResolver],
  }
})
export class VercelConnectPlugin implements OnApplicationBootstrap {
  public static options: VercelPluginOptions;

  constructor(
    private eventBus: EventBus,
    private vercelConnectService: VercelConnectService,
    @Inject(VERCEL_PLUGIN_OPTIONS) private options: VercelPluginOptions,
  ) { }

  async onApplicationBootstrap() {
    this.channelEvent();
    this.layoutEvent();
  }

  /**
   * Set the plugin options.
   */
  static init(options: VercelPluginOptions): Type<VercelConnectPlugin> {
    this.options = options;
    return VercelConnectPlugin;
  }

  private layoutEvent() {
    this.eventBus.ofType(TemplateSelectedEvent).subscribe(async (event) => {
      Logger.info(`Channel ${event.ctx.channel.token} template path ${event.path}`, `TemplateSelectedEvent`);

      this.vercelConnectService.deploy(event.ctx,
        event.ctx.channel.code, //nome da loja
        event.ctx.channel.token,
        event.path //path do template
      );
    });
  }

  //Generate default template
  private channelEvent() {
    this.eventBus.ofType(CreateShopEvent).subscribe(async (event) => {
      this.vercelConnectService.deploy(event.ctx,
        event.shopName, // shore name
        event.ctx.channel.token,
        'simple-store' //path do template
      );
    });
  }
}
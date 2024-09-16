import type { ActionHandler, ActionSchema, EventSchema, EventSchemaHandler, ServiceMethod } from "./service";
import type { CallingOptions } from "./service-broker";
import type Service from "./service";
import type ServiceBroker from "./service-broker";
import Transporters from "./transporters";
import * as Transit from "./transit";

declare namespace MiddlewareHandler {
	export type CallMiddlewareHandler = (
		actionName: string,
		params: any,
		opts: CallingOptions
	) => Promise<any>;

	export interface Middleware {
		name?: string;
		created?: (broker: ServiceBroker) => void;
		localAction?: (next: ActionHandler, action: ActionSchema) => ActionHandler;
		remoteAction?: (next: ActionHandler, action: ActionSchema) => ActionHandler;
		localEvent?: (next: EventSchemaHandler, event: EventSchema) => EventSchemaHandler;
		remoteEvent?: (next: EventSchemaHandler, event: EventSchema) => EventSchemaHandler;
		localMethod?: (next: ServiceMethod, method: ServiceMethod) => ServiceMethod;
		createService?: (next: ServiceBroker['createService']) => ServiceBroker['createService'];
		registerLocalService?: (next: ServiceBroker['registerLocalService']) => ServiceBroker['registerLocalService'];
		destroyService?: (next: ServiceBroker['destroyService']) => ServiceBroker['destroyService'];
		call?: (next: ServiceBroker['call']) => ServiceBroker['call'];
		mcall?: (next: ServiceBroker['mcall']) => ServiceBroker['mcall'];
		emit?: (next: ServiceBroker['emit']) => ServiceBroker['emit'];
		broadcast?: (next: ServiceBroker['broadcast']) => ServiceBroker['broadcast'];
		broadcastLocal?: (next: ServiceBroker['broadcastLocal']) => ServiceBroker['broadcastLocal'];
		serviceCreating?: (service: Service, schema: Service.Schema) => void;
		serviceCreated?: (service: Service) => void;
		serviceStarting?: (service: Service) => Promise<void>;
		serviceStarted?: (service: Service) => Promise<void>;
		serviceStopping?: (service: Service) => Promise<void>;
		serviceStopped?: (service: Service) => Promise<void>;
		starting?: (broker: ServiceBroker) => Promise<void>;
		started?: (broker: ServiceBroker) => Promise<void>;
		stopping?: (broker: ServiceBroker) => Promise<void>;
		stopped?: (broker: ServiceBroker) => Promise<void>;
		transitPublish?(next: Transit['publish']): Transit['publish'];
		transitMessageHandler?(next: Transit['messageHandler']): Transit['messageHandler'];
		transporterSend?(next: Transporters.Base['send']): Transporters.Base['send'];
		transporterReceive?(next: Transporters.Base['receive']): Transporters.Base['receive'];
		newLogEntry?(type: string, args: unknown[], bindings: unknown): void;
	}

	export type MiddlewareInit = (broker: ServiceBroker) => Middleware;
	export interface MiddlewareCallHandlerOptions {
		reverse?: boolean;
	}
}

declare class MiddlewareHandler {
	broker: ServiceBroker;
	list: MiddlewareHandler.Middleware[];
	registeredHooks: Record<string, Function>;

	constructor(broker: ServiceBroker);

	add(mw: string | MiddlewareHandler.Middleware | MiddlewareHandler.MiddlewareInit): void;

	wrapHandler(method: string, handler: Function, def: ActionSchema): typeof handler;

	callHandlers(
		method: string,
		args: any[],
		opts?: MiddlewareHandler.MiddlewareCallHandlerOptions
	): Promise<void>;

	callSyncHandlers(
		method: string,
		args: any[],
		opts?: MiddlewareHandler.MiddlewareCallHandlerOptions
	): any[];

	count(): number;

	wrapMethod(
		method: string,
		handler: Function,
		bindTo?: any,
		opts?: MiddlewareHandler.MiddlewareCallHandlerOptions
	): typeof handler;
}
export = MiddlewareHandler;

/*
 * Copyright 2021 Lightbend Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as protobuf from 'protobufjs';
import * as grpc from '@grpc/grpc-js';
/**
 * <p>The Kalix module.</p>
 */
declare module "@kalix-io/kalix-javascript-sdk" {
    namespace Action {
        /**
         * <p>Context for an action command.</p>
         * @property cancelled - <p>Whether the client is still connected.</p>
         * @property metadata - <p>The metadata associated with the command.</p>
         */
        interface ActionCommandContext extends CommandContext {
            /**
             * <p>Write a message.</p>
             * @param message - <p>The protobuf message to write.</p>
             * @param [metadata] - <p>The metadata associated with the message.</p>
             */
            write(message: any, metadata?: Metadata): void;
            /**
             * <p>Register an event handler.</p>
             * @param eventType - <p>The type of the event.</p>
             * @param callback - <p>The callback to handle the event.</p>
             */
            on(eventType: string, callback: (...params: any[]) => any): void;
        }
        /**
         * <p>Context for a unary action command.</p>
         */
        interface UnaryCommandContext extends Action.ActionCommandContext {
        }
        /**
         * <p>Context for a streamed in action command.</p>
         */
        interface StreamedInCommandContext extends Action.StreamedInContext, Action.ActionCommandContext {
            metadata: Metadata;
        }
        /**
         * <p>Context for a streamed out action command.</p>
         */
        interface StreamedOutCommandContext extends Action.StreamedOutContext {
        }
        /**
         * <p>Context for a streamed action command.</p>
         */
        interface StreamedCommandContext extends Action.StreamedInContext, Action.StreamedOutContext {
            metadata: Metadata;
        }
        /**
         * <p>Context for an action command that returns a streamed message out.</p>
         */
        interface StreamedOutContext extends Action.ActionCommandContext {
            /**
             * <p>Send a reply</p>
             * @param reply - <p>The reply to send</p>
             */
            reply(reply: replies.Reply): void;
            /**
             * <p>Terminate the outgoing stream of messages.</p>
             */
            end(): void;
        }
        /**
         * <p>Context for an action command that handles streamed messages in.</p>
         */
        interface StreamedInContext extends Action.ActionCommandContext {
            /**
             * <p>Cancel the incoming stream of messages.</p>
             */
            cancel(): void;
        }
        /**
         * <p>Options for an action.</p>
         */
        type options = {
            /**
             * <p>The directories to include when looking up imported protobuf files.</p>
             * @defaultValue ["."]
             */
            includeDirs?: string[];
            /**
             * <p>request headers to be forwarded as metadata to the action</p>
             * @defaultValue []
             */
            forwardHeaders?: string[];
        };
        /**
         * <p>A unary action command handler.</p>
         * @param command - <p>The command message, this will be of the type of the gRPC service call input type.</p>
         * @param context - <p>The command context.</p>
         */
        type unaryCommandHandler = (command: any, context: Action.UnaryCommandContext) => undefined | any | Promise<any> | replies.Reply;
        /**
         * <p>A streamed in action command handler.</p>
         * @param context - <p>The command context.</p>
         */
        type streamedInCommandHandler = (context: Action.StreamedInCommandContext) => undefined | any | Promise<any>;
        /**
         * <p>A streamed out command handler.</p>
         * @param command - <p>The command message, this will be of the type of the gRPC service call input type.</p>
         * @param context - <p>The command context.</p>
         */
        type streamedOutCommandHandler = (command: any, context: Action.StreamedOutCommandContext) => void;
        /**
         * <p>A streamed command handler.</p>
         * @param context - <p>The command context.</p>
         */
        type streamedCommandHandler = (context: Action.StreamedCommandContext) => void;
        /**
         * <p>An action command handler.</p>
         */
        type ActionCommandHandler = Action.unaryCommandHandler | Action.streamedInCommandHandler | Action.streamedOutCommandHandler | Action.streamedCommandHandler;
    }
    interface Action extends Component {
    }
    /**
     * <p>Create a new action.</p>
     * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
     * @param serviceName - <p>The fully qualified name of the service that provides this interface.</p>
     * @param [options] - <p>The options for this action</p>
     */
    class Action implements Component {
        constructor(desc: string | string[], serviceName: string, options?: Action.options);
        options: Action.options;
        serviceName: string;
        service: protobuf.Service;
        /**
         * <p>Access to gRPC clients (with promisified unary methods).</p>
         */
        clients: GrpcClientLookup;
        /**
         * <p>The command handlers.</p>
         * <p>The names of the properties must match the names of the service calls specified in the gRPC descriptor</p>
         */
        commandHandlers: {
            [key: string]: Action.ActionCommandHandler;
        };
        /**
         * @returns <p>action component type.</p>
         */
        componentType(): string;
        /**
         * <p>Lookup a protobuf message type.</p>
         * <p>This is provided as a convenience to lookup protobuf message types for use with events and snapshots.</p>
         * @param messageType - <p>The fully qualified name of the type to lookup.</p>
         * @returns <p>The protobuf message type.</p>
         */
        lookupType(messageType: string): protobuf.Type;
        /**
         * <p>Set the command handlers for this action.</p>
         * @param handlers - <p>The command handlers.</p>
         * @returns <p>This action.</p>
         */
        setCommandHandlers(handlers: {
            [key: string]: Action.ActionCommandHandler;
        }): Action;
    }
    /**
     * <p>CloudEvent data.</p>
     * <p>This exposes CloudEvent data from metadata. Changes made to the Cloudevent are reflected in the backing metadata,
     * as are changes to the backing metadata reflected in this CloudEvent.</p>
     * @param metadata - <p>The metadata backing this CloudEvent.</p>
     */
    class Cloudevent {
        constructor(metadata: Metadata);
        /**
         * <p>The metadata backing this CloudEvent.</p>
         */
        readonly metadata: Metadata;
        /**
         * <p>The spec version</p>
         */
        readonly specversion: string | undefined;
        /**
         * <p>The id</p>
         */
        id: string | undefined;
        /**
         * <p>The source</p>
         */
        source: string | undefined;
        /**
         * <p>The type</p>
         */
        type: string | undefined;
        /**
         * <p>The datacontenttype</p>
         */
        datacontenttype: string | undefined;
        /**
         * <p>The dataschema</p>
         */
        dataschema: string | undefined;
        /**
         * <p>The subject</p>
         */
        subject: string | undefined;
        /**
         * <p>The time</p>
         */
        time: Date | undefined;
    }
    /**
     * <p>Context for an entity.</p>
     * @property entityId - <p>The id of the entity that the command is for.</p>
     * @property commandId - <p>The id of the command.</p>
     * @property replyMetadata - <p>The metadata to send with a reply.</p>
     */
    interface EntityContext {
        entityId: string;
        commandId: Long;
        replyMetadata: Metadata;
    }
    /**
     * <p>Effect context.</p>
     * @property metadata - <p>The metadata associated with the command.</p>
     */
    interface EffectContext {
        metadata: Metadata;
        /**
         * <p>DEPRECATED. Emit an effect after processing this command.</p>
         * @param method - <p>The entity service method to invoke.</p>
         * @param message - <p>The message to send to that service.</p>
         * @param [synchronous] - <p>Whether the effect should be execute synchronously or not.</p>
         * @param [metadata] - <p>Metadata to send with the effect.</p>
         * @param [internalCall] - <p>For internal calls to this deprecated function.</p>
         */
        effect(method: any, message: any, synchronous?: boolean, metadata?: Metadata, internalCall?: boolean): void;
        /**
         * <p>Fail handling this command.</p>
         * <p>An alternative to using this is to return a failed Reply created with 'ReplyFactory.failed'.</p>
         * @param msg - <p>The failure message.</p>
         * @param [grpcStatus] - <p>The grpcStatus.</p>
         */
        fail(msg: string, grpcStatus?: number): void;
    }
    /**
     * <p>Context for a command.</p>
     */
    interface CommandContext extends EffectContext {
        /**
         * <p>DEPRECATED. Forward this command to another service component call.</p>
         * @param method - <p>The service component method to invoke.</p>
         * @param message - <p>The message to send to that service component.</p>
         * @param metadata - <p>Metadata to send with the forward.</p>
         */
        thenForward(method: any, message: any, metadata: Metadata): void;
        /**
         * <p>DEPRECATED. Forward this command to another service component call, use 'ReplyFactory.forward' instead.</p>
         * @param method - <p>The service component method to invoke.</p>
         * @param message - <p>The message to send to that service component.</p>
         * @param [metadata] - <p>Metadata to send with the forward.</p>
         * @param [internalCall] - <p>For internal calls to this deprecated function.</p>
         */
        forward(method: any, message: any, metadata?: Metadata, internalCall?: boolean): void;
    }
    namespace EventSourcedEntity {
        /**
         * <p>Context for an event sourced command.</p>
         */
        interface EventSourcedEntityCommandContext extends CommandContext, EntityContext {
            /**
             * <p>Persist an event.</p>
             * <p>The event won't be persisted until the reply is sent to the proxy. Then, the event will be persisted
             * before the reply is sent back to the client.</p>
             * @param event - <p>The event to emit.</p>
             */
            emit(event: Serializable): void;
        }
        /**
         * <p>An event sourced entity command handler.</p>
         * @param command - <p>The command message, this will be of the type of the gRPC service call input type.</p>
         * @param state - <p>The entity state.</p>
         * @param context - <p>The command context.</p>
         */
        type commandHandler = (command: any, state: Serializable, context: EventSourcedEntity.EventSourcedEntityCommandContext) => undefined | any | replies.Reply;
        /**
         * <p>An event sourced entity event handler.</p>
         * @param event - <p>The event.</p>
         * @param state - <p>The entity state.</p>
         */
        type eventHandler = (event: Serializable, state: Serializable) => Serializable;
        /**
         * <p>An event sourced entity behavior.</p>
         */
        type behavior = {
            /**
             * <p>The command handlers.</p>
            <p>The names of the properties must match the names of the service calls specified in the gRPC descriptor for this
            event sourced entities service.</p>
             */
            commandHandlers: {
                [key: string]: EventSourcedEntity.commandHandler;
            };
            /**
             * <p>The event handlers.</p>
            <p>The names of the properties must match the short names of the events.</p>
             */
            eventHandlers: {
                [key: string]: EventSourcedEntity.eventHandler;
            };
        };
        /**
         * <p>An event sourced entity behavior callback.</p>
         * <p>This callback takes the current entity state, and returns a set of handlers to handle commands and events for it.</p>
         * @param state - <p>The entity state.</p>
         */
        type behaviorCallback = (state: Serializable) => EventSourcedEntity.behavior;
        /**
         * <p>Initial state callback.</p>
         * <p>This is invoked if the entity is started with no snapshot.</p>
         * @param entityId - <p>The entity id.</p>
         */
        type initialCallback = (entityId: string) => Serializable;
        /**
         * <p>Options for an event sourced entity.</p>
         */
        type options = {
            /**
             * <p>A snapshot will be persisted every time this many events are emitted.
            It is strongly recommended to not disable snapshotting unless it is known that
            event sourced entities will never have more than 100 events (in which case
            the default will anyway not trigger any snapshots)</p>
             * @defaultValue 100
             */
            snapshotEvery?: number;
            /**
             * <p>The directories to include when looking up imported protobuf files.</p>
             * @defaultValue ["."]
             */
            includeDirs?: string[];
            /**
             * <p>Whether serialization of primitives should be supported when
            serializing events and snapshots.</p>
             */
            serializeAllowPrimitives?: boolean;
            /**
             * <p>Whether serialization should fallback to using JSON if an event
            or snapshot can't be serialized as a protobuf.</p>
             */
            serializeFallbackToJson?: boolean;
            /**
             * <p>request headers to be forwarded as metadata to the event sourced entity</p>
             * @defaultValue []
             */
            forwardHeaders?: string[];
            /**
             * <p>Entity passivation strategy to use.</p>
             */
            entityPassivationStrategy?: EventSourcedEntity.entityPassivationStrategy;
        };
        /**
         * <p>Entity passivation strategy for an event sourced entity.</p>
         */
        type entityPassivationStrategy = {
            /**
             * <p>Passivation timeout (in milliseconds).</p>
             */
            timeout?: number;
        };
    }
    interface EventSourcedEntity extends Entity {
    }
    /**
     * <p>Create a new event sourced entity.</p>
     * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
     * @param serviceName - <p>The fully qualified name of the service that provides this entities interface.</p>
     * @param entityType - <p>The entity type name for all event source entities of this type. This will be prefixed
     * onto the entityId when storing the events for this entity. Be aware that the
     * chosen name must be stable through the entity lifecycle.  Never change it after deploying
     * a service that stored data of this type</p>
     * @param [options] - <p>The options for this event sourced entity</p>
     */
    class EventSourcedEntity implements Entity {
        /**
         * <p>Create a new event sourced entity.</p>
         * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
         * @param serviceName - <p>The fully qualified name of the service that provides this entities interface.</p>
         * @param entityType - <p>The entity type name for all event source entities of this type. This will be prefixed
         * onto the entityId when storing the events for this entity. Be aware that the
         * chosen name must be stable through the entity lifecycle.  Never change it after deploying
         * a service that stored data of this type</p>
         * @param [options] - <p>The options for this event sourced entity</p>
         */
        constructor(desc: string | string[], serviceName: string, entityType: string, options?: EventSourcedEntity.options);
        options: EventSourcedEntity.options;
        serviceName: string;
        service: protobuf.Service;
        /**
         * <p>Access to gRPC clients (with promisified unary methods).</p>
         */
        clients: GrpcClientLookup;
        /**
         * @returns <p>event sourced entity component type.</p>
         */
        componentType(): string;
        /**
         * <p>Lookup a protobuf message type.</p>
         * <p>This is provided as a convenience to lookup protobuf message types for use with events and snapshots.</p>
         * @param messageType - <p>The fully qualified name of the type to lookup.</p>
         * @returns <p>The protobuf message type.</p>
         */
        lookupType(messageType: string): protobuf.Type;
        /**
         * <p>The initial state callback.</p>
         */
        initial: EventSourcedEntity.initialCallback;
        /**
         * <p>Set the initial state callback.</p>
         * @param callback - <p>The initial state callback.</p>
         * @returns <p>This entity.</p>
         */
        setInitial(callback: EventSourcedEntity.initialCallback): EventSourcedEntity;
        /**
         * <p>The behavior callback.</p>
         */
        behavior: EventSourcedEntity.behaviorCallback;
        /**
         * <p>Set the behavior callback.</p>
         * @param callback - <p>The behavior callback.</p>
         * @returns <p>This entity.</p>
         */
        setBehavior(callback: EventSourcedEntity.behaviorCallback): EventSourcedEntity;
    }
    /**
     * <p>gRPC client.</p>
     */
    interface GrpcClient extends grpc.Client {
    }
    /**
     * <p>gRPC client creator for a service.</p>
     */
    interface GrpcClientCreator {
        /**
         * <p>Create a new client for service.</p>
         * @param address - <p>the address for the service</p>
         * @param [credentials] - <p>the credentials for the connection</p>
         * @returns <p>a new gRPC client for the service</p>
         */
        createClient(address: string, credentials?: grpc.ChannelCredentials): GrpcClient;
    }
    /**
     * <p>gRPC client lookup, using fully qualified name for service.</p>
     */
    type GrpcClientLookup = {
        [key: string]: GrpcClientLookup|GrpcClientCreator;
    };
    /**
     * <p>Integration Testkit.</p>
     * @param [options] - <p>Options for the testkit and Kalix service.</p>
     */
    class IntegrationTestkit {
        constructor(options?: any);
        /**
         * <p>Add the given component to this testkit.</p>
         * @param component - <p>The component to add.</p>
         * @returns <p>This testkit.</p>
         */
        addComponent(component: Component): IntegrationTestkit;
        /**
         * <p>Start the testkit, with the registered components.</p>
         * @param callback - <p>Start callback, accepting possible error.</p>
         */
        start(callback: IntegrationTestkit.startCallback): void;
        /**
         * <p>Shut down the testkit.</p>
         * @param callback - <p>Shutdown callback, accepting possible error.</p>
         */
        shutdown(callback: IntegrationTestkit.shutdownCallback): void;
    }
    namespace IntegrationTestkit {
        /**
         * <p>Callback for start, accepting possible error.</p>
         * @param [error] - <p>Error on starting the testkit.</p>
         */
        type startCallback = (error?: Error) => void;
        /**
         * <p>Callback for shutdown, accepting possible error.</p>
         * @param [error] - <p>Error on shutting down the testkit.</p>
         */
        type shutdownCallback = (error?: Error) => void;
    }
    /**
     * <p>JWT claims.</p>
     * <p>This exposes an JWT claims that were extracted from the bearer token.</p>
     * @param metadata - <p>The metadata that the JWT claims com efrom.</p>
     */
    class JwtClaims {
        constructor(metadata: Metadata);
        /**
         * <p>The metadata backing this JWT claims object.</p>
         */
        readonly metadata: Metadata;
        /**
         * <p>The issuer</p>
         */
        readonly issuer: string | undefined;
        /**
         * <p>The subject</p>
         */
        readonly subject: string | undefined;
        /**
         * <p>The audience</p>
         */
        readonly audience: string | undefined;
        /**
         * <p>The expiration time</p>
         */
        readonly expirationTime: Date | undefined;
        /**
         * <p>The not before</p>
         */
        readonly notBefore: Date | undefined;
        /**
         * <p>The issued at</p>
         */
        readonly issuedAt: Date | undefined;
        /**
         * <p>The jwt id</p>
         */
        readonly jwtId: string | undefined;
        /**
         * <p>Get the string claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getString(name: string): string | undefined;
        /**
         * <p>Get the numeric claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getNumber(name: string): number | undefined;
        /**
         * <p>Get the numeric date claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getNumericDate(name: string): Date | undefined;
        /**
         * <p>Get the boolean claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getBoolean(name: string): boolean | undefined;
        /**
         * <p>Get the object claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getObject(name: string): any | undefined;
        /**
         * <p>Get the string array claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getStringArray(name: string): string[] | undefined;
        /**
         * <p>Get the numeric array claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getNumberArray(name: string): number[] | undefined;
        /**
         * <p>Get the boolean array claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getBooleanArray(name: string): boolean[] | undefined;
        /**
         * <p>Get the object array claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getObjectArray(name: string): object[] | undefined;
        /**
         * <p>Get the numeric date array claim with the given name.</p>
         * @param name - <p>The name of the claim.</p>
         * @returns <p>the claim, or undefined if it doesn't exist or is not of the right type.</p>
         */
        getNumericDateArray(name: string): Date[] | undefined;
    }
    /**
     * <p>Kalix Component.</p>
     */
    interface Component {
    }
    /**
     * <p>Kalix Entity.</p>
     */
    interface Entity extends Component {
    }
    /**
     * <p>Kalix service.</p>
     * @param [options] - <p>The options for starting the service.</p>
     */
    class Kalix {
        constructor(options?: KalixOptions);
        /**
         * <p>Add one or more components to this Kalix service.</p>
         * @param components - <p>The components to add.</p>
         * @returns <p>this Kalix service.</p>
         */
        addComponent(...components: Component[]): Kalix;
        /**
         * <p>Start the Kalix service.</p>
         * @param [binding] - <p>optional address/port binding to start the service on.</p>
         * @returns <p>A Promise of the bound port for this service.</p>
         */
        start(binding?: ServiceBinding): Promise<number>;
        /**
         * <p>Shut down the Kalix service.</p>
         */
        shutdown(): void;
        /**
         * <p>Shut down the Kalix service.</p>
         * @param callback - <p>shutdown callback, accepting possible error</p>
         */
        tryShutdown(callback: Kalix.shutdownCallback): void;
    }
    /**
     * @property [serviceName] - <p>The name of this service (defaults to name from package.json).</p>
     * @property [serviceVersion] - <p>The version of this service (defaults to version from package.json).</p>
     * @property [descriptorSetPath = "user-function.desc"] - <p>Path to a Protobuf FileDescriptor
     * set, as output by protoc --descriptor_set_out=somefile.desc. This file must contain all of the component services
     * that this Kalix service serves. See the <code>compile-descriptor</code> command for creating this file.</p>
     */
    interface KalixOptions {
    }
    /**
     * <p>Service binding with address and port.</p>
     * @property [address] - <p>The address to bind the Kalix service to.</p>
     * @property [port] - <p>The port to bind the Kalix service to.</p>
     */
    interface ServiceBinding {
    }
    namespace Kalix {
        /**
         * <p>Callback for tryShutdown, accepting possible error.</p>
         * @param [error] - <p>Error on shutting down the service.</p>
         */
        type shutdownCallback = (error?: Error) => void;
    }
    /**
     * <p>Replicated write consistency setting for replicated entities.</p>
     */
    enum ReplicatedWriteConsistency {
        LOCAL,
        MAJORITY,
        ALL
    }
    /**
     * <p>The GRPC status codes.</p>
     */
    enum GrpcStatus {
        Ok = 0,
        Cancelled = 1,
        Unknown = 2,
        InvalidArgument = 3,
        DeadlineExceeded = 4,
        NotFound = 5,
        AlreadyExists = 6,
        PermissionDenied = 7,
        ResourceExhausted = 8,
        FailedPrecondition = 9,
        Aborted = 10,
        OutOfRange = 11,
        Unimplemented = 12,
        Internal = 13,
        Unavailable = 14,
        DataLoss = 15,
        Unauthenticated = 16
    }
    /**
     * <p>A metadata value. Can either be a string or a buffer.</p>
     */
    type MetadataValue = string | Buffer;
    /**
     * @property key - <p>The key for this metadata entry.</p>
     * @property bytesValue - <p>The entry value as bytes.</p>
     * @property stringValue - <p>The entry value as a string.</p>
     */
    interface MetadataEntry {
    }
    /**
     * <p>Kalix metadata.</p>
     * <p>Metadata is treated as case insensitive on lookup, and case sensitive on set. Multiple values per key are supported,
     * setting a value will add it to the current values for that key. You should delete first if you wish to replace a
     * value.</p>
     * <p>Values can either be strings or byte buffers. If a non string or byte buffer value is set, it will be converted to
     * a string using toString.</p>
     * @param [entries = []] - <p>The list of entries</p>
     */
    class Metadata {
        constructor(entries?: MetadataEntry[]);
        /**
         * <p>The entries as a map of keys to single values.</p>
         * <p>This allows working with the metadata as if it's just a map with single values for each key.</p>
         * <p>Modifications to the object will be reflected by replacing all values for a given key with a single value for the<br>
         * key.</p>
         * <p>Keys are also treated case insensitively.</p>
         */
        readonly asMap: {
            [key: string]: string | Buffer | undefined;
        };
        /**
         * <p>The CloudEvent information extracted from the metadata.</p>
         */
        readonly cloudevent: Cloudevent;
        /**
         * <p>The JWT claims information extracted from the metadata.</p>
         */
        readonly jwtClaims: JwtClaims;
        /**
         * @returns <p>CloudEvent subject value.</p>
         */
        getSubject(): MetadataValue | undefined;
        /**
         * <p>Set the HTTP status code for the response when sending a successful response using HTTP transcoding.</p>
         * <p>This will only apply to responses that are being transcoded to plain HTTP from gRPC using the protobuf HTTP
         * annotations. When gRPC is being used, calling this has no effect.</p>
         * @param code - <p>The HTTP status code.</p>
         */
        setHttpStatusCode(code: number): void;
        /**
         * <p>Get all the values for the given key.</p>
         * <p>The key is case insensitive.</p>
         * @param key - <p>The key to get.</p>
         * @returns <p>All the values, or an empty array if no values exist for the key.</p>
         */
        get(key: string): MetadataValue[];
        /**
         * <p>Set a given key value.</p>
         * <p>This will append the key value to the metadata, it won't replace any existing values for existing keys.</p>
         * @param key - <p>The key to set.</p>
         * @param value - <p>The value to set.</p>
         * @returns <p>This updated metadata.</p>
         */
        set(key: string, value: any): Metadata;
        /**
         * <p>Delete all values with the given key.</p>
         * <p>The key is case insensitive.</p>
         * @param key - <p>The key to delete.</p>
         * @returns <p>This updated metadata.</p>
         */
        delete(key: string): Metadata;
        /**
         * <p>Whether there exists a metadata value for the given key.</p>
         * <p>The key is case insensitive.</p>
         * @param key - <p>The key to check.</p>
         * @returns <p>Whether values exist for the given key.</p>
         */
        has(key: string): boolean;
        /**
         * <p>Clear the metadata.</p>
         * @returns <p>This updated metadata.</p>
         */
        clear(): Metadata;
    }
    /**
     * <p>This is any type that has been returned by the protobufjs Message.create method.</p>
     * <p>It should have a encode() method on it.</p>
     */
    type SerializableProtobufMessage = any;
    /**
     * <p>Any type that has a type property on it can be serialized as JSON, with the value of the type property describing
     * the type of the value.</p>
     */
    type TypedJson = {
        /**
         * <p>The type of the object.</p>
         */
        type: string;
    };
    /**
     * <p>A type that is serializable.</p>
     */
    type Serializable = SerializableProtobufMessage | TypedJson | any | string | number | boolean | Long | Buffer;
    /**
     * <p>All Replicated Data types and Replicated Data type support classes.</p>
     */
    namespace replicatedentity {
        interface ReplicatedCounterMap extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A replicated map of counters.</p>
         */
        class ReplicatedCounterMap implements replicatedentity.ReplicatedData {
            /**
             * <p>Get the value at the given key.</p>
             * @param key - <p>The key to get.</p>
             * @returns <p>The counter value, or undefined if no value is defined at that key.</p>
             */
            get(key: Serializable): number | undefined;
            /**
             * <p>Get the value as a long at the given key.</p>
             * @param key - <p>The key to get.</p>
             * @returns <p>The counter value as a long, or undefined if no value is defined at that key.</p>
             */
            getLong(key: Serializable): Long | undefined;
            /**
             * <p>Increment the counter at the given key by the given number.</p>
             * @param key - <p>The key for the counter to increment.</p>
             * @param increment - <p>The amount to increment the counter by. If negative, it will be decremented instead.</p>
             * @returns <p>This counter map.</p>
             */
            increment(key: Serializable, increment: Long | number): replicatedentity.ReplicatedCounterMap;
            /**
             * <p>Decrement the counter at the given key by the given number.</p>
             * @param key - <p>The key for the counter to decrement.</p>
             * @param decrement - <p>The amount to decrement the counter by. If negative, it will be incremented instead.</p>
             * @returns <p>This counter map.</p>
             */
            decrement(key: Serializable, decrement: Long | number): replicatedentity.ReplicatedCounterMap;
            /**
             * <p>Check whether this map contains a value of the given key.</p>
             * @param key - <p>The key to check.</p>
             * @returns <p>True if this counter map contains a value for the given key.</p>
             */
            has(key: Serializable): boolean;
            /**
             * <p>The number of elements in this map.</p>
             */
            readonly size: number;
            /**
             * <p>Return an iterator of the keys of this counter map.</p>
             */
            keys(): IterableIterator<Serializable>;
            /**
             * <p>Delete the counter at the given key.</p>
             * @param key - <p>The key to delete.</p>
             * @returns <p>This counter map.</p>
             */
            delete(key: Serializable): replicatedentity.ReplicatedCounterMap;
            /**
             * <p>Clear all counters from this counter map.</p>
             * @returns <p>This counter map.</p>
             */
            clear(): replicatedentity.ReplicatedCounterMap;
        }
        interface ReplicatedCounter extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A Replicated Counter data type.</p>
         * <p>A counter that can be incremented and decremented.</p>
         * <p>The value is stored as a 64-bit signed long, hence values over <code>2^63 - 1</code> and less than <code>2^63</code> can't be represented.</p>
         */
        class ReplicatedCounter implements replicatedentity.ReplicatedData {
            /**
             * <p>The value as a long.</p>
             */
            readonly longValue: Long;
            /**
             * <p>The value as a number. Note that once the value exceeds <code>2^53</code>, this will not be an accurate
             * representation of the value. If you expect it to exceed <code>2^53</code>, {@link replicatedentity.ReplicatedCounter#longValue}
             * should be used instead.</p>
             */
            readonly value: number;
            /**
             * <p>Increment the counter by the given number.</p>
             * @param increment - <p>The amount to increment the counter by. If negative, it will be decremented instead.</p>
             * @returns <p>This counter.</p>
             */
            increment(increment: Long | number): replicatedentity.ReplicatedCounter;
            /**
             * <p>Decrement the counter by the given number.</p>
             * @param decrement - <p>The amount to decrement the counter by. If negative, it will be incremented instead.</p>
             * @returns <p>This counter.</p>
             */
            decrement(decrement: Long | number): replicatedentity.ReplicatedCounter;
        }
        /**
         * <p>A Replicated Data type.</p>
         */
        interface ReplicatedData {
        }
        /**
         * <p>A clock that may be used by {@link replicatedentity.ReplicatedRegister}.</p>
         */
        type Clock = number;
        /**
         * <p>An enum of all clocks that can be used by {@link replicatedentity.ReplicatedRegister}.</p>
         */
        enum Clocks {
            DEFAULT,
            REVERSE,
            CUSTOM,
            CUSTOM_AUTO_INCREMENT
        }
        interface ReplicatedMap extends replicatedentity.ReplicatedData, Iterable<Array<any>> {
        }
        /**
         * <p>A Replicated Map data type.</p>
         * <p>ReplicatedMaps are a mapping of keys (which can be any {@link Serializable}) to
         * Replicated Data types. Values of the map are merged together. Elements can be added and removed, however, when an
         * element is removed and then added again, it's possible that the old value will be merged with the new, depending on
         * whether the remove was replicated to all nodes before the add was.</p>
         * <p>Note that while the map may contain different types of Replicated Data for different keys, a given key may not change
         * its type, and doing so will likely result in the Replicated Data entering a non mergable state, from which it can't
         * recover.</p>
         */
        class ReplicatedMap implements replicatedentity.ReplicatedData, Iterable<Array<any>> {
            /**
             * <p>Generator for default values.</p>
             * <p>This is invoked by get when the current map has no Replicated Data defined for the key.</p>
             * <p>If this returns a Replicated Data object, it will be added to the map.</p>
             * <p>Care should be taken when using this, since it means that the get method can trigger elements to be created. If
             * using default values, the get method should not be used in queries where an empty value for the Replicated Data
             * means the value is not present.</p>
             */
            defaultValue: replicatedentity.ReplicatedMap.defaultValueCallback;
            /**
             * <p>Check whether this map contains a value of the given key.</p>
             * @param key - <p>The key to check.</p>
             * @returns <p>True if this map contains a value of the given key.</p>
             */
            has(key: Serializable): boolean;
            /**
             * <p>The number of elements in this map.</p>
             */
            readonly size: number;
            /**
             * <p>Execute the given callback for each element.</p>
             * @param callback - <p>The callback to handle each element.</p>
             */
            forEach(callback: replicatedentity.ReplicatedMap.forEachCallback): void;
            /**
             * <p>Return an iterator of the entries of this map.</p>
             */
            entries(): Iterator<any[]>;
            /**
             * <p>Return an iterator of the entries of this map.</p>
             */
            iterator(): Iterator<any[]>;
            /**
             * <p>Return an iterator of the values of this map.</p>
             */
            values(): Iterator<replicatedentity.ReplicatedData>;
            /**
             * <p>Return an iterator of the keys of this map.</p>
             */
            keys(): Iterator<Serializable>;
            /**
             * <p>Get the value at the given key.</p>
             * @param key - <p>The key to get.</p>
             * @returns <p>The Replicated Data value, or undefined if no value is defined at that key.</p>
             */
            get(key: Serializable): undefined | replicatedentity.ReplicatedData;
            /**
             * <p>A representation of this map as an object.</p>
             * <p>All entries whose keys are strings will be properties of this object, and setting any property of the object will
             * insert that property as a key into the map.</p>
             */
            asObject: {
                [key: string]: replicatedentity.ReplicatedData;
            };
            /**
             * <p>Set the given value for the given key.</p>
             * @param key - <p>The key to set.</p>
             * @param value - <p>The value to set.</p>
             * @returns <p>This map.</p>
             */
            set(key: Serializable, value: replicatedentity.ReplicatedData): replicatedentity.ReplicatedMap;
            /**
             * <p>Delete the value at the given key.</p>
             * @param key - <p>The key to delete.</p>
             * @returns <p>This map.</p>
             */
            delete(key: Serializable): replicatedentity.ReplicatedMap;
            /**
             * <p>Clear all entries from this map.</p>
             * @returns <p>This map.</p>
             */
            clear(): replicatedentity.ReplicatedMap;
        }
        interface ReplicatedMultiMap extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A replicated multimap (map of sets).</p>
         * <p>A replicated map that maps keys to values, where each key may be associated with multiple values.</p>
         */
        class ReplicatedMultiMap implements replicatedentity.ReplicatedData {
            /**
             * <p>Get the values for the given key.</p>
             * @param key - <p>The key of the entry.</p>
             * @returns <p>The current values at the given key, or an empty Set.</p>
             */
            get(key: Serializable): Set<Serializable>;
            /**
             * <p>Store a key-value pair.</p>
             * @param key - <p>The key of the entry.</p>
             * @param value - <p>The value to add to the entry.</p>
             * @returns <p>This multimap.</p>
             */
            put(key: Serializable, value: Serializable): replicatedentity.ReplicatedMultiMap;
            /**
             * <p>Store multiple values for a key.</p>
             * @param key - <p>The key of the entry.</p>
             * @param values - <p>The values to add to the entry.</p>
             * @returns <p>This multimap.</p>
             */
            putAll(key: Serializable, values: Iterator<Serializable>): replicatedentity.ReplicatedMultiMap;
            /**
             * <p>Delete a single key-value pair for the given key and value.</p>
             * @param key - <p>The key of the entry.</p>
             * @param value - <p>The value to remove from the entry.</p>
             * @returns <p>This multimap.</p>
             */
            delete(key: Serializable, value: Serializable): replicatedentity.ReplicatedMultiMap;
            /**
             * <p>Delete all values associated with the given key.</p>
             * @param key - <p>The key of the entry.</p>
             * @returns <p>This multimap.</p>
             */
            deleteAll(key: Serializable): replicatedentity.ReplicatedMultiMap;
            /**
             * <p>Check whether this multimap contains at least one value for the given key.</p>
             * @param key - <p>The key to check.</p>
             * @returns <p>True if this multimap contains any values for the given key.</p>
             */
            has(key: Serializable): boolean;
            /**
             * <p>Check whether this multimap contains the given value associated with the given key.</p>
             * @param key - <p>The key to check.</p>
             * @param value - <p>The value to check.</p>
             * @returns <p>True if the key-value pair is in this multimap.</p>
             */
            hasValue(key: Serializable, value: Serializable): boolean;
            /**
             * <p>The total number of values stored in the multimap.</p>
             */
            readonly size: number;
            /**
             * <p>The number of keys with values stored in the multimap.</p>
             */
            readonly keysSize: number;
            /**
             * <p>Return an iterator of the keys of this multimap.</p>
             */
            keys(): IterableIterator<Serializable>;
            /**
             * <p>Clear all entries from this multimap.</p>
             * @returns <p>This multimap.</p>
             */
            clear(): replicatedentity.ReplicatedMultiMap;
        }
        interface ReplicatedRegisterMap extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A replicated map of registers.</p>
         */
        class ReplicatedRegisterMap implements replicatedentity.ReplicatedData {
            /**
             * <p>Get the value at the given key.</p>
             * @param key - <p>The key to get.</p>
             * @returns <p>The register value, or undefined if no value is defined at that key.</p>
             */
            get(key: Serializable): number | undefined;
            /**
             * <p>Set the register at the given key to the given value.</p>
             * @param key - <p>The key for the register.</p>
             * @param value - <p>The new value for the register.</p>
             * @param [clock = Clocks.DEFAULT] - <p>The register clock.</p>
             * @param [customClockValue = 0] - <p>Clock value when using custom clock, otherwise ignored.</p>
             * @returns <p>This register map.</p>
             */
            set(key: Serializable, value: Serializable, clock?: replicatedentity.Clock, customClockValue?: number): replicatedentity.ReplicatedRegisterMap;
            /**
             * <p>Check whether this map contains a value of the given key.</p>
             * @param key - <p>The key to check.</p>
             * @returns <p>True if this register map contains a value for the given key.</p>
             */
            has(key: Serializable): boolean;
            /**
             * <p>The number of elements in this map.</p>
             */
            readonly size: number;
            /**
             * <p>Return an iterator of the keys of this register map.</p>
             */
            keys(): IterableIterator<Serializable>;
            /**
             * <p>Delete the register at the given key.</p>
             * @param key - <p>The key to delete.</p>
             * @returns <p>This register map.</p>
             */
            delete(key: Serializable): replicatedentity.ReplicatedRegisterMap;
            /**
             * <p>Clear all registers from this register map.</p>
             * @returns <p>This register map.</p>
             */
            clear(): replicatedentity.ReplicatedRegisterMap;
        }
        interface ReplicatedRegister extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A Replicated Register data type.</p>
         * <p>A ReplicatedRegister uses a clock to determine which of two concurrent updates should win. The
         * last write wins. The clock is represented as a number. The default clock uses the proxies system
         * time, custom clocks can supply a custom number to be used. If two clock values are equal, the
         * write from the node with the lowest address wins.</p>
         * @param value - <p>A value to hold in the register.</p>
         * @param [clock = Clocks.DEFAULT] - <p>The clock to use.</p>
         * @param [customClockValue = 0] - <p>The custom clock value, if using a custom clock.</p>
         */
        class ReplicatedRegister implements replicatedentity.ReplicatedData {
            constructor(value: Serializable, clock?: replicatedentity.Clock, customClockValue?: number);
            /**
             * <p>The value of this register.</p>
             * <p>Setting it will cause it to be set with the default clock.</p>
             */
            value: Serializable;
            /**
             * <p>Set the value using a custom clock.</p>
             * @param value - <p>The value to set.</p>
             * @param [clock = Clocks.DEFAULT] - <p>The clock.</p>
             * @param [customClockValue = 0] - <p>Ignored if a custom clock isn't specified.</p>
             */
            setWithClock(value: Serializable, clock?: replicatedentity.Clock, customClockValue?: number): void;
        }
        interface ReplicatedSet extends replicatedentity.ReplicatedData, Iterable<Serializable> {
        }
        /**
         * <p>A Replicated Set data type.</p>
         * <p>A ReplicatedSet is a set of {@link Serializable} values. Elements can be added and removed.</p>
         */
        class ReplicatedSet implements replicatedentity.ReplicatedData, Iterable<Serializable> {
            /**
             * <p>Does this set contain the given element?</p>
             * @param element - <p>The element to check.</p>
             * @returns <p>True if the set contains the element.</p>
             */
            has(element: Serializable): boolean;
            /**
             * <p>The number of elements in this set.</p>
             */
            readonly size: number;
            /**
             * <p>Execute the given callback for each element.</p>
             * @param callback - <p>The callback to handle each element.</p>
             */
            forEach(callback: replicatedentity.ReplicatedSet.forEachCallback): void;
            /**
             * <p>Create an iterator for this set.</p>
             */
            iterator(): Iterator<Serializable>;
            /**
             * <p>Get a copy of the current elements as a Set.</p>
             */
            elements(): Set<Serializable>;
            /**
             * <p>Add an element to this set.</p>
             * @param element - <p>The element to add.</p>
             * @returns <p>This set.</p>
             */
            add(element: Serializable): replicatedentity.ReplicatedSet;
            /**
             * <p>Add multiple elements to this set.</p>
             * @param elements - <p>The elements to add.</p>
             * @returns <p>This set.</p>
             */
            addAll(elements: Iterator<Serializable>): replicatedentity.ReplicatedSet;
            /**
             * <p>Remove an element from this set.</p>
             * @param element - <p>The element to delete.</p>
             * @returns <p>This set.</p>
             */
            delete(element: Serializable): replicatedentity.ReplicatedSet;
            /**
             * <p>Remove all elements from this set.</p>
             * @returns <p>This set.</p>
             */
            clear(): replicatedentity.ReplicatedSet;
        }
        interface Vote extends replicatedentity.ReplicatedData {
        }
        /**
         * <p>A Vote Replicated Data type.</p>
         * <p>A Vote Replicated Data type allows all nodes an a cluster to vote on a condition, such as whether a user is online.</p>
         */
        class Vote implements replicatedentity.ReplicatedData {
            /**
             * <p>The number of nodes that have voted for this condition.</p>
             */
            readonly votesFor: number;
            /**
             * <p>The total number of nodes that have voted.</p>
             */
            readonly totalVoters: number;
            /**
             * <p>Whether at least one node has voted for this condition.</p>
             */
            readonly atLeastOne: boolean;
            /**
             * <p>Whether a majority of nodes have voted for this condition.</p>
             */
            readonly majority: boolean;
            /**
             * <p>Whether all of nodes have voted for this condition.</p>
             */
            readonly all: boolean;
            /**
             * <p>The current nodes vote.</p>
             * <p>Setting this will update the current nodes vote accordingly.</p>
             */
            vote: boolean;
        }
        /**
         * <p>Context for a Replicated Entity command handler.</p>
         */
        interface ReplicatedEntityCommandContext extends replicatedentity.StateManagementContext, CommandContext, EntityContext {
        }
        /**
         * <p>Context that allows managing a Replicated Entity's state.</p>
         */
        interface StateManagementContext {
            /**
             * <p>Delete this Replicated Entity.</p>
             */
            delete(): void;
            /**
             * <p>The Replicated Data state for a Replicated Entity.
             * It may only be set once, if it's already set, an error will be thrown.</p>
             */
            state: replicatedentity.ReplicatedData;
        }
        namespace ReplicatedEntity {
            /**
             * <p>Options for creating a Replicated Entity.</p>
             */
            type options = {
                /**
                 * <p>The directories to include when looking up imported protobuf files.</p>
                 * @defaultValue ["."]
                 */
                includeDirs?: string[];
                /**
                 * <p>Entity passivation strategy to use.</p>
                 */
                entityPassivationStrategy?: replicatedentity.ReplicatedEntity.entityPassivationStrategy;
                /**
                 * <p>Write consistency to use for this replicated entity.</p>
                 */
                replicatedWriteConsistency?: ReplicatedWriteConsistency;
            };
            /**
             * <p>Entity passivation strategy for a replicated entity.</p>
             */
            type entityPassivationStrategy = {
                /**
                 * <p>Passivation timeout (in milliseconds).</p>
                 */
                timeout?: number;
            };
            /**
             * <p>A command handler callback.</p>
             * @param command - <p>The command message, this will be of the type of the gRPC service call input type.</p>
             * @param context - <p>The command context.</p>
             */
            type commandHandler = (command: any, context: replicatedentity.ReplicatedEntityCommandContext) => undefined | any;
            /**
             * <p>A state set handler callback.</p>
             * <p>This is invoked whenever a new state is set on the Replicated Entity, to allow the state to be enriched with domain
             * specific properties and methods. This may be due to the state being set explicitly from a command handler on the
             * command context, or implicitly as the default value, or implicitly when a new state is received from the proxy.</p>
             * @param state - <p>The Replicated Data state that was set.</p>
             * @param entityId - <p>The id of the entity.</p>
             */
            type onStateSetCallback = (state: replicatedentity.ReplicatedData, entityId: string) => void;
            /**
             * <p>A callback that is invoked to create a default value if the Kalix proxy doesn't send an existing one.</p>
             * @param entityId - <p>The id of the entity.</p>
             */
            type defaultValueCallback = (entityId: string) => any;
        }
        namespace ReplicatedMap {
            /**
             * <p>Generator for default values.</p>
             * <p>This is invoked by get when the current map has no Replicated Data defined for the key.</p>
             * <p>If this returns a Replicated Data object, it will be added to the map.</p>
             * <p>Care should be taken when using this, since it means that the get method can trigger elements to be created. If
             * using default values, the get method should not be used in queries where an empty value for the Replicated Data
             * means the value is not present.</p>
             * @param key - <p>The key the default value is being generated for.</p>
             */
            type defaultValueCallback = (key: Serializable) => undefined | replicatedentity.ReplicatedData;
            /**
             * <p>Callback for handling elements iterated through by {@link replicatedentity.ReplicatedMap#forEach}.</p>
             * @param value - <p>The Replicated Data value.</p>
             * @param key - <p>The key.</p>
             * @param This - <p>map.</p>
             */
            type forEachCallback = (value: replicatedentity.ReplicatedData, key: Serializable, This: ReplicatedMap) => void;
        }
        namespace ReplicatedSet {
            /**
             * <p>Callback for handling elements iterated through by {@link replicatedentity.ReplicatedSet#forEach}.</p>
             * @param element - <p>The element.</p>
             */
            type forEachCallback = (element: Serializable) => void;
        }
        interface ReplicatedEntity extends Entity {
        }
        /**
         * <p>Create a Replicated Entity.</p>
         * @param desc - <p>The file name of a protobuf descriptor or set of descriptors containing the
         * Replicated Entity service.</p>
         * @param serviceName - <p>The fully qualified name of the gRPC service that this Replicated Entity implements.</p>
         * @param entityType - <p>The entity type name, used to namespace entities of different Replicated Data
         * types in the same service.</p>
         * @param [options] - <p>The options for this entity.</p>
         */
        class ReplicatedEntity implements Entity {
            /**
             * <p>Create a Replicated Entity.</p>
             * @param desc - <p>The file name of a protobuf descriptor or set of descriptors containing the
             * Replicated Entity service.</p>
             * @param serviceName - <p>The fully qualified name of the gRPC service that this Replicated Entity implements.</p>
             * @param entityType - <p>The entity type name, used to namespace entities of different Replicated Data
             * types in the same service.</p>
             * @param [options] - <p>The options for this entity.</p>
             */
            constructor(desc: string | string[], serviceName: string, entityType: string, options?: replicatedentity.ReplicatedEntity.options);
            options: replicatedentity.ReplicatedEntity.options;
            serviceName: string;
            service: protobuf.Service;
            /**
             * <p>Access to gRPC clients (with promisified unary methods).</p>
             */
            clients: GrpcClientLookup;
            /**
             * <p>The command handlers.</p>
             * <p>The names of the properties must match the names of the service calls specified in the gRPC descriptor for this
             * Replicated Entity service.</p>
             */
            commandHandlers: {
                [key: string]: replicatedentity.ReplicatedEntity.commandHandler;
            };
            /**
             * <p>A callback that is invoked whenever the Replicated Data state is set for this Replicated Entity.</p>
             * <p>This is invoked whenever a new Replicated Data state is set on the Replicated Entity, to allow the state to be
             * enriched with domain specific properties and methods. This may be due to the state being set explicitly from a
             * command handler on the command context, or implicitly as the default value, or implicitly when a new state is
             * received from the proxy.</p>
             */
            onStateSet: replicatedentity.ReplicatedEntity.onStateSetCallback;
            /**
             * <p>A callback that is invoked to create a default value if the Kalix proxy doesn't send an existing one.</p>
             */
            defaultValue: replicatedentity.ReplicatedEntity.defaultValueCallback;
            /**
             * @returns <p>replicated entity component type.</p>
             */
            componentType(): string;
            /**
             * <p>Lookup a Protobuf message type.</p>
             * <p>This is provided as a convenience to lookup protobuf message types for use, for example, as values in sets and
             * maps.</p>
             * @param messageType - <p>The fully qualified name of the type to lookup.</p>
             * @returns <p>The protobuf message type.</p>
             */
            lookupType(messageType: string): protobuf.Type;
        }
    }
    /**
     * <p>Creating replies.</p>
     */
    namespace replies {
        /**
         * <p>Side effect for a reply.</p>
         * @param method - <p>The entity service method to invoke.</p>
         * @param message - <p>The message to send to that service.</p>
         * @param [synchronous = false] - <p>Whether the effect should be execute synchronously or not, default is false</p>
         * @param [metadata] - <p>Metadata to send with the effect.</p>
         */
        class Effect {
            constructor(method: protobuf.Method, message: any, synchronous?: boolean, metadata?: Metadata);
        }
        /**
         * <p>A return type to allow returning forwards or failures, and attaching effects to messages.</p>
         */
        class Reply {
            /**
             * @returns <p>The protobuf method for a forwarding reply.</p>
             */
            getMethod(): protobuf.Method | undefined;
            /**
             * <p>Set the protobuf method for a forwarding reply.</p>
             * @param method - <p>The protobuf method.</p>
             * @returns <p>The updated reply.</p>
             */
            setMethod(method: protobuf.Method): replies.Reply;
            /**
             * @returns <p>the reply message</p>
             */
            getMessage(): any;
            /**
             * <p>Set the message for this reply.</p>
             * @param message - <p>The reply message.</p>
             * @returns <p>The updated reply.</p>
             */
            setMessage(message: any): replies.Reply;
            /**
             * @returns <p>The metadata attached to the reply.</p>
             */
            getMetadata(): Metadata;
            /**
             * <p>Attach metadata to this reply.</p>
             * @param metadata - <p>Metadata to send with the reply.</p>
             * @returns <p>The updated reply.</p>
             */
            setMetadata(metadata: Metadata | undefined): replies.Reply;
            /**
             * @returns <p>The forwarding reply.</p>
             */
            getForward(): replies.Reply | undefined;
            /**
             * <p>Make this a forwarding reply.</p>
             * @param forward - <p>The forward reply.</p>
             * @returns <p>The updated reply.</p>
             */
            setForward(forward: replies.Reply): replies.Reply;
            /**
             * @returns <p>The failure description.</p>
             */
            getFailure(): replies.Failure | undefined;
            /**
             * <p>Make this a failure reply.</p>
             * @param failure - <p>The failure description.</p>
             * @param [status] - <p>the status code to fail with, defaults to Unknown.</p>
             * @returns <p>The updated reply.</p>
             */
            setFailure(failure: string, status?: GrpcStatus): replies.Reply;
            /**
             * @returns <p>The side effects for this reply.</p>
             */
            getEffects(): replies.Effect[];
            /**
             * <p>Attach the given effect to this reply.</p>
             * @param method - <p>The entity service method to invoke.</p>
             * @param message - <p>The message to send to that service.</p>
             * @param [synchronous = false] - <p>Whether the effect should be execute synchronously or not, default is false.</p>
             * @param [metadata] - <p>Metadata to send with the effect.</p>
             * @returns <p>This reply after adding the effect.</p>
             */
            addEffect(method: protobuf.Method, message: any, synchronous?: boolean, metadata?: Metadata): replies.Reply;
            /**
             * <p>Attach the given effects to this reply.</p>
             * @param effects - <p>One or more service calls to execute as side effects.</p>
             * @returns <p>This reply after adding the effects.</p>
             */
            addEffects(effects: Effect[]): replies.Reply;
            /**
             * <p>Whether this reply is empty: does not have a message, forward, or failure.</p>
             * @returns <p>Whether the reply is empty.</p>
             */
            isEmpty(): boolean;
        }
        /**
         * <p>Create a message reply.</p>
         * @param message - <p>The message to reply with.</p>
         * @param [metadata] - <p>Optional metadata to pass with the reply.</p>
         * @returns <p>A message reply.</p>
         */
        function message(message: any, metadata?: Metadata): replies.Reply;
        /**
         * <p>Create a forward reply.</p>
         * @param method - <p>The service call representing the forward.</p>
         * @param message - <p>The message to forward.</p>
         * @param [metadata] - <p>Optional metadata to pass with the forwarded message.</p>
         * @returns <p>A forward reply.</p>
         */
        function forward(method: protobuf.Method, message: any, metadata?: Metadata): replies.Reply;
        /**
         * <p>Create a failure reply.</p>
         * @param description - <p>A description of the failure.</p>
         * @param [status] - <p>the GRPC status, defaults to Unknown</p>
         * @returns <p>A failure reply.</p>
         */
        function failure(description: string, status?: GrpcStatus): replies.Reply;
        /**
         * <p>Create a reply that contains neither a message nor a forward nor a failure.</p>
         * <p>This may be useful for emitting effects without sending a message.</p>
         * @returns <p>An empty reply.</p>
         */
        function noReply(): replies.Reply;
        class Failure {
            getDescription(): string;
            getStatus(): GrpcStatus | undefined;
        }
    }
    namespace ValueEntity {
        /**
         * <p>Context for an value entity command.</p>
         */
        interface ValueEntityCommandContext extends CommandContext, EntityContext {
            /**
             * <p>Persist the updated state.</p>
             * <p>The state won't be persisted until the reply is sent to the proxy. Then, the state will be persisted
             * before the reply is sent back to the client.</p>
             * @param newState - <p>The state to store.</p>
             */
            updateState(newState: Serializable): void;
            /**
             * <p>Delete this entity.</p>
             */
            deleteState(): void;
        }
        /**
         * <p>Value entity command handlers
         * The names of the properties must match the names of the service calls specified in the gRPC descriptor for this value entities service.</p>
         */
        type commandHandlers = {
            [key: string]: ValueEntity.commandHandler;
        };
        /**
         * <p>A command handler for one service call to the value entity</p>
         * @param command - <p>The command message, this will be of the type of the gRPC service call input type.</p>
         * @param state - <p>The entity state.</p>
         * @param context - <p>The command context.</p>
         */
        type commandHandler = (command: any, state: Serializable, context: ValueEntity.ValueEntityCommandContext) => undefined | any | replies.Reply;
        /**
         * <p>Initial state callback.</p>
         * <p>This is invoked if the entity is started with no snapshot.</p>
         * @param entityId - <p>The entity id.</p>
         */
        type initialCallback = (entityId: string) => Serializable;
        /**
         * <p>Options for a value entity.</p>
         */
        type options = {
            /**
             * <p>The directories to include when looking up imported protobuf files.</p>
             * @defaultValue ["."]
             */
            includeDirs?: string[];
            /**
             * <p>Whether serialization of primitives should be supported when
            serializing the state.</p>
             */
            serializeAllowPrimitives?: boolean;
            /**
             * <p>Whether serialization should fallback to using JSON if the state
            can't be serialized as a protobuf.</p>
             */
            serializeFallbackToJson?: boolean;
            /**
             * <p>request headers to be forwarded as metadata to the value entity</p>
             * @defaultValue []
             */
            forwardHeaders?: string[];
            /**
             * <p>Entity passivation strategy to use.</p>
             */
            entityPassivationStrategy?: ValueEntity.entityPassivationStrategy;
        };
        /**
         * <p>Entity passivation strategy for a value entity.</p>
         */
        type entityPassivationStrategy = {
            /**
             * <p>Passivation timeout (in milliseconds).</p>
             */
            timeout?: number;
        };
    }
    interface ValueEntity extends Entity {
    }
    /**
     * <p>Create a new value entity.</p>
     * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
     * @param serviceName - <p>The fully qualified name of the service that provides this entities interface.</p>
     * @param entityType - <p>The entity type name for all value entities of this type. Never change it after deploying
     * a service that stored data of this type</p>
     * @param [options] - <p>The options for this entity</p>
     */
    class ValueEntity implements Entity {
        /**
         * <p>Create a new value entity.</p>
         * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
         * @param serviceName - <p>The fully qualified name of the service that provides this entities interface.</p>
         * @param entityType - <p>The entity type name for all value entities of this type. Never change it after deploying
         * a service that stored data of this type</p>
         * @param [options] - <p>The options for this entity</p>
         */
        constructor(desc: string | string[], serviceName: string, entityType: string, options?: ValueEntity.options);
        options: ValueEntity.options;
        serviceName: string;
        service: protobuf.Service;
        /**
         * <p>Access to gRPC clients (with promisified unary methods).</p>
         */
        clients: GrpcClientLookup;
        /**
         * @returns <p>value entity component type.</p>
         */
        componentType(): string;
        /**
         * <p>Lookup a protobuf message type.</p>
         * <p>This is provided as a convenience to lookup protobuf message types for use with state.</p>
         * @param messageType - <p>The fully qualified name of the type to lookup.</p>
         * @returns <p>The protobuf message type.</p>
         */
        lookupType(messageType: string): protobuf.Type;
        /**
         * <p>The initial state callback.</p>
         */
        initial: ValueEntity.initialCallback;
        /**
         * <p>Set the initial state callback.</p>
         * @param callback - <p>The initial state callback.</p>
         * @returns <p>This entity.</p>
         */
        setInitial(callback: ValueEntity.initialCallback): ValueEntity;
        /**
         * <p>The command handlers.</p>
         */
        commandHandlers: ValueEntity.commandHandlers;
        /**
         * <p>Set the command handlers of the entity.</p>
         * @param handlers - <p>The command handler callbacks.</p>
         * @returns <p>This entity.</p>
         */
        setCommandHandlers(handlers: ValueEntity.commandHandlers): ValueEntity;
    }
    namespace View {
        /**
         * <p>Context for a view update event.</p>
         * @property metadata - <p>for the event</p>
         */
        interface UpdateHandlerContext {
        }
        /**
         * <p>Options for a view.</p>
         */
        type options = {
            /**
             * <p>The id for the view, used for persisting the view.</p>
             * @defaultValue serviceName
             */
            viewId?: string;
            /**
             * <p>The directories to include when looking up imported protobuf files.</p>
             * @defaultValue ["."]
             */
            includeDirs?: string[];
        };
        /**
         * <p>View handlers
         * The names of the properties must match the names of all the view methods specified in the gRPC
         * descriptor.</p>
         */
        type handlers = {
            [key: string]: View.handler;
        };
        /**
         * <p>A handler for transforming an incoming event and the previous view state into a new state</p>
         * @param event - <p>The event, this will be of the type of the gRPC event handler input type.</p>
         * @param state - <p>The previous view state or 'undefined' if no previous state was stored.</p>
         * @param context - <p>The view handler context.</p>
         */
        type handler = (event: any, state: undefined | Serializable, context: View.UpdateHandlerContext) => undefined | Serializable;
    }
    interface View extends Component {
    }
    /**
     * <p>Create a new view.</p>
     * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
     * @param serviceName - <p>The fully qualified name of the service that provides this interface.</p>
     * @param [options] - <p>The options for this view</p>
     */
    class View implements Component {
        /**
         * <p>Create a new view.</p>
         * @param desc - <p>A descriptor or list of descriptors to parse, containing the service to serve.</p>
         * @param serviceName - <p>The fully qualified name of the service that provides this interface.</p>
         * @param [options] - <p>The options for this view</p>
         */
        constructor(desc: string | string[], serviceName: string, options?: View.options);
        options: View.options;
        serviceName: string;
        service: protobuf.Service;
        /**
         * @returns <p>view component type.</p>
         */
        componentType(): string;
        /**
         * <p>Lookup a protobuf message type.</p>
         * <p>This is provided as a convenience to lookup protobuf message types.</p>
         * @param messageType - <p>The fully qualified name of the type to lookup.</p>
         * @returns <p>The protobuf message type.</p>
         */
        lookupType(messageType: string): protobuf.Type;
        /**
         * <p>Set the update handlers of the view. Only used for updates where event transformation is enabled through
         * &quot;transform_updates: true&quot; in the grpc descriptor.</p>
         * @param handlers - <p>The handler callbacks.</p>
         * @returns <p>This view.</p>
         */
        setUpdateHandlers(handlers: View.handlers): View;
    }
    namespace settings {
        const frameworkVersion: string;
        interface ProtocolVersion {
            major: string;
            minor: string;
        }
        function protocolVersion(): settings.ProtocolVersion;
        function baseVersion(): string;
    }
}


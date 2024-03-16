import EventDispatcher from "../../@shared/event/event-dispatcher"
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler"
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler"
import CustomerCreatedEvent from "./customer-created.event"
import { randomUUID } from "crypto"

describe("Customer created event test", () => {

    it("Deve registrar events handlers CustomerCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler1 = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"])
            .toBeDefined()
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length)
            .toBe(2)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0])
            .toBeInstanceOf(EnviaConsoleLog1Handler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1])
            .toBeInstanceOf(EnviaConsoleLog2Handler)
    })

    it("Deve cancelar events handler CustomerCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler1 = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0])
            .toBeInstanceOf(EnviaConsoleLog1Handler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1])
            .toBeInstanceOf(EnviaConsoleLog2Handler)

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length)
            .toBe(1)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0])
            .toBeInstanceOf(EnviaConsoleLog2Handler)

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length)
            .toBe(0)
    })

    it("Deve cancelar todos events handlers CustomerCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler1 = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0])
            .toBeInstanceOf(EnviaConsoleLog1Handler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1])
            .toBeInstanceOf(EnviaConsoleLog2Handler)

        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"])
            .toBeUndefined()
    })

    it("Deve notificar todos events handlers CustomerCreatedEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler1 = new EnviaConsoleLog1Handler()
        const eventHandler2 = new EnviaConsoleLog2Handler()

        const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle')
        const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0])
            .toBeInstanceOf(EnviaConsoleLog1Handler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1])
            .toBeInstanceOf(EnviaConsoleLog2Handler)

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: randomUUID(),
            name: "Customer event 1"
        })

        eventDispatcher.notify(customerCreatedEvent)

        expect(spyEventHandler1).toHaveBeenCalled()
        expect(spyEventHandler2).toHaveBeenCalled()
    })
})
import SendEmailWhenProductIsCreatedHandler from "./handler/send-email-when-product-is-created.handler"
import ProductCreatedEvent from "./product-created.event"
import EventDispatcher from "../@shared/event-dispatcher"
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler"
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler"
import CustomerCreatedEvent from "./customer-created.event"
import { randomUUID } from "crypto"
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler"
import CustomerChangedAddressEvent from "./customer-changed-address.event"

describe("Customer changed Address event test", () => {

    it("Deve registrar um event handlers CustomerChangedAddressEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLogHandler()

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"])
            .toBeDefined()
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length)
            .toBe(1)
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0])
            .toBeInstanceOf(EnviaConsoleLogHandler)
    })

    it("Deve cancelar event CustomerChangedAddressEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLogHandler()

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler)

        eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length)
            .toBe(0)
    })

    it("Deve cancelar todos events handlers CustomerChangedAddressEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLogHandler()

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler)

        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"])
            .toBeUndefined()
    })

    it("Deve notificar todos events handlers CustomerChangedAddressEvent", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new EnviaConsoleLogHandler()

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler)

        const spyEventHandler = jest.spyOn(eventHandler, 'handle')

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0])
            .toBeInstanceOf(EnviaConsoleLogHandler)

        const customerCreatedEvent = new CustomerChangedAddressEvent({
            id: randomUUID(),
            name: "Customer 1",
            Address: { 
                city: "CG",
                number: 1,
                zip: "12345-678",
                street: "Rua 1"
            }
        })

        eventDispatcher.notify(customerCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled()
    })
})
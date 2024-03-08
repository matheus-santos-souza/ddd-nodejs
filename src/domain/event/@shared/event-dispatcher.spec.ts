import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler"
import ProductCreatedEvent from "../product/product-created.event"
import EventDispatcher from "./event-dispatcher"

describe("Event dispatcher test", () => {

    it("Deve registrar um event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"])
            .toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length)
            .toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0])
            .toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)
    })

    it("Deve cancelar um event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0])
            .toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length)
            .toBe(0)
    })

    it("Deve cancelar todos events handlers", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0])
            .toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"])
            .toBeUndefined()
    })

    it("Deve notificar todos events handlers", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()
        const spyEventHandler = jest.spyOn(eventHandler, 'handle')

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0])
            .toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Description product 1",
            price: 10.0
        })

        eventDispatcher.notify(productCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled()
    })
})